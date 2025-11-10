const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters"),
  check("email").optional().isEmail().withMessage("Invalid email format"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];

