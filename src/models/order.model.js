const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
    },
    address: {
      type: String, 
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Shipping",
        "Completed",
        "Cancel",
      ],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    reasonCancel: {
      type: String,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        productDiscount: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        totalPriceAfterDiscount: { type: Number, default: 0 },
      },
    ],
    appTransId: { type: String },
    isPaid: {type: Boolean, default: false},
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Order", orderSchema);
