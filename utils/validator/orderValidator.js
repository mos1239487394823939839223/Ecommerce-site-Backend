const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createOrderValidator = [
  check("cartItems")
    .isArray({ min: 1 })
    .withMessage("Cart items must be an array with at least one item"),
  check("cartItems.*.product")
    .isMongoId()
    .withMessage("Invalid product ID"),
  check("cartItems.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Shipping address details are required"),
  check("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required"),
  check("paymentMethod")
    .optional()
    .isIn(["cash", "card"])
    .withMessage("Payment method must be either cash or card"),
  validatorMiddleware,
];

exports.getOrderValidator = [
  check("id").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];

exports.updateOrderStatusValidator = [
  check("id").isMongoId().withMessage("Invalid order ID format"),
  check("orderStatus")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
  validatorMiddleware,
];

exports.deleteOrderValidator = [
  check("id").isMongoId().withMessage("Invalid order ID format"),
  validatorMiddleware,
];

