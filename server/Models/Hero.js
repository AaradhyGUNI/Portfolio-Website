const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    animatedDesignations: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hero", heroSchema);
