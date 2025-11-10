const express = require("express");
const {
  getDashboardStats,
  getSalesOverview,
  getUserAnalytics,
  getProductAnalytics,
  getRecentActivity,
} = require("../controllers/dashboardController");

const router = express.Router();

// Dashboard statistics and analytics routes
router.get("/stats", getDashboardStats);
router.get("/sales", getSalesOverview);
router.get("/users-analytics", getUserAnalytics);
router.get("/products-analytics", getProductAnalytics);
router.get("/activity", getRecentActivity);

module.exports = router;

