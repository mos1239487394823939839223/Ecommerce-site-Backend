const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productMode");
const ApiError = require("../utils/apiError");

// helper to extract token from Authorization header
const extractToken = (req) => {
  const auth = req.headers.authorization || req.headers.Authorization || "";
  if (auth && auth.startsWith("Bearer ")) return auth.split(" ")[1];
  if (req.query && req.query.token) return req.query.token;
  return null;
};

// GET /wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  const token = extractToken(req);
  const filter = {};
  if (token) filter.token = token;
  // future: if req.user exists use user id
  const wishlist = await Wishlist.findOne(filter).populate("products");
  if (!wishlist) return res.status(200).json({ data: { products: [] } });
  res.status(200).json({ data: wishlist });
});

// POST /wishlist
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const token = extractToken(req);

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError("Product not found", 404));

  const filter = token ? { token } : {};
  let wishlist = await Wishlist.findOne(filter);

  if (!wishlist) {
    wishlist = await Wishlist.create({ token, products: [productId] });
    await wishlist.populate("products");
    return res.status(201).json({ data: wishlist });
  }

  // check if product already in wishlist
  if (wishlist.products.includes(productId)) {
    return res.status(200).json({ data: wishlist });
  }

  wishlist.products.push(productId);
  await wishlist.save();
  await wishlist.populate("products");
  res.status(200).json({ data: wishlist });
});

// DELETE /wishlist/:productId
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const token = extractToken(req);
  const filter = token ? { token } : {};
  const wishlist = await Wishlist.findOne(filter);

  if (!wishlist) return next(new ApiError("Wishlist not found", 404));

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId.toString()
  );
  await wishlist.save();
  await wishlist.populate("products");
  res.status(200).json({ data: wishlist });
});
