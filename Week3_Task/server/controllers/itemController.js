const Item = require("../models/Item");
const asyncHandler = require("../middleware/asyncHandler");

// Fields the frontend is allowed to sort by. An allowlist prevents
// someone from passing an arbitrary/unindexed field via the query
// string and forcing an expensive, unindexed sort on the database.
const SORTABLE_FIELDS = new Set(["name", "price", "quantity", "createdAt"]);

/**
 * @desc    Get inventory items — paginated, searchable, filterable, sortable
 * @route   GET /api/items?search=&category=&sortBy=&order=&page=&limit=
 * @access  Private
 *
 * Every part of this endpoint's behavior is driven entirely by query
 * parameters, so the exact same endpoint serves the default view, a
 * search, a filtered view, a sorted view, or any combination — all
 * resolved as a single, efficient MongoDB query rather than fetching
 * everything and filtering in JavaScript.
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

  // ---- Build the filter object MongoDB will actually query with ----
  const filter = {};

  if (search.trim()) {
    // Case-insensitive partial match on name — e.g. "mou" matches "Wireless Mouse".
    // Escape regex special characters so a search term like "a+b" doesn't
    // get interpreted as a broken regex pattern.
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: escaped, $options: "i" };
  }

  if (category.trim() && category !== "all") {
    filter.category = category.trim();
  }

  // ---- Build the sort object, guarding against invalid/unindexed fields ----
  const sortField = SORTABLE_FIELDS.has(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? 1 : -1;

  // ---- Pagination math ----
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10)); // hard cap of 100/page
  const skip = (pageNum - 1) * limitNum;

  // Run the count and the actual page fetch in parallel — both hit the
  // same indexed filter, so this is a single efficient round trip
  // pattern rather than two sequential ones.
  const [items, totalCount] = await Promise.all([
    Item.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum),
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
 * @access  Private
 */
const createItem = asyncHandler(async (req, res) => {
  const { name, sku, category, subCategory, quantity, price, variants } = req.body;

  const item = await Item.create({
    name,
    sku,
    category,
    subCategory,
    quantity,
    price,
    variants,
  });

  res.status(201).json({ success: true, data: item, error: null });
});

/**
 * @desc    Update an existing inventory item
 * @route   PUT /api/items/:id
 * @access  Private
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
 * @access  Private
 */
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error(`Item not found with id ${req.params.id}`);
  }

  res.status(200).json({ success: true, data: item, error: null });
});

/**
 * @desc    Get the distinct list of categories currently in use —
 *          powers the category filter dropdown on the frontend without
 *          hardcoding options that could drift out of sync with real data.
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
