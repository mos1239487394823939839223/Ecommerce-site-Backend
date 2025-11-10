const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../models/productMode");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
// note: we avoid adding extra deps; we'll normalize bracketed query keys from req.query

// @desc        Get Products
// @route       GET /api/v1/prodcuts
// @access    Public

exports.getProducts = asyncHandler(async (req, res) => {
  // Use ApiFeatures to build the query (filter, search, sort, limit fields, paginate)
  const baseQuery = productModel
    .find()
    .populate({ path: "category", select: "name image -_id" })
    .populate({ path: "brand", select: "name image -_id" });

  const features = new ApiFeatures(req.query, baseQuery)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const prodcuts = await features.mongooseQuery;
  res
    .status(200)
    .json({ status: "success", results: prodcuts.length, data: prodcuts });
});

// @desc        Get Product By ID
// @route        /api/v1/products/:id
// @access     public

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel
    .findById(id)
    .populate({ path: "category", select: "name image -_id" })
    .populate({ path: "brand", select: "name image -_id" });
  if (!product) {
    return next(new ApiError(`There is no product with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: product });
});

// @ desc        Create Product
// @ route       POST   /api/v1/products
// @ access    Private

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res.status(201).json({ status: "success", data: product });
});

//@desc         Update Product
//@route        /api/v1/product/:id
//@access     Private

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`There is no product with this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: product });
});

//@desc         Delete Product
//@route        /api/v1/product/:id
//@access     Private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`There is no product with this id ${id}`, 404));
  }
  res.status(200).json({ 
    status: "success", 
    message: "Product deleted successfully" 
  });
});
