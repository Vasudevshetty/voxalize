const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, res) => {
  const token = createToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, mobileNumber } = req.body;

    // Check if mobile number is valid (using regex from your schema)
    const mobileNumberRegex = /^\+?\d{10,15}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid mobile number" });
    }

    // Check if the user with the same email or username already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }, { mobileNumber }],
    });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user with the given details
    const user = await User.create({
      username,
      email,
      password: hashed,
      mobileNumber,
    });

    // Send the token to the client upon successful creation
    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = user.generateResetToken();
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail(user.email, "Password Reset", resetURL, user.username);

    res.status(200).json({ success: true, message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
