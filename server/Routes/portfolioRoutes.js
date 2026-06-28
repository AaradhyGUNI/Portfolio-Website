const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/uploadMiddleware");
const { getModelCRUD, deleteFile } = require("../Controllers/crudController");

// Import all models
const Hero = require("../Models/Hero");
const About = require("../Models/About");
const Skill = require("../Models/Skill");
const Project = require("../Models/Project");
const Experience = require("../Models/Experience");
const Education = require("../Models/Education");
const Certificate = require("../Models/Certificate");
const Achievement = require("../Models/Achievement");
const Resume = require("../Models/Resume");
const Contact = require("../Models/Contact");
const SocialLink = require("../Models/SocialLink");
const Setting = require("../Models/Setting");
const Message = require("../Models/Message");

// Singleton controller helpers with safe error masks
const getSingleton = (Model) => async (req, res) => {
  try {
    let item = await Model.findOne();
    if (!item) {
      const defaults = {};
      if (Model.modelName === "Hero") {
        defaults.fullName = "Aaradhya Sharma";
        defaults.title = "Software Engineer & AI Specialist";
        defaults.animatedDesignations = ["Full Stack Developer", "AI Practitioner", "Problem Solver"];
        defaults.shortDescription = "Passionate about building scalable web applications and intelligent AI agents.";
      } else if (Model.modelName === "About") {
        defaults.biography = "I am a graduate software engineer student focused on building robust applications.";
        defaults.careerObjective = "To utilize my software engineering and AI skills to solve real-world problems.";
        defaults.interests = ["Web Development", "AI/ML", "Cloud Computing"];
        defaults.highlights = ["Strong Problem Solving", "Team Player", "Fast Learner"];
      }
      item = await Model.create(defaults);
    }
    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    console.error(`Singleton getOne Error for ${Model.modelName}:`, err);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve details. Please try again later.",
    });
  }
};

const updateSingleton =
  (Model, fileFieldName = null) =>
  async (req, res) => {
    try {
      let item = await Model.findOne();
      const data = { ...req.body };

      // Parse arrays if they are passed as JSON strings
      for (const key in data) {
        if (typeof data[key] === "string") {
          const isArrayPath = Model.schema && Model.schema.paths[key] && (
            Model.schema.paths[key].instance === "Array" ||
            Model.schema.paths[key].constructor.name === "SchemaArray" ||
            Model.schema.paths[key].constructor.name === "Array"
          );
          if (isArrayPath) {
            try {
              data[key] = data[key] === "" ? [] : JSON.parse(data[key]);
            } catch (e) {
              // Keep as string
            }
          }
        }
      }

      if (req.file && fileFieldName) {
        if (item && item[fileFieldName]) {
          deleteFile(item[fileFieldName]);
        }
        data[fileFieldName] = `/uploads/${req.file.filename}`;
      }

      if (item) {
        item = await Model.findByIdAndUpdate(item._id, data, {
          new: true,
          runValidators: true,
        });
      } else {
        item = await Model.create(data);
      }
      return res.status(200).json({ success: true, data: item });
    } catch (err) {
      console.error(`Singleton update Error for ${Model.modelName}:`, err);
      return res.status(400).json({
        success: false,
        message: "Unable to save changes. Please try again later.",
      });
    }
  };

// HERO
router.get("/hero", getSingleton(Hero));
router.put(
  "/hero",
  protect,
  upload.single("profileImage"),
  updateSingleton(Hero, "profileImage")
);

// ABOUT
router.get("/about", getSingleton(About));
router.put("/about", protect, updateSingleton(About));

// CONTACT INFO
router.get("/contact-info", getSingleton(Contact));
router.put("/contact-info", protect, updateSingleton(Contact));

// SKILLS
const skillCRUD = getModelCRUD(Skill);
router.get("/skills", skillCRUD.getAll);
router.post("/skills", protect, skillCRUD.create);
router.put("/skills/:id", protect, skillCRUD.update);
router.delete("/skills/:id", protect, skillCRUD.delete);

// EXPERIENCE
const experienceCRUD = getModelCRUD(Experience);
router.get("/experience", experienceCRUD.getAll);
router.post("/experience", protect, experienceCRUD.create);
router.put("/experience/:id", protect, experienceCRUD.update);
router.delete("/experience/:id", protect, experienceCRUD.delete);

// EDUCATION
const educationCRUD = getModelCRUD(Education);
router.get("/education", educationCRUD.getAll);
router.post("/education", protect, educationCRUD.create);
router.put("/education/:id", protect, educationCRUD.update);
router.delete("/education/:id", protect, educationCRUD.delete);

// PROJECTS
const projectCRUD = getModelCRUD(Project, "image");
router.get("/projects", projectCRUD.getAll);
router.post("/projects", protect, upload.single("image"), projectCRUD.create);
router.put(
  "/projects/:id",
  protect,
  upload.single("image"),
  projectCRUD.update
);
router.delete("/projects/:id", protect, projectCRUD.delete);

// CERTIFICATES
const certificateCRUD = getModelCRUD(Certificate, "image");
router.get("/certificates", certificateCRUD.getAll);
router.post(
  "/certificates",
  protect,
  upload.single("image"),
  certificateCRUD.create
);
router.put(
  "/certificates/:id",
  protect,
  upload.single("image"),
  certificateCRUD.update
);
router.delete("/certificates/:id", protect, certificateCRUD.delete);

// ACHIEVEMENTS
const achievementCRUD = getModelCRUD(Achievement, "image");
router.get("/achievements", achievementCRUD.getAll);
router.post(
  "/achievements",
  protect,
  upload.single("image"),
  achievementCRUD.create
);
router.put(
  "/achievements/:id",
  protect,
  upload.single("image"),
  achievementCRUD.update
);
router.delete("/achievements/:id", protect, achievementCRUD.delete);

// SOCIAL LINKS
const socialLinkCRUD = getModelCRUD(SocialLink);
router.get("/social-links", socialLinkCRUD.getAll);
router.post("/social-links", protect, socialLinkCRUD.create);
router.put("/social-links/:id", protect, socialLinkCRUD.update);
router.delete("/social-links/:id", protect, socialLinkCRUD.delete);

// SETTINGS
const settingCRUD = getModelCRUD(Setting);
router.get("/settings", settingCRUD.getAll);
router.post("/settings", protect, settingCRUD.create);
router.put("/settings/:id", protect, settingCRUD.update);
router.delete("/settings/:id", protect, settingCRUD.delete);

// RESUMES
const resumeCRUD = getModelCRUD(Resume, "filepath");
router.get("/resumes", protect, resumeCRUD.getAll);
router.post(
  "/resumes",
  protect,
  upload.single("resume"),
  async (req, res, next) => {
    try {
      if (req.file) {
        // Set all other resumes to inactive
        await Resume.updateMany({}, { isActive: false });
        req.body.filename = req.file.originalname;
        req.body.filepath = `/uploads/${req.file.filename}`;
        req.body.isActive = true;
      }
      next();
    } catch (err) {
      console.error("Resume file preprocess error:", err);
      return res.status(500).json({
        success: false,
        message: "Unable to process resume upload. Please try again.",
      });
    }
  },
  resumeCRUD.create
);

router.delete("/resumes/:id", protect, resumeCRUD.delete);

// Set Active Resume
router.put("/resumes/:id/active", protect, async (req, res) => {
  try {
    await Resume.updateMany({}, { isActive: false });
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }
    return res.status(200).json({ success: true, data: resume });
  } catch (err) {
    console.error("Resume setActive route error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to update active resume. Please try again later.",
    });
  }
});

// Get Current Active Resume
router.get("/resumes/active", async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "No active resume found" });
    }
    return res.status(200).json({ success: true, data: resume });
  } catch (err) {
    console.error("Resume getActive route error:", err);
    return res.status(550).json({
      success: false,
      message: "Unable to retrieve active resume. Please try again later.",
    });
  }
});

// MESSAGES (CONTACT SUBMISSIONS)
router.post("/messages", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }
    const newMessage = await Message.create({ name, email, subject, message });
    return res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error("Visitor message submission API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to send message. Please try again later.",
    });
  }
});

router.get("/messages", protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    console.error("Fetch inbox messages API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve messages. Please try again later.",
    });
  }
});

router.put("/messages/:id/read", protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    return res.status(200).json({ success: true, data: message });
  } catch (err) {
    console.error("Update message status API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to update message status. Please try again later.",
    });
  }
});

router.delete("/messages/:id", protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message API Error:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to delete message. Please try again later.",
    });
  }
});

module.exports = router;
