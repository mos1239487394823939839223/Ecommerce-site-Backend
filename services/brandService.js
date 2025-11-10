const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const brandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");
// @desc        Get Brands
// @route       GET /api/v1/brands
// @access    Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await brandModel.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ status: "success", results: brands.length, data: brands });
});

// @desc        Get brand By ID
// @route        /api/v1/brands/:id
// @access     public

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`There is no brand with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: brand });
});

// @ desc        Create brand
// @ route       POST   /api/v1/brands
// @ access    Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ status: "success", data: brand });
});

//@desc         Update brand
//@route        /api/v1/brand/:id
//@access     Private

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await brandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`There is no brand with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: brand });
});

//@desc         Delete brand
//@route        /api/v1/brand/:id
//@access     Private

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`There is no brand with this id ${id}`, 404));
  }
  res.status(200).json({ 
    status: "success", 
    message: "Brand deleted successfully" 
  });
});
