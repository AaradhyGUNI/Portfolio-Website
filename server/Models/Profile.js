const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  about: {
    type: String,
  },

  profileImage: {
    type: String,
  },

  resume: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Profile", profileSchema);