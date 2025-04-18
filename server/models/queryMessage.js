const mongoose = require("mongoose");

const queryMessageSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuerySession",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestQuery: { type: String, required: true },
    sqlQuery: { type: String },
    sqlResponse: { type: mongoose.Schema.Types.Mixed },
    summary: { type: String },
    thoughtProcess: { type: String },
    executionTime: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QueryMessage", queryMessageSchema);
