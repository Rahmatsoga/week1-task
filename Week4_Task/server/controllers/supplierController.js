const Supplier = require("../models/Supplier");
const Item = require("../models/Item");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all suppliers
 * @route   GET /api/suppliers
 * @access  Private
 */
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.status(200).json({ success: true, data: suppliers, error: null });
});

/**
 * @desc    Create a new supplier
 * @route   POST /api/suppliers
 * @access  Private
 */
const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactEmail, phone } = req.body;
  const supplier = await Supplier.create({ name, contactEmail, phone });
  res.status(201).json({ success: true, data: supplier, error: null });
});

/**
 * @desc    Delete a supplier — refuses if any item still references it,
 *          so items are never left pointing at a deleted supplier.
 * @route   DELETE /api/suppliers/:id
 * @access  Private
 */
const deleteSupplier = asyncHandler(async (req, res) => {
  const inUse = await Item.exists({ supplier: req.params.id });
  if (inUse) {
    res.status(409);
    throw new Error("Cannot delete a supplier that is still linked to inventory items.");
  }

  const supplier = await Supplier.findByIdAndDelete(req.params.id);
  if (!supplier) {
    res.status(404);
    throw new Error(`Supplier not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: supplier, error: null });
});

module.exports = { getSuppliers, createSupplier, deleteSupplier };
