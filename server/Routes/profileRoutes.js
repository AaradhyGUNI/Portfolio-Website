const express = require("express");
const router = express.Router();

const {
  saveProfile,
} = require("../Controllers/profileController");

router.post("/save", saveProfile);

module.exports = router;