const express = require("express");
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getCategories,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

// Must be registered before /:id — otherwise Express would match
// "categories" as if it were an :id parameter.
router.get("/categories", getCategories);

// upload.single("image") runs before createItem/updateItem: it parses
// the incoming multipart/form-data request, writes the "image" field's
// file to disk if present, and makes the other text fields available
// on req.body exactly as usual.
router.route("/").get(getItems).post(upload.single("image"), createItem);

router
  .route("/:id")
  .get(getItem)
  .put(upload.single("image"), updateItem)
  .delete(deleteItem);

module.exports = router;
