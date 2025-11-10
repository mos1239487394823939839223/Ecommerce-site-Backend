const express = require("express");

const router = express.Router();

const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../utils/validator/wishlistValidator");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../services/wishlistService");

router.route("/").get(getWishlist).post(addToWishlistValidator, addToWishlist);

router
  .route("/:productId")
  .delete(removeFromWishlistValidator, removeFromWishlist);

module.exports = router;
