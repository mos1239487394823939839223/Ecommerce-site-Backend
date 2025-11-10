const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Banner name is required"],
      trim: true,
      minlength: [3, "Banner name must be at least 3 characters"],
      maxlength: [100, "Banner name must be at most 100 characters"],
    },
    image: {
      type: String,
      required: [true, "Banner image is required"],
    },
    link: {
      type: String,
      required: [true, "Banner link is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
