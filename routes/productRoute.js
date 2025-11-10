const express = require("express");
const { 
  uploadProductImage: uploadProductImageMiddleware,
  uploadProductImages: uploadProductImagesMiddleware 
} = require("../middlewares/uploadMiddleware");
const { 
  uploadProductImage,
  uploadProductImages 
} = require("../controllers/uploadController");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} = require("../utils/validator/productValidator");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator,createProduct);

// Image upload routes
router.post("/:id/image", getProductValidator, uploadProductImageMiddleware, uploadProductImage);
router.post("/:id/images", getProductValidator, uploadProductImagesMiddleware, uploadProductImages);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
