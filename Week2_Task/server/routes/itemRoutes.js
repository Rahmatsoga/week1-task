const express = require("express");
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All inventory routes now require a logged-in user (see Week 2:
// Full-Stack Authentication & Protected Interfaces).
router.use(protect);

router.route("/").get(getItems).post(createItem);

router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);

module.exports = router;
