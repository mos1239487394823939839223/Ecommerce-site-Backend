const morgan = require("morgan");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { ensureUploadDirectoriesExist } = require("./utils/imageStore");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const authRoute = require("./routes/authRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const bannerRoute = require("./routes/bannerRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const orderRoute = require("./routes/orderRoute");
const userRoute = require("./routes/userRoute");

dotenv.config({ path: "config.env" });

// Note: for serverless environments we should avoid starting a long-lived listener
// or connecting to the DB automatically at import time. We only connect and
// start the listener when this file is run directly (node server.js).

// express app
const app = express();

// middlewars
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode is : ${process.env.NODE_ENV}`);
}
app.use(express.json());

// Ensure uploads directories exist and expose as static files
ensureUploadDirectoriesExist();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Mount Routes

app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/banners", bannerRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// Public banners endpoint (no auth required for viewing)
app.use("/banners", bannerRoute);

// Admin aliases to match frontend LOCAL_API_BASE = "/api/admin"
app.use("/api/admin/categories", categoryRoute);
app.use("/api/admin/subcategories", subCategoryRoute);
app.use("/api/admin/brands", brandRoute);
app.use("/api/admin/products", productRoute);
app.use("/api/admin/users", userRoute);

// Additional auth route aliases for frontend compatibility
app.use("/api/auth/local", authRoute); // For /api/auth/local/login
app.use("/backend/auth", authRoute); // For /backend/auth/signin

// Admin banners management
app.use("/api/admin/banners", bannerRoute);

// Backend aliases (same as /api/admin)
app.use("/backend/categories", categoryRoute);
app.use("/backend/subcategories", subCategoryRoute);
app.use("/backend/brands", brandRoute);
app.use("/backend/products", productRoute);
app.use("/backend/orders", orderRoute);
app.use("/backend/banners", bannerRoute);
app.use("/backend/users", userRoute);
app.use("/api/admin/orders", orderRoute);

// User routes are now handled by userRoute above
// Orders routes are now handled by orderRoute above

// Dashboard routes
app.use("/api/admin/dashboard", dashboardRoute);
app.use("/backend/dashboard", dashboardRoute); // Backend alias

// Global Error Handling middelware
// Basic root and favicon handlers to avoid 404s for health checks or browsers
app.get("/", (req, res) => {
  return res.json({ status: "success", message: "Ecommerce backend is running" });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.all(/.*/, (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 404));
});
app.use(globalError);

const PORT = process.env.PORT || 8000;

// If this module is run directly (node server.js), start the server and connect DB.
if (require.main === module) {
  (async () => {
    try {
      await dbConnection();
    } catch (err) {
      console.error("Failed to connect to DB. Exiting.", err);
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      console.log(`The app is running on port ${PORT}`);
    });

    // unhandled rejection error outside express
    process.on("unhandledRejection", (err) => {
      console.error(`Unhandled Rejection Error: ${err.name} : ${err.message}`);
      console.error(`Shutting down the server...`);
      server.close(() => {
        process.exit(1);
      });
    });
  })();
}

// Export the app for testing or to be imported by serverless wrappers
module.exports = app;
