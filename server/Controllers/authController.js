const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "portfolio_default_secret_key_123",
    {
      expiresIn: "30d",
    }
  );
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Auth login Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to complete sign in. Please try again later.",
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  } catch (err) {
    console.error("Auth verifyToken Controller Error:", err);
    return res.status(500).json({
      success: false,
      message:
        "Authentication validation failed. Please log in again.",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new passwords",
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Auth updatePassword Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to update password. Please try again later.",
    });
  }
};

module.exports = { login, verifyToken, updatePassword };
