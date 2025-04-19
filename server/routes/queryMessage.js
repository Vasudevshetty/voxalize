const express = require("express");
const router = express.Router();
const {
  createQueryMessage,
  getQueryMessagesBySession,
} = require("../controllers/queryMessage");
const { protect } = require("../middlewares/auth");

// Create a new query message
router.post("/", protect, createQueryMessage);

// Get messages by session ID
router.get("/:sessionId", getQueryMessagesBySession);

module.exports = router;
