const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBannerValidator = [
  // validate route param :id
  param("id").isMongoId().withMessage("Invalid banner ID format"),
  validatorMiddleware,
];

exports.createBannerValidator = [
  check("name")
    .notEmpty()
    .withMessage("Banner name is required")
    .isLength({ min: 3 })
    .withMessage("Banner name must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Banner name must be at most 100 characters"),
  check("image")
    .optional() // Made optional since image can be uploaded via file
    .notEmpty()
    .withMessage("Banner image is required"),
  check("link").notEmpty().withMessage("Banner link is required"),
  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  check("order").optional().isNumeric().withMessage("Order must be a number"),
  validatorMiddleware,
];

exports.updateBannerValidator = [
  // validate route param :id
  param("id").isMongoId().withMessage("Invalid banner ID format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Banner name must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Banner name must be at most 100 characters"),
  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  check("order").optional().isNumeric().withMessage("Order must be a number"),
  validatorMiddleware,
];

exports.deleteBannerValidator = [
  // validate route param :id
  param("id").isMongoId().withMessage("Invalid banner ID format"),
  validatorMiddleware,
];
