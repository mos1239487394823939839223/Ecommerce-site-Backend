const asyncHandler = require("express-async-handler");
const BannerModel = require("../models/bannerModel");
const ApiError = require("../utils/apiError");

// @desc    Get all banners
// @route   GET /api/v1/banners
// @access  Public
exports.getBanners = asyncHandler(async (req, res) => {
  const banners = await BannerModel.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .select('_id name image link'); // Only return fields frontend needs
  
  res.status(200).json({
    status: "success",
    results: banners.length,
    data: banners
  });
});

// @desc    Get specific banner by id
// @route   GET /api/v1/banners/:id
// @access  Public
exports.getBanner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const banner = await BannerModel.findById(id);
  if (!banner) {
    return next(new ApiError(`No banner found for this id: ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: banner });
});

// @desc    Create banner
// @route   POST /api/v1/banners
// @access  Private/Admin
exports.createBanner = asyncHandler(async (req, res) => {
  // If image is uploaded via file, set the image path
  if (req.file) {
    req.body.image = `/uploads/banners/${req.file.filename}`;
  }
  
  const banner = await BannerModel.create(req.body);
  res.status(201).json({ status: "success", data: banner });
});

// @desc    Update specific banner
// @route   PUT /api/v1/banners/:id
// @access  Private/Admin
exports.updateBanner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // If image is uploaded via file, set the image path
  if (req.file) {
    req.body.image = `/uploads/banners/${req.file.filename}`;
  }
  
  const banner = await BannerModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) {
    return next(new ApiError(`No banner found for this id: ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: banner });
});

// @desc    Delete specific banner
// @route   DELETE /api/v1/banners/:id
// @access  Private/Admin
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const banner = await BannerModel.findByIdAndDelete(id);
  if (!banner) {
    return next(new ApiError(`No banner found for this id: ${id}`, 404));
  }
  res.status(200).json({ 
    status: "success", 
    message: "Banner deleted successfully" 
  });
});

// @desc    Upload banner image
// @route   POST /api/v1/banners/:id/image
// @access  Private/Admin
exports.uploadBannerImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image file provided", 400));
  }

  const { id } = req.params;
  const imageUrl = `/uploads/banners/${req.file.filename}`;

  const banner = await BannerModel.findByIdAndUpdate(
    id,
    { image: imageUrl },
    { new: true }
  );

  if (!banner) {
    return next(new ApiError(`No banner found with id: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      banner,
      imageUrl,
    },
  });
});
