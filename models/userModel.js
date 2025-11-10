const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name required"],
      trim: true,
      minlength: [2, "Too short name"],
      maxlength: [50, "Too long name"],
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// instance method to compare password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

// create password reset code (plain code returned; hashed stored in DB)
userSchema.methods.createPasswordResetCode = function () {
  const crypto = require("crypto");
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  this.passwordResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  this.passwordResetVerified = false;
  return resetCode;
};

module.exports = mongoose.model("User", userSchema);
