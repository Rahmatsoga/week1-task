const mongoose = require("mongoose");

/**
 * A variant represents one purchasable version of a product — e.g. a
 * T-shirt in "Blue / Large" or a mouse in "Wireless / Black". This is
 * a sub-document schema: it doesn't get its own MongoDB collection,
 * it lives embedded directly inside its parent Item document.
 */
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
    // Nested category path, e.g. "Electronics > Computer Accessories".
    // Kept as a simple string for query simplicity, but structured so
    // it could be split/matched hierarchically if needed later.
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
    // Embedded sub-documents — a richer record than Week 1's flat item,
    // satisfying the "products with variants" requirement for Week 3.
    variants: {
      type: [variantSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes: dramatically speed up the queries this week's feature relies
// on (search by name, filter by category, sort by price/createdAt) by
// letting MongoDB look these up directly instead of scanning every
// document in the collection. A plain ascending index (rather than a
// full-text index) is used because the search below matches partial,
// case-insensitive substrings via regex, not whole-word text search.
itemSchema.index({ name: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Item", itemSchema);
