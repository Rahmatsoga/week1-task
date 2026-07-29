const mongoose = require("mongoose");

/**
 * A Supplier is a genuinely separate entity from Item — it has its own
 * identity and its own collection in MongoDB. Items don't copy a
 * supplier's details into themselves; instead, each Item stores a
 * *reference* (an ObjectId) pointing at one Supplier document. This is
 * the "DB Relations" piece required this week: a real one-to-many
 * relationship (one supplier can supply many items), modeled the way
 * relational data is meant to be modeled, rather than duplicating the
 * same supplier info onto every single item record.
 */
const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      minlength: [2, "Supplier name must be at least 2 characters"],
      unique: true,
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
