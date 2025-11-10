const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const productModel = require("../models/productMode");

// @desc    Upload category image
// @route   POST /api/v1/categories/:id/image
// @access  Private
exports.uploadCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image file provided", 400));
  }

  const { id } = req.params;
  const imageUrl = `/uploads/categories/${req.file.filename}`;

  const category = await categoryModel.findByIdAndUpdate(
    id,
    { image: imageUrl },
    { new: true }
  );

  if (!category) {
    return next(new ApiError(`No category found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
      imageUrl,
    },
  });
});

// @desc    Upload brand image
// @route   POST /api/v1/brands/:id/image
// @access  Private
exports.uploadBrandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image file provided", 400));
  }

  const { id } = req.params;
  const imageUrl = `/uploads/brands/${req.file.filename}`;

  const brand = await brandModel.findByIdAndUpdate(
    id,
    { image: imageUrl },
    { new: true }
  );

  if (!brand) {
    return next(new ApiError(`No brand found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      brand,
      imageUrl,
    },
  });
});

// @desc    Upload product cover image
// @route   POST /api/v1/products/:id/image
// @access  Private
exports.uploadProductImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image file provided", 400));
  }

  const { id } = req.params;
  const imageUrl = `/uploads/products/${req.file.filename}`;

  const product = await productModel.findByIdAndUpdate(
    id,
    { imageCover: imageUrl },
    { new: true }
  );

  if (!product) {
    return next(new ApiError(`No product found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
      imageUrl,
    },
  });
});

// @desc    Upload multiple product images (gallery)
// @route   POST /api/v1/products/:id/images
// @access  Private
exports.uploadProductImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ApiError("No image files provided", 400));
  }

  const { id } = req.params;
  const imageUrls = req.files.map((file) => `/uploads/products/${file.filename}`);

  const product = await productModel.findByIdAndUpdate(
    id,
    { images: imageUrls },
    { new: true }
  );

  if (!product) {
    return next(new ApiError(`No product found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
      imageUrls,
    },
  });
});

