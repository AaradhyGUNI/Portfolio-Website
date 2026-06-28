const Profile = require("../Models/Profile");

const saveProfile = async (req, res) => {
  try {
    const profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveProfile,
};