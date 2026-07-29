const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Variant label is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "Variant SKU is required"],
      trim: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { _id: true }
);

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters"],
      maxlength: [120, "Item name cannot exceed 120 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
      unique: true,
      minlength: [3, "SKU must be at least 3 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "Uncategorized",
    },
    subCategory: {
      type: String,
      trim: true,
      default: "",
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    // Relational reference (Week 4): each Item optionally belongs to
    // one Supplier. Storing just the id here — not the supplier's full
    // details — is what makes this a genuine relational link rather
    // than duplicated data. See models/Supplier.js.
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },
    // Week 4: the uploaded product image. We store the server-relative
    // URL path (e.g. "/uploads/167213-mouse.jpg"), not the raw file
    // itself — the actual file lives on disk (see server/uploads/),
    // and this field is just a pointer to it, the same relational
    // pattern used for `supplier` above.
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

itemSchema.index({ name: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ supplier: 1 });

module.exports = mongoose.model("Item", itemSchema);
