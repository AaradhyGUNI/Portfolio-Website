const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");

const authRoutes = require("./Routes/authRoutes");
const portfolioRoutes = require("./Routes/portfolioRoutes");
const User = require("./Models/User");

dotenv.config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (Increased max and skipped for auth requests to prevent admin panel blocks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return !!(req.headers.authorization && req.headers.authorization.startsWith("Bearer"));
  },
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", apiLimiter);

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Static build output folder for React SPA
app.use(express.static(path.join(__dirname, "../public")));

// React SPA Routing fallback (RegExp bypasses path-to-regexp v8 string parsing in Express v5)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler Caught:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Database Connect & Server Boot Logic
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");

    // Run dynamic DB seed
    try {
      const seedDatabase = require("./seed");
      await seedDatabase();
    } catch (seedErr) {
      console.error("Error seeding portfolio database:", seedErr.message);
    }

    // Seed Admin User
    try {
      const adminCount = await User.countDocuments();
      if (adminCount === 0) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin12345", salt);
        await User.create({
          username: "admin",
          password: hashedPassword,
        });
        console.log("Admin user seeded: username='admin', password='admin12345'");
      }
    } catch (seedErr) {
      console.error("Error seeding admin user:", seedErr.message);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("==============================================================");
    console.error("CRITICAL: Database connection failed. Gracefully shutting down.");
    console.error(err.message || err);
    console.error("Possible cause: Your local IP address is not whitelisted on Atlas.");
    console.error("Please add 0.0.0.0/0 to your MongoDB Atlas whitelist.");
    console.error("==============================================================");
    process.exit(1);
  }
};

startServer();