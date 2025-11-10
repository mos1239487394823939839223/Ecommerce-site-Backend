const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addToWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid product id"),
  validatorMiddleware,
];

exports.removeFromWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid product id"),
  validatorMiddleware,
];

module.exports = exports;
