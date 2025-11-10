const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        color: String,
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveredAt: Date,
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

// Populate product details when querying
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  next();
});

module.exports = mongoose.model("Order", orderSchema);

