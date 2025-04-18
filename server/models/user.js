const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^\+?\d{10,15}$/, "Please provide a valid mobile number"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "/profile.png",
    },
    databases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Database" }],
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuerySession" }],
    queryMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "QueryMessage" },
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Method to generate a password reset token
userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  return token;
};

module.exports = mongoose.model("User", userSchema);
