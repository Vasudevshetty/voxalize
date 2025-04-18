const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Node.js + MongoDB!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
