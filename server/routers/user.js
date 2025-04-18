const express = require("express");
const router = express.Router();
const {
  getMe,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);

module.exports = router;
