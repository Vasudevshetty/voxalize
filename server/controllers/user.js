const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
