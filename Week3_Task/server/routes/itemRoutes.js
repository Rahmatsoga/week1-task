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

const router = express.Router();

// All inventory routes require a logged-in user (see Week 2: Full-Stack
// Authentication & Protected Interfaces).
router.use(protect);

// IMPORTANT: /categories must be registered before /:id — otherwise
// Express would match "categories" as if it were an :id parameter and
// this route would never be reached.
router.get("/categories", getCategories);

router.route("/").get(getItems).post(createItem);

router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);

module.exports = router;
