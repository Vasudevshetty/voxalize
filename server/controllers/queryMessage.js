const QueryMessage = require("../models/queryMessage");
const Database = require("../models/database");

// Create a new query message
const createQueryMessage = async (req, res) => {
  try {
    const database = await Database.findById(req.body.databaseId);
    if (!database) {
      return res
        .status(404)
        .json({ error: "Database configuration not found" });
    }

    const response = await axios.post("https://studysyncs.xyz/services/chat", {
      query_request: {
        query: req.body.requestQuery,
      },
      db_config: {
        dbType: database.dbType,
        host: database.host,
        username: database.username,
        password: database.password,
        database: database.database,
      },
    });

    const [
      user_query,
      sql_query,
      sql_result,
      summary,
      title,
      agent_thought_process,
    ] = response;

    // Create and save the query message
    const queryMessage = new QueryMessage({
      session: req.body.sessionId,
      user: req.user._id,
      requestQuery: user_query,
      sqlQuery: sql_query,
      sqlResponse: sql_result,
      summary,
      thoughtProcess: agent_thought_process,
      executionTime: Date.now() - req.requestTime,
    });

    const savedMessage = await queryMessage.save();

    // Update session title if provided
    if (title) {
      await mongoose
        .model("QuerySession")
        .findByIdAndUpdate(req.body.sessionId, { title });
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get query messages by session ID
const getQueryMessagesBySession = async (req, res) => {
  try {
    if (!req.params.sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const messages = await QueryMessage.find({ session: req.params.sessionId })
      .sort({ createdAt: -1 })
      .populate("user", "username");

    if (!messages || messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this session" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching query messages:", error);
    res.status(500).json({ error: "Failed to fetch query messages" });
  }
};

module.exports = {
  createQueryMessage,
  getQueryMessagesBySession,
};
