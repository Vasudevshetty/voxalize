const express = require("express");
const router = express.Router();
const {
  createQueryMessage,
  getQueryMessagesBySession,
} = require("../controllers/queryMessage");

// Create a new query message
router.post("/", createQueryMessage);

// Get messages by session ID
router.get("/:sessionId", getQueryMessagesBySession);

module.exports = router;
