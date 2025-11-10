const express = require("express");

const router = express.Router();

const {
  addToCartValidator,
  updateCartItemValidator,
} = require("../utils/validator/cartValidator");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../services/cartService");

router
  .route("/")
  .get(getCart)
  .post(addToCartValidator, addToCart)
  .delete(clearCart);

router
  .route("/:itemId")
  .put(updateCartItemValidator, updateCartItem)
  .delete(removeFromCart);

module.exports = router;
