const express = require("express");

const {
  createOrderValidator,
  getOrderValidator,
  updateOrderStatusValidator,
  deleteOrderValidator,
} = require("../utils/validator/orderValidator");

const {
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  getOrderStats,
} = require("../services/orderService");

// Authentication middleware (you'll need to create this)
// const { protect, allowTo } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes (add protect middleware when ready)
router.post("/", createOrderValidator, createOrder);

// User routes (add protect middleware when ready)
router.get("/myOrders", getMyOrders);

// Admin routes (add protect and allowTo('admin') middleware when ready)
router.get("/stats", getOrderStats);
router.get("/", getAllOrders);
router.get("/:id", getOrderValidator, getOrder);
router.put("/:id", updateOrder);
router.put("/:id/pay", getOrderValidator, updateOrderToPaid);
router.put("/:id/status", updateOrderStatusValidator, updateOrderStatus);
router.delete("/:id", deleteOrderValidator, deleteOrder);

module.exports = router;

