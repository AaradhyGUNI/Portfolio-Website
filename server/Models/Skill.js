const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Skill category is required"],
      enum: [
        "Programming Languages",
        "Frontend",
        "Backend",
        "Database",
        "AI & ML",
        "Tools",
        "Cloud",
        "Version Control",
        "Soft Skills",
      ],
      index: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);
