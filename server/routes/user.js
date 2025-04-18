const express = require("express");
const router = express.Router();
const { getMe, updateProfile, updatePassword } = require("../controllers/user");
const { protect } = require("../middlewares/auth");

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);

module.exports = router;
