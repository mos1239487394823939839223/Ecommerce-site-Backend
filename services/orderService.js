const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productMode");
const ApiError = require("../utils/apiError");

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private/User
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { cartItems, shippingAddress, paymentMethod } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return next(new ApiError("Cart items are required", 400));
  }

  // Calculate prices
  let totalOrderPrice = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ApiError(`Product not found: ${item.product}`, 404));
    }

    if (product.quantity < item.quantity) {
      return next(
        new ApiError(`Not enough stock for product: ${product.title}`, 400)
      );
    }

    const itemPrice = product.priceAfterDiscount || product.price;
    totalOrderPrice += itemPrice * item.quantity;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      color: item.color,
      price: itemPrice,
    });
  }

  // Add tax and shipping
  const taxPrice = totalOrderPrice * 0.1; // 10% tax
  const shippingPrice = totalOrderPrice > 100 ? 0 : 10; // Free shipping over $100
  totalOrderPrice += taxPrice + shippingPrice;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    cartItems: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "cash",
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });

  // Update product quantities
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity, sold: item.quantity },
    });
  }

  // Clear user's cart (if cart exists)
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    status: "success",
    data: order,
  });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // Filter by status if provided
  const filter = {};
  if (req.query.status) {
    filter.orderStatus = req.query.status;
  }
  if (req.query.isPaid !== undefined) {
    filter.isPaid = req.query.isPaid === "true";
  }

  const orders = await Order.find(filter).skip(skip).limit(limit).sort("-createdAt");

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    status: "success",
    results: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: orders,
  });
});

// @desc    Get specific order
// @route   GET /api/v1/orders/:id
// @access  Private/User
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }

  // Check if user owns this order or is admin
  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    return next(new ApiError("You are not authorized to access this order", 403));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

// @desc    Get logged user orders
// @route   GET /api/v1/orders/myOrders
// @access  Private/User
exports.getMyOrders = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  const total = await Order.countDocuments({ user: req.user._id });

  res.status(200).json({
    status: "success",
    results: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: orders,
  });
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return next(new ApiError("Order status is required", 400));
  }

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(orderStatus)) {
    return next(new ApiError(`Invalid order status. Valid: ${validStatuses.join(", ")}`, 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }

  order.orderStatus = orderStatus;

  if (orderStatus === "delivered") {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc    Update entire order (for admin)
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ApiError(`No order found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({ 
    status: "success", 
    message: "Order deleted successfully" 
  });
});

// @desc    Get order statistics
// @route   GET /api/v1/orders/stats
// @access  Private/Admin
exports.getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
  const processingOrders = await Order.countDocuments({ orderStatus: "processing" });
  const shippedOrders = await Order.countDocuments({ orderStatus: "shipped" });
  const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" });
  const cancelledOrders = await Order.countDocuments({ orderStatus: "cancelled" });
  const paidOrders = await Order.countDocuments({ isPaid: true });

  // Calculate total revenue
  const revenueData = await Order.aggregate([
    {
      $match: { isPaid: true },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalOrderPrice" },
        averageOrderValue: { $avg: "$totalOrderPrice" },
      },
    },
  ]);

  const revenue = revenueData[0] || { totalRevenue: 0, averageOrderValue: 0 };

  res.status(200).json({
    status: "success",
    data: {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      paidOrders,
      totalRevenue: revenue.totalRevenue,
      averageOrderValue: revenue.averageOrderValue,
    },
  });
});

