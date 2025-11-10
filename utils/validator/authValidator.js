const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
  check("name").notEmpty().withMessage("Name is required").isLength({ min: 2 }),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  check("passwordConfirm")
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  validatorMiddleware,
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  validatorMiddleware,
];

exports.verifyResetCodeValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("resetCode").notEmpty().withMessage("Reset code is required"),
  validatorMiddleware,
];

exports.resetPasswordValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("resetCode").notEmpty().withMessage("Reset code is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  check("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
  validatorMiddleware,
];

module.exports = exports;
