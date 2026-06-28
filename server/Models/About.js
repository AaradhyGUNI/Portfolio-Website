const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    biography: {
      type: String,
      required: [true, "Biography is required"],
      trim: true,
    },
    careerObjective: {
      type: String,
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    currentStatus: {
      type: String,
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    currentFocus: {
      type: String,
      trim: true,
      default: "",
    },
    careerGoals: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);
