const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
  createDatabase,
  getDatabases,
  getDatabaseById,
  updateDatabase,
  deleteDatabase,
} = require("../controllers/database");

router.post("/create", protect, createDatabase);
router.get("/", protect, getDatabases);
router.get("/:id", protect, getDatabaseById);
router.put("/:id", protect, updateDatabase);
router.delete("/:id", protect, deleteDatabase);

module.exports = router;
