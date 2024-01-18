const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    viewed: {
      type: Number,
      defaultValue: 0,
    },
    rating: {
      type: Number,
      defaultValue: 0,
    },
    isDeleted: {
      type: Boolean,
      defaultValue: false,
    },
    feedbacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
