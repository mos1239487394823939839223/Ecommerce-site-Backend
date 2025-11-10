const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addToCartValidator = [
  check("productId").isMongoId().withMessage("Invalid product id"),
  check("count")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Count must be an integer >= 1"),
  validatorMiddleware,
];

exports.updateCartItemValidator = [
  check("count").isInt({ min: 1 }).withMessage("Count must be an integer >= 1"),
  validatorMiddleware,
];

module.exports = exports;
