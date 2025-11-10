const express = require("express");
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} = require("../services/bannerService");
const {
  getBannerValidator,
  createBannerValidator,
  updateBannerValidator,
  deleteBannerValidator,
} = require("../utils/validator/bannerValidator");
const { uploadBannerImage: uploadBannerImageMiddleware } = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public route - get all banners
router.route("/").get(getBanners);

// Admin routes - create banner (can include image upload)
router.post("/", uploadBannerImageMiddleware, createBannerValidator, createBanner);

// Upload image to existing banner
router.post("/:id/image", getBannerValidator, uploadBannerImageMiddleware, uploadBannerImage);

// Admin routes - get, update, delete specific banner
router
  .route("/:id")
  .get(getBannerValidator, getBanner)
  .put(uploadBannerImageMiddleware, updateBannerValidator, updateBanner)
  .delete(deleteBannerValidator, deleteBanner);

module.exports = router;
