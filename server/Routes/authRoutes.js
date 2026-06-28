const express = require("express");
const router = express.Router();
const {
  login,
  verifyToken,
  updatePassword,
} = require("../Controllers/authController");
const { protect } = require("../Middleware/authMiddleware");

router.post("/login", login);
router.get("/verify", protect, verifyToken);
router.put("/update-password", protect, updatePassword);

module.exports = router;
