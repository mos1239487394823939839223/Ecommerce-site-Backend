const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Too short Product Title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is Required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      // price is numeric — remove string-only validators like `trim` and increase max to a reasonable numeric limit
      max: [1000000, "Price exceeds maximum allowed value"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    // Keep old field name for backward compatibility
    priceAfterDescount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product Image Cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong lo specific category "],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1.0 "],
      max: [5, "Rating nust be below or equal to 5.0 "],
    },
    ratingsQuntaty: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
