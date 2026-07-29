const express = require("express");
const { getSuppliers, createSupplier, deleteSupplier } = require("../controllers/supplierController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getSuppliers).post(createSupplier);
router.route("/:id").delete(deleteSupplier);

module.exports = router;
