const mongoose = require("mongoose");

const databaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    host: { type: String, required: true },
    username: { type: String, required: true }, // DB user
    password: { type: String, required: true }, // Consider encrypting
    database: { type: String, required: true },
    dbType: { type: String, enum: ["mysql", "postgresql"], required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Database", databaseSchema);
