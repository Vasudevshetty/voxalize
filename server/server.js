const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_PROD],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route
app.get("/api/v1", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/users", require("./routes/user"));
app.use("/api/v1/databases", require("./routes/database"));
app.use("/api/v1/sessions", require("./routes/querySession"));

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
