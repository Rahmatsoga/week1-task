const Item = require("../models/Item");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all inventory items
 * @route   GET /api/items
 * @access  Public
 */
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
    error: null,
  });
});

/**
 * @desc    Get a single inventory item by id
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: item, error: null });
});

/**
 * @desc    Create a new inventory item
 * @route   POST /api/items
 * @access  Public
 */
const createItem = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price } = req.body;

  const item = await Item.create({ name, sku, category, quantity, price });

  res.status(201).json({ success: true, data: item, error: null });
});

/**
 * @desc    Update an existing inventory item
 * @route   PUT /api/items/:id
 * @access  Public
 */
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the updated document
    runValidators: true, // re-run schema validation on update
  });

  if (!item) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: item, error: null });
});

/**
 * @desc    Delete an inventory item
 * @route   DELETE /api/items/:id
 * @access  Public
 */
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: item, error: null });
});

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
