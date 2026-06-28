const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, "Platform name is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Profile URL is required"],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SocialLink", socialLinkSchema);
