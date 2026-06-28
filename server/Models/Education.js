const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, "Degree name is required"],
      trim: true,
    },
    university: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    cgpa: {
      type: String,
      trim: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Education", educationSchema);
