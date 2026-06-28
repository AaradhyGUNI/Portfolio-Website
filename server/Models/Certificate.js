const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer is required"],
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    credentialLink: {
      type: String,
      trim: true,
      default: "",
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

module.exports = mongoose.model("Certificate", certificateSchema);
