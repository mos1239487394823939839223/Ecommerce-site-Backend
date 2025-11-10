const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || "change_this_secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id }, secret, { expiresIn });
};

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  // Include user and token at top level for frontend compatibility
  res.status(201).json({ status: "success", token, user: userObj, data: { user: userObj } });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ApiError("Please provide email and password", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = signToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  // Include user and token at top level for frontend compatibility
  res.status(200).json({ status: "success", token, user: userObj, data: { user: userObj } });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError("There is no user with that email", 404));

  const resetCode = user.createPasswordResetCode();
  await user.save({ validateBeforeSave: false });

  // In production you would send the resetCode via email. For development we return it in the response.
  res
    .status(200)
    .json({ status: "success", message: "Reset code sent", resetCode });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email, resetCode } = req.body;
  const crypto = require("crypto");
  const hashed = crypto.createHash("sha256").update(resetCode).digest("hex");
  const user = await User.findOne({ email }).select(
    "+passwordResetCode +passwordResetExpires +passwordResetVerified"
  );
  if (!user) return next(new ApiError("Invalid email or code", 400));
  if (user.passwordResetExpires < Date.now())
    return next(new ApiError("Reset code expired", 400));
  if (user.passwordResetCode !== hashed)
    return next(new ApiError("Invalid reset code", 400));

  user.passwordResetVerified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ status: "success", message: "Code verified" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, password } = req.body;
  const crypto = require("crypto");
  const hashed = crypto.createHash("sha256").update(resetCode).digest("hex");
  const user = await User.findOne({ email }).select(
    "+passwordResetCode +passwordResetExpires"
  );
  if (!user) return next(new ApiError("Invalid email or code", 400));
  if (user.passwordResetExpires < Date.now())
    return next(new ApiError("Reset code expired", 400));
  if (user.passwordResetCode !== hashed)
    return next(new ApiError("Invalid reset code", 400));

  user.password = password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = signToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  res.status(200).json({ status: "success", token, data: { user: userObj } });
});
