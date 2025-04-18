const mongoose = require("mongoose");

const querySessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    database: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Database",
      required: true,
    },
    title: { type: String, default: "Untitled Session" },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuerySession", querySessionSchema);
