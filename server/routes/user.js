const express = require("express");
const router = express.Router();
const { getMe, updateProfile, updatePassword } = require("../controllers/user");
const { protect } = require("../middlewares/auth");
const upload = require("../utils/multer"); // Make sure this is the correct path to your multer config

// GET current user
router.get("/me", protect, getMe);

// PUT update profile (with optional image upload)
router.put(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  updateProfile
);

// PUT update password
router.put("/update-password", protect, updatePassword);

module.exports = router;
