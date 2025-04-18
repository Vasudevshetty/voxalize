const User = require("../models/user");
const bcrypt = require("bcryptjs");

// @desc    Get current user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// profileImage is uploaded via form-data
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, mobileNumber } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (mobileNumber) updates.mobileNumber = mobileNumber;

    if (req.file) {
      updates.profileImage = `/uploads/profile-images/${req.file.filename}`;
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
