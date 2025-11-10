const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
// @desc        Get Categories
// @route       GET /api/v1/categories
// @access    Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await categoryModel.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ status: "success", results: categories.length, data: categories });
});

// @desc        Get Category By ID
// @route        /api/v1/categories/:id
// @access     public

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`There is no category with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: category });
});

// @ desc        Create Category
// @ route       POST   /api/v1/categories
// @ access    Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  console.log('Creating category:', { name, image });
  
  const categoryData = {
    name,
    slug: slugify(name)
  };
  
  if (image) {
    categoryData.image = image;
  }
  
  const category = await categoryModel.create(categoryData);
  res.status(201).json({ status: "success", data: category });
});

//@desc         Update Category
//@route        /api/v1/category/:id
//@access     Private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, image } = req.body;

  // Build update object
  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = slugify(name);
  }
  if (image) {
    updateData.image = image;
  }

  const category = await categoryModel.findOneAndUpdate(
    { _id: id },
    updateData,
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`There is no category with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: category });
});

//@desc         Delete Category
//@route        /api/v1/category/:id
//@access     Private

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`There is no category with this id ${id}`, 404));
  }
  // Return 200 with JSON for frontend compatibility (instead of 204 No Content)
  res.status(200).json({ 
    status: "success", 
    message: "Category deleted successfully" 
  });
});
