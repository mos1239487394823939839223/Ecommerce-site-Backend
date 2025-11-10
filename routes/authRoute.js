const express = require("express");

const router = express.Router();

const {
  signupValidator,
  loginValidator,
} = require("../utils/validator/authValidator");
const {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const {
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/validator/authValidator");

router.post("/signup", signupValidator, signup);
router.post("/signin", loginValidator, login);
router.post("/login", loginValidator, login); // Alias for signin to support frontend
router.post("/forgotPasswords", forgotPasswordValidator, forgotPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, verifyResetCode);
router.put("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = router;
