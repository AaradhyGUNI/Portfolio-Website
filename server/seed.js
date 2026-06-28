const mongoose = require("mongoose");
const Hero = require("./Models/Hero");
const About = require("./Models/About");
const Skill = require("./Models/Skill");
const Project = require("./Models/Project");
const Experience = require("./Models/Experience");
const Education = require("./Models/Education");
const Contact = require("./Models/Contact");
const SocialLink = require("./Models/SocialLink");

const seedDatabase = async () => {
  try {
    // 1. Seed Hero
    const hero = await Hero.findOne();
    if (!hero || !hero.fullName) {
      if (hero) await Hero.deleteOne({ _id: hero._id });
      await Hero.create({
        fullName: "Aaradhya Sharma",
        title: "Computer Engineering Student",
        animatedDesignations: [
          "Computer Engineering Student",
          "Full-Stack Web Developer",
          "Machine Learning Enthusiast",
          "Problem Solver",
        ],
        shortDescription:
          "Passionate about building practical software solutions using Python, JavaScript, Node.js and MongoDB while continuously learning modern technologies and backend development.",
        profileImage: "",
      });
      console.log("Seeded default Hero details.");
    }

    // 2. Seed About
    const about = await About.findOne();
    if (!about || !about.biography) {
      if (about) await About.deleteOne({ _id: about._id });
      await About.create({
        biography:
          "I am a Computer Engineering student at Ganpat University currently studying in the 7th semester with a CGPA of 7.52. Through academic projects and internships, I have developed skills in Python, JavaScript, Node.js, MongoDB and Machine Learning. I enjoy solving real-world problems, building web applications, and continuously improving my technical knowledge.",
        careerObjective:
          "To leverage my skills in computer engineering and software development to build innovative and scalable solutions while continuously growing in a professional environment.",
        interests: ["Backend Development", "Machine Learning", "System Design", "Cloud Systems"],
        currentStatus: "B.Tech CE - 7th Semester",
        highlights: ["CGPA 7.52", "4+ Projects", "Machine Learning Intern"],
        currentFocus: "Advanced System Design, Gemini API Integrations, and Kubernetes Orchestration.",
        careerGoals: "To become a Principal Product Engineer building intelligent backend architectures and scalable cloud systems.",
      });
      console.log("Seeded default About details.");
    }

    // 3. Seed Contact
    const contact = await Contact.findOne();
    if (!contact || (!contact.email && !contact.phone && !contact.address)) {
      if (contact) await Contact.deleteOne({ _id: contact._id });
      await Contact.create({
        email: "sharmaaaradhy8860@gmail.com",
        phone: "",
        address: "Gujarat, India",
        googleMapEmbedUrl: "",
      });
      console.log("Seeded default Contact details.");
    }

    // 4. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const defaultSkills = [
        { name: "Python", category: "Programming Languages", level: "Advanced" },
        { name: "JavaScript", category: "Programming Languages", level: "Advanced" },
        { name: "Node.js", category: "Backend", level: "Intermediate" },
        { name: "MongoDB", category: "Database", level: "Intermediate" },
        { name: "HTML", category: "Frontend", level: "Advanced" },
        { name: "CSS", category: "Frontend", level: "Advanced" },
        { name: "Machine Learning", category: "AI & ML", level: "Intermediate" },
        { name: "C++", category: "Programming Languages", level: "Beginner" },
      ];
      await Skill.insertMany(defaultSkills);
      console.log("Seeded default Skills.");
    }

    // 5. Seed Education
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      const defaultEdu = [
        {
          degree: "B.Tech Computer Engineering",
          university: "Ganpat University",
          duration: "2023 – Present",
          cgpa: "7.50 / 10",
          achievements: ["Current Semester: 7th Semester", "Focus on Algorithms, Database Systems, & AI"],
        },
        {
          degree: "Class 12 CBSE Board",
          university: "The H.B. Kapadia New High School, Chhatral",
          duration: "Completed 2023",
          cgpa: "67%",
          achievements: ["Science stream with Mathematics focus"],
        },
        {
          degree: "Class 10 CBSE Board",
          university: "The H.B. Kapadia New High School, Chhatral",
          duration: "Completed 2021",
          cgpa: "74%",
          achievements: [],
        },
      ];
      await Education.insertMany(defaultEdu);
      console.log("Seeded default Education.");
    }

    // 6. Seed Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.create({
        company: "CodSoft",
        role: "Machine Learning Intern",
        duration: "May 2026 – June 2026",
        description:
          "Completed multiple Machine Learning projects including Movie Genre Classification, Credit Card Fraud Detection, Customer Churn Prediction, SMS Spam Detection and Customer Segmentation using Python and Scikit-Learn.",
        technologies: ["Python", "Scikit-Learn", "Pandas", "Numpy"],
        achievements: ["Built and tuned 5 classification models", "Secured internship performance certificate"],
      });
      console.log("Seeded default Experience.");
    }

    // 7. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: "SkillBridge AI – Resume Analyzer",
          description:
            "AI-powered Resume Analyzer that analyzes resumes, performs ATS scoring, identifies missing skills, provides AI-powered career insights, and generates improvement suggestions using the Gemini API.",
          technologies: [
            "React",
            "Tailwind CSS",
            "JavaScript",
            "Node.js",
            "Express.js",
            "MongoDB Atlas",
            "Gemini API",
            "REST API",
          ],
          features: ["ATS Scoring", "Missing Skills Check", "Gemini Insights", "PDF Metadata Storage"],
          githubLink: "https://github.com/AaradhyGUNI",
          liveDemoLink: "",
          status: "Completed",
        },
        {
          title: "Campus Vehicle Booking & Management System",
          description:
            "Web application for booking and managing campus vehicles with streamlined request handling and administration features.",
          technologies: ["Node.js", "Express", "MongoDB", "Tailwind CSS"],
          features: ["Real-time Booking", "Admin approval workflow"],
          githubLink: "https://github.com/AaradhyGUNI",
          liveDemoLink: "",
          status: "Completed",
        },
        {
          title: "Portfolio Website",
          description:
            "Personal portfolio website built using React, Express, MongoDB, and Tailwind CSS featuring a secure admin dashboard, dynamic resume updates, and image managers.",
          technologies: ["React", "Express.js", "MongoDB", "Tailwind CSS"],
          features: ["Admin Panel", "Dynamic CRUD", "Resume Upload"],
          githubLink: "https://github.com/AaradhyGUNI",
          liveDemoLink: "",
          status: "Completed",
        },
        {
          title: "CodSoft Machine Learning Projects",
          description:
            "Collection of Machine Learning projects developed during internship using Python, Pandas, Scikit-Learn and data analysis.",
          technologies: ["Python", "Scikit-Learn", "Pandas"],
          features: ["Credit Card Fraud Detection", "Spam filter"],
          githubLink: "https://github.com/AaradhyGUNI",
          liveDemoLink: "",
          status: "Completed",
        },
      ];
      await Project.insertMany(defaultProjects);
      console.log("Seeded default Projects.");
    }

    // 8. Seed Social Links
    const socialCount = await SocialLink.countDocuments();
    if (socialCount === 0) {
      const defaultSocials = [
        { platform: "GitHub", url: "https://github.com/AaradhyGUNI" },
        {
          platform: "LinkedIn",
          url: "https://www.linkedin.com/in/aaradhy-sharma-306aa5286/",
        },
      ];
      await SocialLink.insertMany(defaultSocials);
      console.log("Seeded default Social Links.");
    }
  } catch (err) {
    console.error("Error seeding database:", err.message || err);
  }
};

module.exports = seedDatabase;
