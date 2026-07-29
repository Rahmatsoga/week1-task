const fs = require("fs");
const path = require("path");
const Item = require("../models/Item");
const asyncHandler = require("../middleware/asyncHandler");

const SORTABLE_FIELDS = new Set(["name", "price", "quantity", "createdAt"]);
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

/** Builds the public URL path for an uploaded file, e.g. "/uploads/16821-abc.jpg". */
const toImageUrl = (filename) => (filename ? `/uploads/${filename}` : "");

/** Safely deletes a previously uploaded image from disk, ignoring "file not found". */
const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Failed to delete image file ${filePath}:`, err.message);
    }
  });
};

/**
 * @desc    Get inventory items — paginated, searchable, filterable, sortable
 * @route   GET /api/items?search=&category=&sortBy=&order=&page=&limit=
 * @access  Private
 */
const getItems = asyncHandler(async (req, res) => {
  const {
    search = "",
    category = "",
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: escaped, $options: "i" };
  }

  if (category.trim() && category !== "all") {
    filter.category = category.trim();
  }

  const sortField = SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [items, totalCount] = await Promise.all([
    Item.find(filter)
      .populate("supplier", "name contactEmail phone") // "join" in the real supplier details
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum),
    Item.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    error: null,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
    },
  });
});

/**
 * @desc    Get a single inventory item by id
 * @route   GET /api/items/:id
 * @access  Private
 */
const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate("supplier", "name contactEmail phone");

  if (!item) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: item, error: null });
});

/**
 * @desc    Create a new inventory item, optionally with an uploaded image
 * @route   POST /api/items
 * @access  Private
 *
 * Because this route is submitted as multipart/form-data (not JSON),
 * the multer middleware (see routes/itemRoutes.js) runs first: it
 * writes any uploaded file to disk and populates req.file, while every
 * regular text field ends up in req.body exactly like a normal
 * request. Array/object fields (like variants) arrive as JSON strings
 * inside the form data and need an explicit JSON.parse here.
 */
const createItem = asyncHandler(async (req, res) => {
  const { name, sku, category, subCategory, quantity, price, supplier, variants } = req.body;

  let parsedVariants = [];
  if (variants) {
    try {
      parsedVariants = JSON.parse(variants);
    } catch {
      res.status(400);
      throw new Error("Variants must be valid JSON.");
    }
  }

  const item = await Item.create({
    name,
    sku,
    category,
    subCategory,
    quantity,
    price,
    supplier: supplier || null,
    variants: parsedVariants,
    imageUrl: toImageUrl(req.file?.filename),
  });

  const populated = await item.populate("supplier", "name contactEmail phone");

  res.status(201).json({ success: true, data: populated, error: null });
});

/**
 * @desc    Update an existing inventory item, optionally replacing its image
 * @route   PUT /api/items/:id
 * @access  Private
 */
const updateItem = asyncHandler(async (req, res) => {
  const existing = await Item.findById(req.params.id);
  if (!existing) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  const updates = { ...req.body };

  if (req.body.variants) {
    try {
      updates.variants = JSON.parse(req.body.variants);
    } catch {
      res.status(400);
      throw new Error("Variants must be valid JSON.");
    }
  }

  // If a new image was uploaded, swap it in and clean up the old file
  // from disk so uploads/ doesn't silently accumulate orphaned images.
  if (req.file) {
    deleteImageFile(existing.imageUrl);
    updates.imageUrl = toImageUrl(req.file.filename);
  }

  const item = await Item.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("supplier", "name contactEmail phone");

  res.status(200).json({ success: true, data: item, error: null });
});

/**
 * @desc    Delete an inventory item and its associated uploaded image
 * @route   DELETE /api/items/:id
 * @access  Private
 */
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  deleteImageFile(item.imageUrl);

  res.status(200).json({ success: true, data: item, error: null });
});

/**
 * @desc    Get the distinct list of categories currently in use
 * @route   GET /api/items/categories
 * @access  Private
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Item.distinct("category");
  res.status(200).json({ success: true, data: categories.sort(), error: null });
});

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getCategories,
};
