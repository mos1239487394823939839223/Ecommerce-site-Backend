const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const SubCategoryModel = require("../models/subCategoryModel");



exports.setCategoryIdToBody=((req,res,next)=>{
   // Netsed Route
  if(!req.body.category) req.body.category = req.params.categoryId;
  next();
})

exports.setFilterObject= ((req,res,next)=>{
    let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
})
// @ desc        Create subCategory
// @ route       POST   /api/v1/categories
// @ access    Private

// i can use two types of routes in the following endpoint
// /api/v1/subcategories
// /api/v1/categories/categoryId/subcategries and from the previous one i can take the categoryId from the params

exports.createSubCategory = asyncHandler(async (req, res) => {
 
  const { name, category, image } = req.body;

  const subCategoryData = {
    name,
    slug: slugify(name),
    category,
  };

  if (image) {
    subCategoryData.image = image;
  }

  const subCategory = await SubCategoryModel.create(subCategoryData);
  res.status(201).json({ status: "success", data: subCategory });
});

// @desc        Get SubCategory By ID
// @route        /api/v1/categories/:id
// @access     public

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  // .populate({path:'category', select:'name -_id'});
  if (!subCategory) {
    return next(new ApiError(`There is no subcategory with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: subCategory });
});

//@desc         Update SubCategory
//@route        /api/v1/subcategory/:id
//@access     Private

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, image } = req.body;

  // Build update object
  const updateData = {};
  if (name) {
    updateData.name = name;
    updateData.slug = slugify(name);
  }
  if (category) {
    updateData.category = category;
  }
  if (image) {
    updateData.image = image;
  }

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    updateData,
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError(`There is no subcategory with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: subCategory });
});

//@desc         Delete SubCategory
//@route        /api/v1/subcategory/:id
//@access     Private

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`There is no category with this id ${id}`, 404));
  }
  res.status(200).json({ 
    status: "success", 
    message: "Subcategory deleted successfully" 
  });
});

// @desc        Get subCategories
// @route       GET /api/v1/subcategories
// @access    Public

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
// GET /api/v1/products/:productId/reviews
// ACCESS Public

exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategoryModel.find(req.filterObject)
    .skip(skip)
    .limit(limit);
  // .populate({path:'category', select:'name -_id'});
  res.status(200).json({ 
    status: "success", 
    results: subCategories.length, 
    data: subCategories 
  });
});


