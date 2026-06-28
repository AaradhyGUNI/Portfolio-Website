import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBook,
  FaBriefcase,
  FaCode,
  FaCertificate,
  FaAward,
  FaSun,
  FaMoon,
  FaDownload,
  FaBars,
  FaTimes,
  FaSpinner,
  FaExternalLinkAlt,
  FaPython,
  FaJs,
  FaNodeJs,
  FaDatabase,
  FaBrain,
  FaGraduationCap,
  FaInfoCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import PremiumBackground from "../components/PremiumBackground";

// Fallback Default Data (Student project fully replaced by SkillBridge AI)
const DEFAULTS = {
  hero: {
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
  },
  about: {
    biography:
      "I am a Computer Engineering student at Ganpat University currently studying in the 7th semester with a CGPA of 7.52. Through academic projects and internships, I have developed skills in Python, JavaScript, Node.js, MongoDB and Machine Learning. I enjoy solving real-world problems, building web applications, and continuously improving my technical knowledge.",
    careerObjective:
      "To leverage my skills in computer engineering and software development to build innovative and scalable solutions while continuously growing in a professional environment.",
    interests: ["Backend Development", "Machine Learning", "System Design", "Cloud Systems"],
    currentStatus: "B.Tech CE - 7th Semester",
    highlights: ["CGPA 7.50", "4+ Projects", "Machine Learning Intern"],
    careerGoals: "To become a Principal Product Engineer building intelligent backend architectures and scalable cloud systems.",
    currentFocus: "Advanced System Design, Gemini API Integrations, and Kubernetes Orchestration.",
  },
  skills: [
    { name: "Python", category: "Programming Languages", level: "Advanced" },
    { name: "JavaScript", category: "Programming Languages", level: "Advanced" },
    { name: "Node.js", category: "Backend", level: "Intermediate" },
    { name: "MongoDB", category: "Database", level: "Intermediate" },
    { name: "HTML", category: "Frontend", level: "Advanced" },
    { name: "CSS", category: "Frontend", level: "Advanced" },
    { name: "Machine Learning", category: "AI & ML", level: "Intermediate" },
    { name: "C++", category: "Programming Languages", level: "Beginner" },
  ],
  education: [
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
  ],
  experience: [
    {
      company: "CodSoft",
      role: "Machine Learning Intern",
      duration: "May 2026 – June 2026",
      description:
        "Completed multiple Machine Learning projects including Movie Genre Classification, Credit Card Fraud Detection, Customer Churn Prediction, SMS Spam Detection and Customer Segmentation using Python and Scikit-Learn.",
      technologies: ["Python", "Scikit-Learn", "Pandas", "Numpy"],
      achievements: ["Built and tuned 5 classification models", "Secured internship performance certificate"],
    },
  ],
  projects: [
    {
      title: "SkillBridge AI – Resume Analyzer",
      description:
        "AI-powered Resume Analyzer that analyzes resumes, performs ATS scoring, identifies missing skills, provides AI-powered career insights, and generates improvement suggestions using the Gemini API.",
      technologies: ["React", "Tailwind CSS", "JavaScript", "Node.js", "Express.js", "MongoDB Atlas", "Gemini API", "REST API"],
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
  ],
  contactInfo: {
    email: "sharmaaaradhy8860@gmail.com",
    phone: "",
    address: "Gujarat, India",
  },
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/AaradhyGUNI" },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/aaradhy-sharma-306aa5286/",
    },
  ],
};

export default function Portfolio() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for DB data
  const [hero, setHero] = useState(DEFAULTS.hero);
  const [heroImageLoading, setHeroImageLoading] = useState(true);
  const [about, setAbout] = useState(DEFAULTS.about);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [contactInfo, setContactInfo] = useState(DEFAULTS.contactInfo);
  const [socialLinks, setSocialLinks] = useState(DEFAULTS.socialLinks);
  const [activeResume, setActiveResume] = useState(null);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          heroRes,
          aboutRes,
          contactRes,
          skillsRes,
          eduRes,
          expRes,
          projRes,
          certRes,
          achRes,
          socialRes,
          resumeRes,
        ] = await Promise.all([
          axios.get("/api/portfolio/hero").catch(() => null),
          axios.get("/api/portfolio/about").catch(() => null),
          axios.get("/api/portfolio/contact-info").catch(() => null),
          axios.get("/api/portfolio/skills").catch(() => null),
          axios.get("/api/portfolio/education").catch(() => null),
          axios.get("/api/portfolio/experience").catch(() => null),
          axios.get("/api/portfolio/projects").catch(() => null),
          axios.get("/api/portfolio/certificates").catch(() => null),
          axios.get("/api/portfolio/achievements").catch(() => null),
          axios.get("/api/portfolio/social-links").catch(() => null),
          axios.get("/api/portfolio/resumes/active").catch(() => null),
        ]);

        if (heroRes?.data?.success && heroRes.data.data) {
          const heroData = heroRes.data.data;
          setHero(heroData);
          if (heroData.profileImage) {
            const img = new Image();
            const cacheBustedUrl = `${heroData.profileImage}?t=${new Date(heroData.updatedAt || Date.now()).getTime()}`;
            img.src = cacheBustedUrl;
            img.onload = () => setHeroImageLoading(false);
            img.onerror = () => setHeroImageLoading(false);
          } else {
            setHeroImageLoading(false);
          }
        } else {
          setHero({ ...DEFAULTS.hero, profileImage: "" });
          setHeroImageLoading(false);
        }

        if (aboutRes?.data?.success && aboutRes.data.data) {
          setAbout({ ...DEFAULTS.about, ...aboutRes.data.data });
        } else {
          setAbout(DEFAULTS.about);
        }

        if (skillsRes?.data?.success) {
          setSkills(skillsRes.data.data.filter(s => s.name.toLowerCase() !== "student management system"));
        } else {
          setSkills(DEFAULTS.skills);
        }

        if (eduRes?.data?.success) {
          setEducation(eduRes.data.data);
        } else {
          setEducation(DEFAULTS.education);
        }

        if (expRes?.data?.success) {
          setExperience(expRes.data.data);
        } else {
          setExperience(DEFAULTS.experience);
        }

        if (projRes?.data?.success) {
          const rawProjs = projRes.data.data.filter(p => p.title.toLowerCase() !== "student management system");
          const sorted = [...rawProjs].sort((a, b) => {
            if (a.title.includes("SkillBridge")) return -1;
            if (b.title.includes("SkillBridge")) return 1;
            return 0;
          });
          setProjects(sorted);
        } else {
          setProjects(DEFAULTS.projects);
        }

        if (certRes?.data?.success) {
          setCertificates(certRes.data.data);
        }

        if (achRes?.data?.success) {
          setAchievements(achRes.data.data);
        }

        if (contactRes?.data?.success && contactRes.data.data) {
          setContactInfo(contactRes.data.data);
        } else {
          setContactInfo(DEFAULTS.contactInfo);
        }
        
        if (socialRes?.data?.success) {
          setSocialLinks(socialRes.data.data);
        } else {
          setSocialLinks(DEFAULTS.socialLinks);
        }

        if (resumeRes?.data?.success) {
          setActiveResume(resumeRes.data.data);
        }
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      }
    };

    fetchData();
  }, []);

  // Typewriter designations
  const words = hero.animatedDesignations || DEFAULTS.hero.animatedDesignations;
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const handleTyping = () => {
      const fullWord = words[wordIndex];
      if (!isDeleting) {
        setCurrentWord(fullWord.substring(0, currentWord.length + 1));
        if (currentWord === fullWord) {
          setIsDeleting(true);
          setTypingSpeed(1800);
        } else {
          setTypingSpeed(60);
        }
      } else {
        setCurrentWord(fullWord.substring(0, currentWord.length - 1));
        if (currentWord === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(300);
        } else {
          setTypingSpeed(25);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentWord, isDeleting, wordIndex, words, typingSpeed]);

  // Handle message submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormError("Please fill out all required fields.");
      return;
    }
    setFormSubmitting(true);
    setFormError("");
    setFormSuccess("");
    try {
      const res = await axios.post("/api/portfolio/messages", formData);
      if (res.data.success) {
        setFormSuccess("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormError(res.data.message || "Unable to send message. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setFormError(
        err.response?.data?.message ||
          "Unable to send message. Please try again later."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Skill categorization mapper
  const getSkillsByCategory = (category) => {
    return skills.filter((s) => s.category === category);
  };

  const skillCategories = [
    "Programming Languages",
    "Frontend",
    "Backend",
    "Database",
    "AI & ML",
    "Tools",
    "Cloud",
    "Version Control",
    "Soft Skills",
  ];

  // Resolve specific UI icons for skills
  const getSkillIcon = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("python")) return <FaPython className="text-yellow-600 dark:text-yellow-400 text-lg" />;
    if (nameLower.includes("javascript") || nameLower.includes("js")) return <FaJs className="text-yellow-500 text-lg" />;
    if (nameLower.includes("node")) return <FaNodeJs className="text-emerald-600 dark:text-emerald-450 text-lg" />;
    if (nameLower.includes("mongodb") || nameLower.includes("database")) return <FaDatabase className="text-emerald-550 text-lg" />;
    if (nameLower.includes("html") || nameLower.includes("css")) return <FaCode className="text-orange-500 text-lg" />;
    if (nameLower.includes("learning") || nameLower.includes("ml") || nameLower.includes("ai")) {
      return <FaBrain className="text-purple-600 dark:text-purple-400 text-lg" />;
    }
    return <FaCode className="text-blue-500 dark:text-blue-400 text-lg" />;
  };

  const getSkillProgress = (level) => {
    const lvl = level?.toLowerCase();
    if (lvl === "beginner") return "40%";
    if (lvl === "advanced") return "92%";
    return "75%";
  };

  return (
    <div className="relative min-h-screen text-text-primary bg-bg-page transition-colors duration-200">
      <PremiumBackground />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-bg-card/75 backdrop-blur-md border-b border-border-theme/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <a href="#" className="text-2xl font-extrabold tracking-tight text-text-primary transition duration-200 hover:opacity-90">
              Aaradhya
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 ml-1 font-extrabold">
                Sharma
              </span>
            </a>
            <span className="text-[11px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">
              {hero.title}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-text-secondary">
            <a href="#about" className="hover:text-accent-primary transition-all">About</a>
            <a href="#education" className="hover:text-accent-primary transition-all">Education</a>
            <a href="#skills" className="hover:text-accent-primary transition-all">Skills</a>
            <a href="#experience" className="hover:text-accent-primary transition-all">Experience</a>
            <a href="#projects" className="hover:text-accent-primary transition-all">Projects</a>
            {certificates.length > 0 && (
              <a href="#certificates" className="hover:text-accent-primary transition-all">Certificates</a>
            )}
            <a href="#contact" className="hover:text-accent-primary transition-all">Contact</a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-bg-input hover:bg-bg-page transition text-text-primary shadow-sm border border-border-theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-bg-input text-text-primary shadow-sm border border-border-theme"
            >
              {theme === "dark" ? <FaSun size={13} /> : <FaMoon size={13} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-primary"
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-bg-card/95 border-b border-border-theme px-6 py-5 space-y-4 font-semibold text-text-primary">
            {["about", "education", "skills", "experience", "projects", "certificates", "contact"].map((section) => {
              if (section === "certificates" && certificates.length === 0) return null;
              return (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block capitalize text-sm hover:text-accent-primary"
                >
                  {section}
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="py-20 md:py-32 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Photos Frame */}
          <div className="md:col-span-5 flex justify-center order-first md:order-last">
            <div className="relative group p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/25 transition duration-500 select-none">
              <div className="relative bg-bg-card p-4 rounded-[2.4rem] overflow-hidden">
                <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-10 dark:opacity-20 rounded-full" />
                {heroImageLoading ? (
                  <div className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-200/60 dark:bg-zinc-800/60 rounded-[1.8rem] animate-pulse flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : hero.profileImage ? (
                  <img
                    src={`${hero.profileImage}?t=${new Date(hero.updatedAt || Date.now()).getTime()}`}
                    alt={hero.fullName}
                    className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-[1.8rem] transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-100 dark:bg-zinc-800/80 rounded-[1.8rem] border border-border-theme/40 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-slate-400 dark:text-zinc-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12c0 2.72.1.528 2.28 4.417-.035-.015-.07-.03-.105-.045a.75.75 0 0 0-.913.39c-.58 1.157.306 2.502 1.584 2.502h13.938c1.278 0 2.164-1.345 1.584-2.502a.75.75 0 0 0-.913-.39m-13.37-2.736A7.486 7.486 0 0 1 12 15c2.474 0 4.7.2 6.685 1.361a8.25 8.25 0 1 0-13.37 0M12 6a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 6"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Intro Text */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-accent-primary font-bold text-xs tracking-wider uppercase">
                Welcome to my portfolio
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight mt-2.5 leading-[1.1] font-display">
                Hi, I'm <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {hero.fullName}
                </span>
              </h1>

              {/* Typewriter animation with cursor */}
              <h2 className="text-lg md:text-2xl font-bold text-text-secondary mt-4 min-h-[38px] flex items-center">
                <span>I'm a </span>
                <span className="text-accent-primary ml-2.5 border-r-[3px] border-accent-primary pr-1 animate-pulse">
                  {currentWord}
                </span>
              </h2>
            </div>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              {hero.shortDescription}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#projects"
                className="px-7 py-3.5 bg-accent-primary hover:bg-accent-hover text-white rounded-2xl font-bold shadow-lg hover:-translate-y-0.5 transition duration-200 text-sm select-none"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-7 py-3.5 border border-border-theme rounded-2xl font-bold text-text-primary hover:bg-bg-input hover:-translate-y-0.5 transition duration-200 text-sm"
              >
                Contact Me
              </a>
              {activeResume && (
                <a
                  href={activeResume.filepath}
                  download={activeResume.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3.5 bg-bg-input hover:bg-bg-page text-accent-primary rounded-2xl font-bold flex items-center gap-2 border border-border-theme hover:-translate-y-0.5 transition duration-200 text-sm"
                >
                  <FaDownload size={14} /> Resume
                </a>
              )}
            </div>

            {/* Statistics indicators Cards */}
            <div className="flex flex-wrap gap-4 pt-4">
              {about.highlights?.map((h, i) => (
                <div
                  key={i}
                  className="bg-bg-card backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm border border-border-theme flex items-center gap-2.5 hover:shadow-md hover:-translate-y-0.5 transition duration-300"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold text-text-primary">
                    {h}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-bg-card/40 backdrop-blur-sm border-y border-border-theme/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
              <FaAward size={20} />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
              About Me
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm leading-relaxed">
                <h3 className="text-sm font-extrabold uppercase text-text-secondary/70 tracking-wider mb-4 border-b pb-2 border-border-theme">
                  Biography
                </h3>
                <p className="text-text-primary leading-8 text-[15px] md:text-base">
                  {about.biography}
                </p>
              </div>

              {about.careerObjective && (
                <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm leading-relaxed">
                  <h3 className="text-sm font-extrabold uppercase text-text-secondary/70 tracking-wider mb-4 border-b pb-2 border-border-theme">
                    Career Objective
                  </h3>
                  <p className="text-text-primary leading-8 text-[15px]">
                    {about.careerObjective}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* Focus and Goals */}
              <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm space-y-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase text-text-secondary/70 tracking-wider mb-2">
                    Current Focus
                  </h3>
                  <p className="text-sm font-semibold text-text-primary">
                    {about.currentFocus || DEFAULTS.about.currentFocus}
                  </p>
                </div>
                <div className="border-t pt-4 border-border-theme">
                  <h3 className="text-xs font-extrabold uppercase text-text-secondary/70 tracking-wider mb-2">
                    Career Goals
                  </h3>
                  <p className="text-sm font-semibold text-text-primary leading-relaxed">
                    {about.careerGoals || DEFAULTS.about.careerGoals}
                  </p>
                </div>
              </div>

              {about.interests?.length > 0 && (
                <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm">
                  <h3 className="text-xs font-extrabold uppercase text-text-secondary/70 tracking-wider mb-4 border-b pb-2 border-border-theme">
                    Interests & Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {about.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-2 bg-bg-input text-xs font-bold rounded-xl text-text-primary"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION TIMELINE */}
      <section id="education" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
            <FaGraduationCap size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
            Education
          </h2>
        </div>

        <div className="relative border-l border-border-theme pl-8 ml-4 space-y-12">
          {education.map((edu, i) => (
            <div key={i} className="relative group">
              {/* Indicator Dot */}
              <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-bg-page bg-accent-primary group-hover:scale-110 transition duration-200 shadow-sm" />

              <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition">
                      {edu.degree}
                    </h3>
                    <p className="text-text-secondary font-semibold mt-1">
                      {edu.university}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="px-3.5 py-1.5 bg-bg-input text-text-secondary text-xs font-bold rounded-xl border border-border-theme">
                      {edu.duration}
                    </span>
                    {edu.cgpa && (
                      <span className="text-sm font-extrabold text-accent-primary mt-2">
                        Grade: {edu.cgpa}
                      </span>
                    )}
                  </div>
                </div>

                {edu.achievements?.length > 0 && (
                  <ul className="mt-5 space-y-2 list-disc list-inside text-text-primary text-[14px] leading-relaxed">
                    {edu.achievements.map((ach, j) => (
                      <li key={j}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS SECTION WITH PROGRESS BARS */}
      <section id="skills" className="py-24 bg-bg-card/40 backdrop-blur-sm border-y border-border-theme/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
              <FaCode size={20} />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
              Skills & Tech Stack
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => {
              const catSkills = getSkillsByCategory(category);
              if (catSkills.length === 0) return null;

              return (
                <div
                  key={category}
                  className="bg-bg-card rounded-3xl p-6 border border-border-theme shadow-sm space-y-5"
                >
                  <h3 className="text-sm font-extrabold text-text-primary tracking-wider uppercase border-b pb-2.5 border-border-theme">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {catSkills.map((skill) => (
                      <div key={skill._id || skill.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                          <div className="flex items-center gap-2">
                            {getSkillIcon(skill.name)}
                            <span>{skill.name}</span>
                          </div>
                          <span className="text-[10px] text-text-secondary tracking-wider font-bold">
                            {skill.level}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-input rounded-full overflow-hidden select-none">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: getSkillProgress(skill.level) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section id="experience" className="py-24 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
            <FaBriefcase size={20} />
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
            Work Experience
          </h2>
        </div>

        <div className="relative border-l border-border-theme pl-8 ml-4 space-y-12">
          {experience.map((exp, i) => (
            <div key={i} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-bg-page bg-accent-primary group-hover:scale-110 transition duration-200 shadow-sm" />

              <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">
                      {exp.role}
                    </h3>
                    <p className="text-accent-primary font-extrabold mt-1 text-md">
                      {exp.company}
                    </p>
                  </div>
                  <span className="px-3.5 py-1.5 bg-bg-input text-text-secondary text-xs font-bold rounded-xl border border-border-theme">
                    {exp.duration}
                  </span>
                </div>

                <p className="mt-4 text-text-secondary leading-8 text-[15px]">
                  {exp.description}
                </p>

                {exp.technologies?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {exp.technologies.map((tech, j) => (
                      <span
                        key={j}
                        className="px-2.5 py-1.5 bg-bg-input text-accent-primary rounded-lg text-xs font-bold border border-border-theme"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {exp.achievements?.length > 0 && (
                  <ul className="mt-4 space-y-2 list-disc list-inside text-text-secondary text-[14px] leading-relaxed">
                    {exp.achievements.map((ach, j) => (
                      <li key={j}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION (SKILLBRIDGE FEATURED FIRST) */}
      <section id="projects" className="py-24 bg-bg-card/40 backdrop-blur-sm border-y border-border-theme/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
              <FaAward size={20} />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
              Featured Projects
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj, i) => {
              const isSkillBridge = proj.title.includes("SkillBridge");
              return (
                <div
                  key={proj._id || i}
                  className={`relative bg-bg-card rounded-3xl p-8 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between ${
                    isSkillBridge
                      ? "border-accent-primary/50 ring-1 ring-accent-primary/10"
                      : "border-border-theme"
                  }`}
                >
                  {isSkillBridge && (
                    <span className="absolute -top-3.5 left-8 px-3.5 py-1 bg-accent-primary text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-md">
                      Featured AI Project
                    </span>
                  )}

                  <div>
                    {proj.image && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 border border-border-theme/40 select-none">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-text-primary">
                        {proj.title}
                      </h3>
                      <span
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase border ${
                          proj.status === "Completed"
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                            : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-text-secondary leading-8 text-[15px] mb-6">
                      {proj.description}
                    </p>

                    {proj.features?.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase text-text-secondary/70 tracking-wider mb-2">
                          Key Features
                        </h4>
                        <ul className="space-y-1.5 list-disc list-inside text-text-secondary text-xs">
                          {proj.features.map((feat, j) => (
                            <li key={j}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {proj.technologies.map((tech, j) => (
                          <span
                            key={j}
                            className="px-2.5 py-1.5 bg-bg-input text-text-primary rounded-lg text-xs font-bold border border-border-theme"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 border-t pt-5 border-border-theme/50">
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-bold text-text-primary hover:text-accent-primary transition"
                        >
                          <FaGithub size={16} /> Repository
                        </a>
                      )}
                      {proj.liveDemoLink && (
                        <a
                          href={proj.liveDemoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-auto transition"
                        >
                          <FaExternalLinkAlt size={12} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATES SECTION */}
      {certificates.length > 0 && (
        <section id="certificates" className="py-24 max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
              <FaCertificate size={20} />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
              Certifications
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <div
                key={cert._id || i}
                className="bg-bg-card rounded-3xl p-6 border border-border-theme shadow-sm flex flex-col justify-between"
              >
                <div>
                  {cert.image && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4 border border-border-theme/40 select-none">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-text-primary text-md">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-semibold mt-1">
                    {cert.issuer}
                  </p>
                  {cert.date && (
                    <p className="text-xs text-text-secondary/70 mt-0.5">
                      {cert.date}
                    </p>
                  )}
                </div>

                {cert.credentialLink && (
                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center gap-1.5 text-xs font-extrabold text-accent-primary hover:text-accent-hover transition"
                  >
                    View Credential <FaExternalLinkAlt size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT SECTION (BALANCED 2-COLUMN GRID, NO MAPS) */}
      <section id="contact" className="py-24 bg-bg-card/40 backdrop-blur-sm border-t border-border-theme/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-bg-input rounded-xl text-accent-primary">
              <FaEnvelope size={20} />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display">
              Contact Me
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Details Cards */}
            <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-text-primary">
                Contact Information
              </h3>
              <p className="text-text-secondary text-[15px] leading-7">
                I am actively seeking new graduate software engineer roles and internships.
                Reach out to schedule an interview or discuss projects.
              </p>

              <div className="space-y-4 pt-2">
                {contactInfo.email && (
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-bg-input rounded-2xl text-text-secondary">
                      <FaEnvelope size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary/70 uppercase tracking-wider">Email</p>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-[15px] font-bold text-text-primary hover:text-accent-primary transition"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-bg-input rounded-2xl text-text-secondary">
                      <FaPhone size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary/70 uppercase tracking-wider">Phone</p>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-[15px] font-bold text-text-primary hover:text-accent-primary transition"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contactInfo.address && (
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-bg-input rounded-2xl text-text-secondary">
                      <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary/70 uppercase tracking-wider">Location</p>
                      <p className="text-[15px] font-bold text-text-primary">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Availability status */}
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                    <FaBriefcase size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary/70 uppercase tracking-wider">Availability</p>
                    <p className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400">
                      Available for Full-Time Roles & Internships
                    </p>
                  </div>
                </div>
              </div>

              {/* Social profiles and Resume download */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border-theme/50">
                {socialLinks.map((link) => {
                  const isGit =
                    link.platform.toLowerCase() === "github" ||
                    link.url.includes("github.com");
                  const isLinkedin =
                    link.platform.toLowerCase() === "linkedin" ||
                    link.url.includes("linkedin.com");

                  return (
                    <a
                      key={link._id || link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-bg-input hover:bg-bg-page border border-border-theme text-xs font-bold rounded-xl text-text-primary transition"
                    >
                      {isGit && <FaGithub size={14} />}
                      {isLinkedin && <FaLinkedin size={14} />}
                      {!isGit && !isLinkedin && <FaExternalLinkAlt size={11} />}
                      {link.platform}
                    </a>
                  );
                })}

                {activeResume && (
                  <a
                    href={activeResume.filepath}
                    download={activeResume.filename}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-bg-input hover:bg-bg-page text-xs font-bold text-accent-primary border border-border-theme rounded-xl transition ml-auto"
                  >
                    <FaDownload size={11} /> Download CV
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Contact Message Form */}
            <div className="bg-bg-card rounded-3xl p-8 border border-border-theme shadow-sm">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary/80 uppercase tracking-wider mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-bg-input border border-border-theme placeholder-text-secondary/55 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/25 text-text-primary transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary/80 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-bg-input border border-border-theme placeholder-text-secondary/55 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/25 text-text-primary transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary/80 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-bg-input border border-border-theme placeholder-text-secondary/55 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/25 text-text-primary transition"
                    placeholder="Opportunity discussion"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary/80 uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-bg-input border border-border-theme placeholder-text-secondary/55 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/25 text-text-primary transition"
                    placeholder="Details about your inquiry..."
                  />
                </div>

                {formError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2 animate-pulse">
                    <FaInfoCircle />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-450 text-xs font-bold rounded-xl">
                    {formSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full bg-accent-primary hover:bg-accent-hover text-white rounded-2xl py-3.5 font-bold transition hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 select-none"
                >
                  {formSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bg-card border-t border-border-theme py-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <p className="text-text-secondary text-sm font-semibold">
            © {new Date().getFullYear()} Aaradhya Sharma • All rights reserved.
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold text-text-secondary/60">
            <a href="/admin/login" className="hover:text-accent-primary">
              Admin Console Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
