const QuerySession = require("../models/querySession");

// Create a new query session
const createQuerySession = async (req, res) => {
  try {
    const { user, database, title, description } = req.body;
    const querySession = new QuerySession({
      user,
      database,
      title,
      description,
    });
    const savedSession = await querySession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all query sessions for a user
const getQuerySessions = async (req, res) => {
  try {
    const sessions = await QuerySession.find({ user: req.user._id })
      .populate("user", "username email profileImage")
      .populate("database", "name");
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single query session by ID
const getQuerySessionById = async (req, res) => {
  try {
    const session = await QuerySession.findById(req.params.id)
      .populate("user", "username email profileImage")
      .populate("database", "name");
    if (!session) {
      return res.status(404).json({ message: "Query session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuerySession,
  getQuerySessions,
  getQuerySessionById,
};
