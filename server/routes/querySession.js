const express = require("express");
const { protect } = require("../middlewares/auth");
const router = express.Router();
const {
  createQuerySession,
  getQuerySessions,
  getQuerySessionById,
} = require("../controllers/querySession");

// Protect all routes
router.use(protect);
router.post("/", createQuerySession);
router.get("/", getQuerySessions);
router.get("/:id", getQuerySessionById);

module.exports = router;
