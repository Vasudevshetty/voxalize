const QueryMessage = require("../models/queryMessage");
const Database = require("../models/database");
const mongoose = require("mongoose");
const axios = require("axios");

// Create a new query message
const createQueryMessage = async (req, res) => {
  const startTime = Date.now(); // Add timestamp at start

  try {
    const database = await Database.findById(req.body.databaseId);
    if (!database) {
      return res
        .status(404)
        .json({ error: "Database configuration not found" });
    }

    let response;
    try {
      response = await axios.post("https://studysyncs.xyz/services/chat", {
        query_request: {
          query: req.body.requestQuery,
        },
        database_config: {
          dbtype: database.dbType,
          host: database.host,
          user: database.username,
          password: database.password,
          dbname: database.database,
        },
      });

      response = response.data;
    } catch (error) {
      if (error.response) {
        console.log(error);
        throw new Error(
          `Chat service error: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        throw new Error("Unable to reach chat service");
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }

    const {
      user_query,
      sql_query,
      sql_result,
      summary,
      agent_thought_process,
    } = response;

    // Create and save the query message with calculated execution time
    const queryMessage = new QueryMessage({
      session: req.body.sessionId,
      user: req.user._id,
      requestQuery: user_query,
      sqlQuery: sql_query,
      sqlResponse: sql_result,
      summary,
      thoughtProcess: agent_thought_process,
      executionTime: Date.now() - startTime, // Calculate execution time
    });

    const savedMessage = await queryMessage.save();

    // Update session title if provided
    if (response.title) {
      await mongoose
        .model("QuerySession")
        .findByIdAndUpdate(req.body.sessionId, { title: response.title });
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error creating query message:", error);
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
