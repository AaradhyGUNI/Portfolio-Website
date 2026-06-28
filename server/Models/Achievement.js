const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Achievement", achievementSchema);
