const express = require("express");
const { uploadBrandImage: uploadBrandImageMiddleware } = require("../middlewares/uploadMiddleware");
const { uploadBrandImage } = require("../controllers/uploadController");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/brandValidator");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);

// Image upload route
router.post("/:id/image", getBrandValidator, uploadBrandImageMiddleware, uploadBrandImage);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
