const express = require("express");

const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} = require("../utils/validator/subCategoryValidator");

const {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  setFilterObject
} = require("../services/subCategoryService");

//  mergeParams : allows me to access params on other router
//  we need to access category id from category router take notes that we are in the subcategory router

const router = express.Router({mergeParams:true});

router.route("/").get(setFilterObject,getSubCategories).post(setCategoryIdToBody,createSubCategoryValidator,createSubCategory);

router.route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
