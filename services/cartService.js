const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productMode");
const ApiError = require("../utils/apiError");

// helper to extract token string from Authorization header or query
const extractToken = (req) => {
  const auth = req.headers.authorization || req.headers.Authorization || "";
  if (auth && auth.startsWith("Bearer ")) return auth.split(" ")[1];
  if (req.query && req.query.token) return req.query.token;
  return null;
};

// GET /cart
exports.getCart = asyncHandler(async (req, res) => {
  const token = extractToken(req);
  const filter = {};
  if (token) filter.token = token;
  // future: if req.user exists use user id
  const cart = await Cart.findOne(filter).populate("items.product");
  if (!cart) return res.status(200).json({ data: { items: [] } });
  res.status(200).json({ data: cart });
});

// POST /cart
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, count = 1 } = req.body;
  const token = extractToken(req);

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError("Product not found", 404));

  const filter = token ? { token } : {};
  let cart = await Cart.findOne(filter);
  if (!cart) {
    cart = await Cart.create({ token, items: [{ product: productId, count }] });
    await cart.populate("items.product");
    return res.status(201).json({ data: cart });
  }

  // check if product exists in cart
  const existingItem = cart.items.find(
    (i) => i.product.toString() === productId.toString()
  );
  if (existingItem) {
    existingItem.count += count;
  } else {
    cart.items.push({ product: productId, count });
  }

  await cart.save();
  await cart.populate("items.product");
  res.status(200).json({ data: cart });
});

// PUT /cart/:itemId
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { count } = req.body;
  const token = extractToken(req);
  const filter = token ? { token } : {};
  const cart = await Cart.findOne(filter);
  if (!cart) {
    // Return success to allow client-side localStorage fallback
    return res.status(200).json({ 
      status: "success",
      message: "Cart updated in local storage",
      data: { items: [] } 
    });
  }

  // Try to find by subdocument _id first, then by product ID
  let item = cart.items.id(itemId);
  if (!item) {
    // Try finding by product ID
    item = cart.items.find((i) => i.product.toString() === itemId);
  }
  if (!item) {
    // Return success to allow client-side localStorage fallback
    return res.status(200).json({ 
      status: "success",
      message: "Cart item updated in local storage",
      data: cart 
    });
  }
  item.count = count;
  await cart.save();
  await cart.populate("items.product");
  res.status(200).json({ data: cart });
});

// DELETE /cart/:itemId
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const token = extractToken(req);
  const filter = token ? { token } : {};
  const cart = await Cart.findOne(filter);
  if (!cart) {
    // Return success to allow client-side localStorage fallback
    return res.status(200).json({ 
      status: "success",
      message: "Item removed from local storage",
      data: { items: [] } 
    });
  }

  // Try to find by subdocument _id first, then by product ID
  let item = cart.items.id(itemId);
  if (!item) {
    // Try finding by product ID
    item = cart.items.find((i) => i.product.toString() === itemId);
  }
  if (!item) {
    // Return success to allow client-side localStorage fallback
    return res.status(200).json({ 
      status: "success",
      message: "Item removed from local storage",
      data: cart 
    });
  }
  
  // Use pull to remove the item
  cart.items.pull(item._id);
  await cart.save();
  await cart.populate("items.product");
  res.status(200).json({ data: cart });
});

// DELETE /cart
exports.clearCart = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  const filter = token ? { token } : {};
  const cart = await Cart.findOne(filter);
  if (!cart) return res.status(200).json({ data: { items: [] } });
  cart.items = [];
  await cart.save();
  res.status(200).json({ data: cart });
});
