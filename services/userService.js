const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  // Filter options
  const filter = {};
  if (req.query.role) {
    filter.role = req.query.role;
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const total = await User.countDocuments(filter);

  // Return format compatible with frontend
  res.status(200).json({
    status: "success",
    results: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users, // Frontend checks: Array.isArray(response.data || response)
  });
});

// @desc    Get specific user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(new ApiError(`No user found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError("User with this email already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  // Remove password from response
  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    status: "success",
    data: userObj,
  });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Don't allow password update through this endpoint
  if (req.body.password) {
    return next(
      new ApiError("Use change password endpoint to update password", 400)
    );
  }

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return next(new ApiError(`No user found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(
      new ApiError(`No user found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ 
    status: "success", 
    message: "User deleted successfully" 
  });
});

// @desc    Toggle user active status
// @route   PUT /api/v1/users/:id/toggle-active
// @access  Private/Admin
exports.toggleUserActive = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(
      new ApiError(`No user found with id: ${req.params.id}`, 404)
    );
  }

  user.active = !user.active;
  await user.save();

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: "admin" });
  const regularUsers = await User.countDocuments({ role: "user" });

  // Get recent users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Get users created per month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const usersByMonth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      totalUsers,
      adminUsers,
      regularUsers,
      recentUsers,
      usersByMonth,
    },
  });
});

// @desc    Change user password
// @route   PUT /api/v1/users/:id/password
// @access  Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new ApiError("Password is required", 400));
  }

  if (password.length < 6) {
    return next(new ApiError("Password must be at least 6 characters", 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ApiError(`No user found with id: ${req.params.id}`, 404)
    );
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

