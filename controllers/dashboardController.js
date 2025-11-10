const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Product = require("../models/productMode");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const SubCategory = require("../models/subCategoryModel");
const Order = require("../models/orderModel");

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts
  const [
    totalUsers,
    totalProducts,
    totalCategories,
    totalBrands,
    totalSubcategories,
    totalOrders,
    activeUsers,
    adminUsers,
    recentUsers,
    recentProducts,
    lowStockProducts,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Brand.countDocuments(),
    SubCategory.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ active: true }),
    User.countDocuments({ role: "admin" }),
    User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
    Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("category", "name")
      .populate("brand", "name"),
    Product.find({ quantity: { $lt: 10 } })
      .limit(5)
      .select("title quantity imageCover"),
  ]);

  // Calculate total revenue from all orders
  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalOrderPrice" },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  // Calculate product statistics
  const productStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        avgPrice: { $avg: "$price" },
        totalStock: { $sum: "$quantity" },
      },
    },
  ]);

  // Get products by category
  const productsByCategory = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: { $ifNull: ["$categoryInfo.name", "Uncategorized"] },
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Get products by brand
  const productsByBrand = await Product.aggregate([
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "_id",
        foreignField: "_id",
        as: "brandInfo",
      },
    },
    {
      $unwind: { path: "$brandInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: { $ifNull: ["$brandInfo.name", "No Brand"] },
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  // Get user growth (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      // Simple stats for dashboard overview
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      // Detailed overview
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCategories,
        totalBrands,
        totalSubcategories,
        activeUsers,
        adminUsers,
      },
      productStats: {
        totalValue: productStats[0]?.totalValue || 0,
        avgPrice: productStats[0]?.avgPrice || 0,
        totalStock: productStats[0]?.totalStock || 0,
        lowStockCount: lowStockProducts.length,
      },
      charts: {
        productsByCategory,
        productsByBrand,
        userGrowth,
      },
      recent: {
        users: recentUsers,
        products: recentProducts,
      },
      alerts: {
        lowStockProducts,
      },
    },
  });
});

// @desc    Get sales overview (mock data for now)
// @route   GET /api/admin/dashboard/sales
// @access  Private/Admin
exports.getSalesOverview = asyncHandler(async (req, res) => {
  // This would integrate with your order system when implemented
  const mockSalesData = {
    today: {
      sales: 0,
      orders: 0,
      revenue: 0,
    },
    thisWeek: {
      sales: 0,
      orders: 0,
      revenue: 0,
    },
    thisMonth: {
      sales: 0,
      orders: 0,
      revenue: 0,
    },
    chart: [],
  };

  res.status(200).json({
    status: "success",
    message: "Sales tracking will be available once order system is implemented",
    data: mockSalesData,
  });
});

// @desc    Get user analytics
// @route   GET /api/admin/dashboard/users-analytics
// @access  Private/Admin
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ active: { $ne: false } });
  const inactiveUsers = totalUsers - activeUsers;

  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  // User registration trend (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const registrationTrend = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" },
              ],
            },
          ],
        },
        count: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
      usersByRole,
      registrationTrend,
    },
  });
});

// @desc    Get product analytics
// @route   GET /api/admin/dashboard/products-analytics
// @access  Private/Admin
exports.getProductAnalytics = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const inStockProducts = await Product.countDocuments({ quantity: { $gt: 0 } });
  const outOfStockProducts = await Product.countDocuments({ quantity: 0 });
  const lowStockProducts = await Product.countDocuments({
    quantity: { $gt: 0, $lt: 10 },
  });

  // Price range distribution
  const priceRanges = await Product.aggregate([
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [0, 50, 100, 200, 500, 1000, 5000],
        default: "5000+",
        output: {
          count: { $sum: 1 },
          products: {
            $push: { title: "$title", price: "$price" },
          },
        },
      },
    },
  ]);

  // Most expensive products
  const mostExpensive = await Product.find()
    .sort({ price: -1 })
    .limit(5)
    .select("title price imageCover category brand")
    .populate("category", "name")
    .populate("brand", "name");

  // Products added per month
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const productsAddedTrend = await Product.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      overview: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        lowStockProducts,
      },
      priceRanges,
      mostExpensive,
      productsAddedTrend,
    },
  });
});

// @desc    Get recent activity
// @route   GET /api/admin/dashboard/activity
// @access  Private/Admin
exports.getRecentActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const [recentUsers, recentProducts, recentCategories, recentBrands] =
    await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("name email role createdAt"),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("title price createdAt")
        .populate("category", "name")
        .populate("brand", "name"),
      Category.find().sort({ createdAt: -1 }).limit(limit),
      Brand.find().sort({ createdAt: -1 }).limit(limit),
    ]);

  // Combine and sort all activities
  const activities = [];

  recentUsers.forEach((user) => {
    activities.push({
      type: "user",
      action: "registered",
      entity: user.name,
      details: user,
      timestamp: user.createdAt,
    });
  });

  recentProducts.forEach((product) => {
    activities.push({
      type: "product",
      action: "created",
      entity: product.title,
      details: product,
      timestamp: product.createdAt,
    });
  });

  recentCategories.forEach((category) => {
    activities.push({
      type: "category",
      action: "created",
      entity: category.name,
      details: category,
      timestamp: category.createdAt,
    });
  });

  recentBrands.forEach((brand) => {
    activities.push({
      type: "brand",
      action: "created",
      entity: brand.name,
      details: brand,
      timestamp: brand.createdAt,
    });
  });

  // Sort by timestamp descending
  activities.sort((a, b) => b.timestamp - a.timestamp);

  res.status(200).json({
    status: "success",
    results: activities.length,
    data: activities.slice(0, limit),
  });
});

