const express = require("express");
const subcategoriesRoute = require('./subCategoryRoute')
const { uploadCategoryImage: uploadCategoryImageMiddleware } = require("../middlewares/uploadMiddleware");
const { uploadCategoryImage } = require("../controllers/uploadController");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator
} = require("../utils/validator/categoryValidator");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router.use('/:categoryId/subcategories', subcategoriesRoute)

router.route("/").get(getCategories).post(createCategoryValidator,createCategory);

// Image upload route
router.post("/:id/image", getCategoryValidator, uploadCategoryImageMiddleware, uploadCategoryImage);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
