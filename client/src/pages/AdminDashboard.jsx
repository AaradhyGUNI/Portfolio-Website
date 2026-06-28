import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import apiClient from "../api/apiClient";
import {
  FaHome,
  FaHeading,
  FaUser,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaFolderOpen,
  FaCertificate,
  FaAward,
  FaFilePdf,
  FaAddressBook,
  FaShareAlt,
  FaLock,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import PremiumBackground from "../components/PremiumBackground";

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState("overview");

  // Global State for CRUD data
  const [hero, setHero] = useState({
    fullName: "",
    title: "",
    animatedDesignations: [],
    shortDescription: "",
    profileImage: "",
  });
  const [about, setAbout] = useState({
    biography: "",
    careerObjective: "",
    interests: [],
    currentStatus: "",
    highlights: [],
  });
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    googleMapEmbedUrl: "",
  });
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [messages, setMessages] = useState([]);

  // UI state
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'skill', 'project', 'experience', 'education', 'certificate', 'achievement', 'socialLink'
  const [currentItem, setCurrentItem] = useState(null); // Item being edited
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemData, setDeleteItemData] = useState(null); // { type, id }

  // Tag inputs helper state
  const [tagInput, setTagInput] = useState("");

  // Files inputs state (for previews)
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectImagePreview, setProjectImagePreview] = useState("");
  const [certImageFile, setCertImageFile] = useState(null);
  const [certImagePreview, setCertImagePreview] = useState("");
  const [achImageFile, setAchImageFile] = useState(null);
  const [achImagePreview, setAchImagePreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // Security password fields
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    if (!user) return;
    setFetching(true);
    setErrorMsg("");
    try {
      const [
        heroRes,
        aboutRes,
        contactRes,
        skillsRes,
        expRes,
        eduRes,
        projRes,
        certRes,
        achRes,
        resumeRes,
        socialRes,
        msgRes,
      ] = await Promise.all([
        apiClient.get("/api/portfolio/hero").catch(() => null),
        apiClient.get("/api/portfolio/about").catch(() => null),
        apiClient.get("/api/portfolio/contact-info").catch(() => null),
        apiClient.get("/api/portfolio/skills").catch(() => null),
        apiClient.get("/api/portfolio/experience").catch(() => null),
        apiClient.get("/api/portfolio/education").catch(() => null),
        apiClient.get("/api/portfolio/projects").catch(() => null),
        apiClient.get("/api/portfolio/certificates").catch(() => null),
        apiClient.get("/api/portfolio/achievements").catch(() => null),
        apiClient.get("/api/portfolio/resumes").catch(() => null),
        apiClient.get("/api/portfolio/social-links").catch(() => null),
        apiClient.get("/api/portfolio/messages").catch(() => null),
      ]);

      if (heroRes?.data?.success) setHero(heroRes.data.data);
      if (aboutRes?.data?.success) setAbout(aboutRes.data.data);
      if (contactRes?.data?.success) setContactInfo(contactRes.data.data);
      
      // Expunge "Student Management" references if any exist in the database list
      if (skillsRes?.data?.success) {
        setSkills(skillsRes.data.data.filter(s => s.name.toLowerCase() !== "student management system"));
      }
      if (expRes?.data?.success) setExperience(expRes.data.data);
      if (eduRes?.data?.success) setEducation(eduRes.data.data);
      
      if (projRes?.data?.success) {
        setProjects(projRes.data.data.filter(p => p.title.toLowerCase() !== "student management system"));
      }
      if (certRes?.data?.success) setCertificates(certRes.data.data);
      if (achRes?.data?.success) setAchievements(achRes.data.data);
      if (resumeRes?.data?.success) setResumes(resumeRes.data.data);
      if (socialRes?.data?.success) setSocialLinks(socialRes.data.data);
      if (msgRes?.data?.success) setMessages(msgRes.data.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load dashboard data.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Flash alerts helper
  const triggerNotification = (type, message) => {
    if (type === "success") {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  // Profile Image Selection Handler
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerNotification("error", "Image file size exceeds 5MB limit.");
        return;
      }
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // Save Hero Section
  const handleSaveHero = async (e) => {
    e.preventDefault();
    console.log("handleSaveHero triggered. State payload:", hero);
    setSaving(true);
    try {
      const data = new FormData();
      data.append("fullName", hero.fullName);
      data.append("title", hero.title);
      data.append("shortDescription", hero.shortDescription);
      data.append(
        "animatedDesignations",
        JSON.stringify(hero.animatedDesignations)
      );
      if (profileImageFile) {
        data.append("profileImage", profileImageFile);
      }

      console.log("Sending Hero PUT request via apiClient...");
      const res = await apiClient.put("/api/portfolio/hero", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Hero PUT request completed. Response:", res.data);
      if (res.data.success) {
        setHero(res.data.data);
        setProfileImageFile(null);
        triggerNotification("success", "Hero section updated successfully.");
      }
    } catch (err) {
      console.error("Hero PUT request failed:", err);
      triggerNotification(
        "error",
        err.response?.data?.message || "Failed to update Hero section."
      );
    } finally {
      setSaving(false);
    }
  };

  // Save About Section
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    console.log("handleSaveAbout triggered. State payload:", about);
    setSaving(true);
    try {
      console.log("Sending About PUT request via apiClient...");
      const res = await apiClient.put("/api/portfolio/about", about);
      console.log("About PUT request completed. Response:", res.data);
      if (res.data.success) {
        setAbout(res.data.data);
        triggerNotification("success", "About section updated successfully.");
      }
    } catch (err) {
      console.error("About PUT request failed:", err);
      triggerNotification(
        "error",
        err.response?.data?.message || "Failed to update About section."
      );
    } finally {
      setSaving(false);
    }
  };

  // Save Contact Info
  const handleSaveContactInfo = async (e) => {
    e.preventDefault();
    console.log("handleSaveContactInfo triggered. State payload:", contactInfo);
    setSaving(true);
    try {
      console.log("Sending Contact Info PUT request via apiClient...");
      const res = await apiClient.put("/api/portfolio/contact-info", contactInfo);
      console.log("Contact Info PUT request completed. Response:", res.data);
      if (res.data.success) {
        setContactInfo(res.data.data);
        triggerNotification(
          "success",
          "Contact information updated successfully."
        );
      }
    } catch (err) {
      console.error("Contact Info PUT request failed:", err);
      triggerNotification(
        "error",
        err.response?.data?.message || "Failed to update Contact info."
      );
    } finally {
      setSaving(false);
    }
  };

  // Save Passwords
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    console.log("handleSaveSecurity triggered. State payload:", passwords);
    if (passwords.newPassword !== passwords.confirmPassword) {
      triggerNotification("error", "New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      console.log("Sending security password update PUT request via apiClient...");
      const res = await apiClient.put("/api/auth/update-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      console.log("Security password update PUT request completed. Response:", res.data);
      if (res.data.success) {
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        triggerNotification("success", "Password updated successfully.");
      }
    } catch (err) {
      console.error("Security password update failed:", err);
      triggerNotification(
        "error",
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setSaving(false);
    }
  };

  // Message Operations
  const handleMarkMessageRead = async (id) => {
    try {
      const res = await apiClient.put(`/api/portfolio/messages/${id}/read`);
      if (res.data.success) {
        setMessages(messages.map((m) => (m._id === id ? res.data.data : m)));
        triggerNotification("success", "Message marked as read.");
      }
    } catch (err) {
      triggerNotification("error", "Failed to update message state.");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const res = await apiClient.delete(`/api/portfolio/messages/${id}`);
      if (res.data.success) {
        setMessages(messages.filter((m) => m._id !== id));
        triggerNotification("success", "Message deleted.");
      }
    } catch (err) {
      triggerNotification("error", "Failed to delete message.");
    }
  };

  // Resume Operations
  const handleUploadResume = async (e) => {
    e.preventDefault();
    console.log("handleUploadResume triggered. File payload:", resumeFile);
    if (!resumeFile) {
      triggerNotification("error", "Please choose a PDF file first.");
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append("resume", resumeFile);

      console.log("Sending Resume upload POST request via apiClient...");
      const res = await apiClient.post("/api/portfolio/resumes", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Resume upload POST request completed. Response:", res.data);
      if (res.data.success) {
        setResumes([res.data.data, ...resumes.map((r) => ({ ...r, isActive: false }))]);
        setResumeFile(null);
        document.getElementById("resume-input-file").value = "";
        triggerNotification("success", "Resume uploaded and activated successfully.");
      }
    } catch (err) {
      console.error("Resume upload POST request failed:", err);
      triggerNotification(
        "error",
        err.response?.data?.message || "Failed to upload resume."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetActiveResume = async (id) => {
    try {
      const res = await apiClient.put(`/api/portfolio/resumes/${id}/active`);
      if (res.data.success) {
        setResumes(
          resumes.map((r) => ({ ...r, isActive: r._id === id }))
        );
        triggerNotification("success", "Active resume updated.");
      }
    } catch (err) {
      triggerNotification("error", "Failed to set active resume.");
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      const res = await apiClient.delete(`/api/portfolio/resumes/${id}`);
      if (res.data.success) {
        setResumes(resumes.filter((r) => r._id !== id));
        triggerNotification("success", "Resume deleted.");
      }
    } catch (err) {
      triggerNotification("error", "Failed to delete resume.");
    }
  };

  // Open Add/Edit Modal
  const openAddEditModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(
      item
        ? { ...item }
        : getEmptyItemState(type)
    );
    // Reset file preview states
    setProjectImageFile(null);
    setProjectImagePreview(item?.image || "");
    setCertImageFile(null);
    setCertImagePreview(item?.image || "");
    setAchImageFile(null);
    setAchImagePreview(item?.image || "");

    setModalOpen(true);
  };

  const getEmptyItemState = (type) => {
    switch (type) {
      case "skill":
        return { name: "", category: "Programming Languages", level: "Intermediate" };
      case "experience":
        return { company: "", role: "", duration: "", description: "", technologies: [], achievements: [] };
      case "education":
        return { degree: "", university: "", duration: "", cgpa: "", achievements: [] };
      case "project":
        return { title: "", description: "", technologies: [], features: [], githubLink: "", liveDemoLink: "", status: "Completed", caseStudy: "" };
      case "certificate":
        return { title: "", issuer: "", date: "", credentialLink: "", image: "" };
      case "achievement":
        return { title: "", description: "", date: "", image: "" };
      case "socialLink":
        return { platform: "", url: "" };
      default:
        return {};
    }
  };

  const getRoutePath = (type) => {
    switch (type) {
      case "skill":
        return "skills";
      case "experience":
        return "experience";
      case "education":
        return "education";
      case "project":
        return "projects";
      case "certificate":
        return "certificates";
      case "achievement":
        return "achievements";
      case "socialLink":
        return "social-links";
      default:
        return `${type}s`;
    }
  };

  // Save Modal Item (Add/Edit Submit)
  const handleModalSave = async (e) => {
    e.preventDefault();
    console.log(`handleModalSave [${modalType}] triggered. State payload:`, currentItem);
    setSaving(true);
    try {
      let url = `/api/portfolio/${getRoutePath(modalType)}`;
      let method = currentItem._id ? "PUT" : "POST";
      if (currentItem._id) {
        url += `/${currentItem._id}`;
      }

      let payload;
      let headers = {};

      const hasFile = ["project", "certificate", "achievement"].includes(modalType);

      if (hasFile) {
        payload = new FormData();
        Object.keys(currentItem).forEach((key) => {
          if (["technologies", "features", "achievements"].includes(key)) {
            payload.append(key, JSON.stringify(currentItem[key]));
          } else if (key !== "_id" && key !== "image" && key !== "createdAt" && key !== "updatedAt") {
            payload.append(key, currentItem[key]);
          }
        });

        if (modalType === "project" && projectImageFile) {
          payload.append("image", projectImageFile);
        } else if (modalType === "certificate" && certImageFile) {
          payload.append("image", certImageFile);
        } else if (modalType === "achievement" && achImageFile) {
          payload.append("image", achImageFile);
        }

        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = currentItem;
      }

      console.log(`Sending modal save request [${method}] to ${url}...`);
      const res = await apiClient({
        url,
        method,
        data: payload,
        headers,
      });
      console.log(`Modal save request [${method}] completed. Response:`, res.data);

      if (res.data.success) {
        const updatedList = currentItem._id
          ? getListState(modalType).map((item) => (item._id === currentItem._id ? res.data.data : item))
          : [res.data.data, ...getListState(modalType)];

        setListState(modalType, updatedList);
        setModalOpen(false);
        triggerNotification("success", `${modalType.toUpperCase()} saved successfully.`);
      }
    } catch (err) {
      console.error(`Modal save request [${modalType}] failed:`, err);
      triggerNotification(
        "error",
        err.response?.data?.message || `Failed to save ${modalType}.`
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete Request Confirmation Trigger
  const triggerDeleteConfirm = (type, id) => {
    setDeleteItemData({ type, id });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItemData) return;
    const { type, id } = deleteItemData;
    try {
      const res = await apiClient.delete(`/api/portfolio/${getRoutePath(type)}/${id}`);
      if (res.data.success) {
        const filtered = getListState(type).filter((item) => item._id !== id);
        setListState(type, filtered);
        triggerNotification("success", `${type.toUpperCase()} deleted successfully.`);
      }
    } catch (err) {
      triggerNotification("error", `Failed to delete ${type}.`);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteItemData(null);
    }
  };

  // State mapping helpers
  const getListState = (type) => {
    switch (type) {
      case "skill":
        return skills;
      case "experience":
        return experience;
      case "education":
        return education;
      case "project":
        return projects;
      case "certificate":
        return certificates;
      case "achievement":
        return achievements;
      case "socialLink":
        return socialLinks;
      default:
        return [];
    }
  };

  const setListState = (type, value) => {
    switch (type) {
      case "skill":
        setSkills(value);
        break;
      case "experience":
        setExperience(value);
        break;
      case "education":
        setEducation(value);
        break;
      case "project":
        setProjects(value);
        break;
      case "certificate":
        setCertificates(value);
        break;
      case "achievement":
        setAchievements(value);
        break;
      case "socialLink":
        setSocialLinks(value);
        break;
      default:
        break;
    }
  };

  // Tags/Badges inputs utilities
  const addTag = (field) => {
    if (!tagInput.trim()) return;
    setCurrentItem({
      ...currentItem,
      [field]: [...(currentItem[field] || []), tagInput.trim()],
    });
    setTagInput("");
  };

  const removeTag = (field, index) => {
    setCurrentItem({
      ...currentItem,
      [field]: currentItem[field].filter((_, i) => i !== index),
    });
  };

  const addDesignation = () => {
    if (!tagInput.trim()) return;
    setHero({
      ...hero,
      animatedDesignations: [...hero.animatedDesignations, tagInput.trim()],
    });
    setTagInput("");
  };

  const removeDesignation = (index) => {
    setHero({
      ...hero,
      animatedDesignations: hero.animatedDesignations.filter((_, i) => i !== index),
    });
  };

  const addInterest = () => {
    if (!tagInput.trim()) return;
    setAbout({
      ...about,
      interests: [...about.interests, tagInput.trim()],
    });
    setTagInput("");
  };

  const removeInterest = (index) => {
    setAbout({
      ...about,
      interests: about.interests.filter((_, i) => i !== index),
    });
  };

  const addHighlight = () => {
    if (!tagInput.trim()) return;
    setAbout({
      ...about,
      highlights: [...about.highlights, tagInput.trim()],
    });
    setTagInput("");
  };

  const removeHighlight = (index) => {
    setAbout({
      ...about,
      highlights: about.highlights.filter((_, i) => i !== index),
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <FaSpinner className="animate-spin text-blue-600" size={30} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row text-text-primary bg-bg-page">
      <PremiumBackground />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900/95 dark:bg-zinc-950/95 border-b md:border-r border-slate-800 dark:border-zinc-800 flex flex-col p-6 text-white z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
            <span className="text-[11px] text-slate-455 font-bold uppercase mt-1">
              Logged in: {user?.username}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-350"
          >
            {theme === "dark" ? <FaSun size={13} /> : <FaMoon size={13} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar max-h-[50vh] md:max-h-none">
          {[
            { id: "overview", label: "Dashboard", icon: <FaHome /> },
            { id: "hero", label: "Hero Info", icon: <FaHeading /> },
            { id: "about", label: "About Info", icon: <FaUser /> },
            { id: "skills", label: "Skills (CRUD)", icon: <FaCode /> },
            { id: "experience", label: "Experience (CRUD)", icon: <FaBriefcase /> },
            { id: "education", label: "Education (CRUD)", icon: <FaGraduationCap /> },
            { id: "projects", label: "Projects (CRUD)", icon: <FaFolderOpen /> },
            { id: "certificates", label: "Certificates (CRUD)", icon: <FaCertificate /> },
            { id: "achievements", label: "Achievements", icon: <FaAward /> },
            { id: "resume", label: "Resume Upload", icon: <FaFilePdf /> },
            { id: "contact", label: "Contact Info", icon: <FaAddressBook /> },
            { id: "socials", label: "Social Links", icon: <FaShareAlt /> },
            { id: "security", label: "Security/Pass", icon: <FaLock /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800 dark:border-zinc-800 mt-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all select-none"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
          <a
            href="/"
            className="block text-center text-xs text-slate-500 hover:text-slate-355 mt-4 underline font-medium"
          >
            Back to Public Site
          </a>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-full z-0">
        {/* Flash Notifications */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold rounded-2xl flex items-center gap-3">
            <FaInfoCircle /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold rounded-2xl flex items-center gap-3">
            <FaCheck /> {successMsg}
          </div>
        )}

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-theme/50">
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary capitalize">
            {activeTab === "overview" ? "Dashboard Overview" : `${activeTab} Management`}
          </h2>
          {fetching && <FaSpinner className="animate-spin text-blue-600" />}
        </div>

        {/* TAB VIEWS */}

        {/* 1. OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Total Projects", val: projects.length, icon: <FaFolderOpen /> },
                { label: "Skills Registered", val: skills.length, icon: <FaCode /> },
                { label: "Inbox Messages", val: messages.length, icon: <FaEnvelopeOpenTextWrapper /> },
                {
                  label: "Active Resume",
                  val: resumes.find((r) => r.isActive) ? "Uploaded" : "None",
                  icon: <FaFilePdf />,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-bg-card rounded-2xl p-5 border border-border-theme shadow-sm flex items-center gap-4 animate-all"
                >
                  <div className="p-3.5 bg-bg-input rounded-xl text-accent-primary">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-secondary">{card.label}</p>
                    <p className="text-lg font-bold text-text-primary mt-0.5">
                      {card.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inbox Messages */}
            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-6 border border-slate-200/50 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Visitor Messages Inbox
              </h3>

              {messages.length === 0 ? (
                <p className="text-sm text-slate-500 py-6">No messages received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-bold uppercase">
                        <th className="pb-3">Sender</th>
                        <th className="pb-3">Subject</th>
                        <th className="pb-3">Message</th>
                        <th className="pb-3">Received At</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                      {messages.map((msg) => (
                        <tr
                          key={msg._id}
                          className={`hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition ${
                            !msg.isRead ? "font-bold text-slate-900 dark:text-white" : "text-slate-500"
                          }`}
                        >
                          <td className="py-4">
                            <div>
                              <p className="text-sm">{msg.name}</p>
                              <p className="text-xs text-slate-400 font-normal">{msg.email}</p>
                            </div>
                          </td>
                          <td className="py-4">{msg.subject || "(No Subject)"}</td>
                          <td className="py-4 max-w-xs truncate">{msg.message}</td>
                          <td className="py-4 text-xs font-normal text-slate-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </td>
                          <td className="py-4 text-right space-x-2">
                            {!msg.isRead && (
                              <button
                                onClick={() => handleMarkMessageRead(msg._id)}
                                className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 text-xs font-bold rounded-lg transition"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                            >
                              <FaTrash size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. HERO */}
        {activeTab === "hero" && (
          <form onSubmit={handleSaveHero} className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-8 border border-slate-200/50 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={hero.fullName}
                  onChange={(e) => setHero({ ...hero, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Primary Title / Designation
                </label>
                <input
                  type="text"
                  required
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Short Introduction Description
              </label>
              <textarea
                rows="4"
                required
                value={hero.shortDescription}
                onChange={(e) => setHero({ ...hero, shortDescription: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            {/* Profile Image upload and preview */}
            <div className="grid md:grid-cols-3 gap-6 items-center border-t border-slate-200/40 dark:border-zinc-800/40 pt-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Profile Photo File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-slate-400 font-bold mb-2">Image Preview</p>
                <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-200 bg-slate-100 dark:bg-zinc-800 dark:border-zinc-700 flex items-center justify-center">
                  {profileImagePreview || hero.profileImage ? (
                    <img
                      src={profileImagePreview || hero.profileImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Animated designations tags list */}
            <div className="border-t border-slate-200/40 dark:border-zinc-800/40 pt-6">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Animated Designations Typing List
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                  placeholder="e.g. Full-Stack Developer"
                />
                <button
                  type="button"
                  onClick={addDesignation}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-sm font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hero.animatedDesignations?.map((des, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/30 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    <span>{des}</span>
                    <button
                      type="button"
                      onClick={() => removeDesignation(i)}
                      className="text-red-500 font-bold hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 flex items-center gap-2 select-none"
            >
              {saving && <FaSpinner className="animate-spin" />} Save Hero Info
            </button>
          </form>
        )}

        {/* 3. ABOUT */}
        {activeTab === "about" && (
          <form onSubmit={handleSaveAbout} className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-8 border border-slate-200/50 dark:border-zinc-800 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Biography Paragraph
              </label>
              <textarea
                rows="6"
                required
                value={about.biography}
                onChange={(e) => setAbout({ ...about, biography: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Career Objective
              </label>
              <textarea
                rows="3"
                value={about.careerObjective}
                onChange={(e) => setAbout({ ...about, careerObjective: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Current Status Detail
                </label>
                <input
                  type="text"
                  value={about.currentStatus}
                  onChange={(e) => setAbout({ ...about, currentStatus: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                  placeholder="e.g. 7th Semester CE Student"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Current Focus Goal
                </label>
                <input
                  type="text"
                  value={about.currentFocus || ""}
                  onChange={(e) => setAbout({ ...about, currentFocus: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                  placeholder="e.g. Advanced System Design..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Long Term Career Goals
              </label>
              <textarea
                rows="2"
                value={about.careerGoals || ""}
                onChange={(e) => setAbout({ ...about, careerGoals: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                placeholder="Where do you see yourself in 5 years?"
              />
            </div>

            {/* Interests & highlights list fields */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-slate-200/40 dark:border-zinc-800/40 pt-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Interests
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    id="interest-input"
                    className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    placeholder="e.g. System Design"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inp = document.getElementById("interest-input");
                      if (inp.value.trim()) {
                        setAbout({
                          ...about,
                          interests: [...about.interests, inp.value.trim()],
                        });
                        inp.value = "";
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-105 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-sm font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.interests?.map((interest, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAbout({
                            ...about,
                            interests: about.interests.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Highlights Quick Badges
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    id="highlight-input"
                    className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    placeholder="e.g. CGPA 7.50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const inp = document.getElementById("highlight-input");
                      if (inp.value.trim()) {
                        setAbout({
                          ...about,
                          highlights: [...about.highlights, inp.value.trim()],
                        });
                        inp.value = "";
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-105 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 text-sm font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {about.highlights?.map((high, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-750 dark:text-emerald-400 border border-emerald-100/30 text-xs font-bold rounded-lg flex items-center gap-1.5"
                    >
                      <span>{high}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setAbout({
                            ...about,
                            highlights: about.highlights.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 flex items-center gap-2 select-none"
            >
              {saving && <FaSpinner className="animate-spin" />} Save About Info
            </button>
          </form>
        )}

        {/* 4. SKILLS (CRUD) */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("skill")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Skill
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Skill Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {skills.map((skill) => (
                    <tr key={skill._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {skill.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-300">
                        {skill.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[11px] font-bold rounded-lg uppercase">
                          {skill.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("skill", skill)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("skill", skill._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. EXPERIENCE (CRUD) */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("experience")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Experience
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Role & Company</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {experience.map((exp) => (
                    <tr key={exp._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{exp.role}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                            {exp.company}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-300">
                        {exp.duration}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">{exp.description}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("experience", exp)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("experience", exp._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. EDUCATION (CRUD) */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("education")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Education
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Degree & School</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">CGPA / Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {education.map((edu) => (
                    <tr key={edu._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{edu.degree}</p>
                          <p className="text-xs text-slate-400">{edu.university}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-300">
                        {edu.duration}
                      </td>
                      <td className="px-6 py-4 font-semibold">{edu.cgpa || "—"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("education", edu)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("education", edu._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. PROJECTS (CRUD) */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("project")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Project
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Tech Stack</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {projects.map((proj) => (
                    <tr key={proj._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {proj.image && (
                            <img
                              src={proj.image}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border"
                            />
                          )}
                          <span className="font-bold text-slate-900 dark:text-white">
                            {proj.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-xs font-bold rounded-lg uppercase">
                          {proj.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-500 dark:text-zinc-300">
                        {proj.technologies?.join(", ")}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("project", proj)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("project", proj._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. CERTIFICATES (CRUD) */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("certificate")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Certificate
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Title & Issuer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {certificates.map((cert) => (
                    <tr key={cert._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          {cert.image && (
                            <img
                              src={cert.image}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border"
                            />
                          )}
                          <div>
                            <p className="font-bold">{cert.title}</p>
                            <p className="text-xs text-slate-400 font-semibold">{cert.issuer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-zinc-300">{cert.date}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("certificate", cert)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("certificate", cert._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. ACHIEVEMENTS */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("achievement")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Achievement
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Title & Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {achievements.map((ach) => (
                    <tr key={ach._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {ach.image && (
                            <img
                              src={ach.image}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border"
                            />
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{ach.title}</p>
                            <p className="text-xs text-slate-400">{ach.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-500 dark:text-zinc-300">{ach.description}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("achievement", ach)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("achievement", ach._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. RESUME */}
        {activeTab === "resume" && (
          <div className="space-y-8">
            <form onSubmit={handleUploadResume} className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-8 border border-slate-200/50 dark:border-zinc-800 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Upload PDF Resume Document
                </label>
                <input
                  type="file"
                  id="resume-input-file"
                  accept=".pdf"
                  required
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 flex items-center gap-2 select-none"
              >
                {saving && <FaSpinner className="animate-spin" />} Upload & Activate Resume
              </button>
            </form>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-6 border border-slate-200/50 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Uploaded Resumes History
              </h3>

              {resumes.length === 0 ? (
                <p className="text-sm text-slate-500 py-6">No resumes uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 text-xs font-bold uppercase">
                        <th className="pb-3">Filename</th>
                        <th className="pb-3">Uploaded Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                      {resumes.map((res) => (
                        <tr key={res._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                          <td className="py-4 font-medium text-slate-750 dark:text-zinc-200">
                            <a
                              href={res.filepath}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1.5"
                            >
                              <FaFilePdf /> {res.filename}
                            </a>
                          </td>
                          <td className="py-4 text-xs text-slate-400">
                            {new Date(res.createdAt).toLocaleString()}
                          </td>
                          <td className="py-4">
                            {res.isActive ? (
                              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200/20">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-400 text-xs font-bold rounded-lg">
                                INACTIVE
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right space-x-2">
                            {!res.isActive && (
                              <button
                                onClick={() => handleSetActiveResume(res._id)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition"
                              >
                                Set Active
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteResume(res._id)}
                              className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                            >
                              <FaTrash size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 11. CONTACT INFO */}
        {activeTab === "contact" && (
          <form onSubmit={handleSaveContactInfo} className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-8 border border-slate-200/50 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Contact Email Address
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Office / Residence Address
              </label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Google Map Iframe Embed URL (source attribute of map iframe)
              </label>
              <input
                type="text"
                value={contactInfo.googleMapEmbedUrl}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, googleMapEmbedUrl: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                placeholder="https://www.google.com/maps/embed?..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 flex items-center gap-2 select-none"
            >
              {saving && <FaSpinner className="animate-spin" />} Save Contact Info
            </button>
          </form>
        )}

        {/* 12. SOCIAL LINKS */}
        {activeTab === "socials" && (
          <div className="space-y-6">
            <button
              onClick={() => openAddEditModal("socialLink")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/10 transition select-none"
            >
              <FaPlus size={12} /> Add Social Link
            </button>

            <div className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl border border-slate-200/50 dark:border-zinc-800 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-400 text-xs font-bold uppercase">
                    <th className="px-6 py-4">Platform</th>
                    <th className="px-6 py-4">Profile URL</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                  {socialLinks.map((link) => (
                    <tr key={link._id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/20">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {link.platform}
                      </td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400">
                        <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
                          {link.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openAddEditModal("socialLink", link)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-lg transition"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm("socialLink", link._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 13. SECURITY */}
        {activeTab === "security" && (
          <form onSubmit={handleSaveSecurity} className="bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-8 border border-slate-200/50 dark:border-zinc-800 shadow-sm space-y-6 max-w-xl">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                required
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 flex items-center gap-2 select-none"
            >
              {saving && <FaSpinner className="animate-spin" />} Update Password
            </button>
          </form>
        )}
      </main>

      {/* CRUD ADD/EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-zinc-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-300 dark:border-zinc-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 capitalize pb-3 border-b border-slate-200 dark:border-zinc-800">
              {currentItem?._id ? `Edit ${modalType}` : `Add New ${modalType}`}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-5">
              {/* SKILLS */}
              {modalType === "skill" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      required
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Category
                      </label>
                      <select
                        value={currentItem.category}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, category: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white font-semibold"
                      >
                        {[
                          "Programming Languages",
                          "Frontend",
                          "Backend",
                          "Database",
                          "AI & ML",
                          "Tools",
                          "Cloud",
                          "Version Control",
                          "Soft Skills",
                        ].map((cat) => (
                          <option key={cat} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Level
                      </label>
                      <select
                        value={currentItem.level}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, level: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white font-semibold"
                      >
                        <option className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Beginner</option>
                        <option className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Intermediate</option>
                        <option className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL LINKS */}
              {modalType === "socialLink" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      required
                      value={currentItem.platform}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, platform: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      placeholder="e.g. GitHub"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={currentItem.url}
                      onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              )}

              {/* EXPERIENCE */}
              {modalType === "experience" && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.company}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, company: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.role}
                        onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={currentItem.duration}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, duration: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      placeholder="e.g. May 2026 – June 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      value={currentItem.description}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, description: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Technologies Used
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        id="tech-modal-input"
                        className="flex-1 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                        placeholder="e.g. React"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inp = document.getElementById("tech-modal-input");
                          if (inp.value.trim()) {
                            setCurrentItem({
                              ...currentItem,
                              technologies: [...(currentItem.technologies || []), inp.value.trim()],
                            });
                            inp.value = "";
                          }
                        }}
                        className="px-3 bg-slate-100 dark:bg-zinc-800 text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentItem.technologies?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-305 text-xs rounded-lg flex items-center gap-1"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentItem({
                                ...currentItem,
                                technologies: currentItem.technologies.filter((_, tagI) => tagI !== idx),
                              })
                            }
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDUCATION */}
              {modalType === "education" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Degree Title
                    </label>
                    <input
                      type="text"
                      required
                      value={currentItem.degree}
                      onChange={(e) => setCurrentItem({ ...currentItem, degree: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      University / School
                    </label>
                    <input
                      type="text"
                      required
                      value={currentItem.university}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, university: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.duration}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, duration: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        CGPA / Score
                      </label>
                      <input
                        type="text"
                        value={currentItem.cgpa}
                        onChange={(e) => setCurrentItem({ ...currentItem, cgpa: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS */}
              {modalType === "project" && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Project Title
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.title}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, title: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Status
                      </label>
                      <select
                        value={currentItem.status}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, status: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white font-semibold"
                      >
                        <option className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Completed</option>
                        <option className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">In Progress</option>
                        <option className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">Planned</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={currentItem.description}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, description: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        GitHub Link
                      </label>
                      <input
                        type="text"
                        value={currentItem.githubLink}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, githubLink: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Live Demo Link
                      </label>
                      <input
                        type="text"
                        value={currentItem.liveDemoLink}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, liveDemoLink: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Image Selector */}
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Project Thumbnail
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setProjectImageFile(file);
                            setProjectImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:bg-blue-55 file:text-blue-700 file:border-0 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1 font-bold">Preview</span>
                      <div className="w-16 h-16 rounded-xl border border-slate-200 dark:border-zinc-750 overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                        {projectImagePreview ? (
                          <img src={projectImagePreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Technologies
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        id="proj-tech-input"
                        className="flex-1 bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-705 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-800 dark:text-white"
                        placeholder="e.g. MongoDB"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inp = document.getElementById("proj-tech-input");
                          if (inp.value.trim()) {
                            setCurrentItem({
                              ...currentItem,
                              technologies: [...(currentItem.technologies || []), inp.value.trim()],
                            });
                            inp.value = "";
                          }
                        }}
                        className="px-3 bg-slate-100 dark:bg-zinc-800 text-xs font-bold rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentItem.technologies?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-xs rounded-lg flex items-center gap-1"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentItem({
                                ...currentItem,
                                technologies: currentItem.technologies.filter((_, tIdx) => tIdx !== idx),
                              })
                            }
                            className="text-red-505 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CERTIFICATE */}
              {modalType === "certificate" && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Certificate Title
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.title}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, title: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Issuer
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.issuer}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, issuer: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Issued Date
                      </label>
                      <input
                        type="text"
                        value={currentItem.date}
                        onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700"
                        placeholder="e.g. June 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Credential URL Link
                      </label>
                      <input
                        type="text"
                        value={currentItem.credentialLink}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, credentialLink: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Certificate Image Upload */}
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Certificate Document Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setCertImageFile(file);
                            setCertImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:bg-blue-50 file:text-blue-700 file:border-0 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1 font-bold">Preview</span>
                      <div className="w-16 h-16 border rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        {certImagePreview ? (
                          <img src={certImagePreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACHIEVEMENT */}
              {modalType === "achievement" && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Achievement Title
                      </label>
                      <input
                        type="text"
                        required
                        value={currentItem.title}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, title: e.target.value })
                        }
                        className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Achievement Date
                      </label>
                      <input
                        type="text"
                        value={currentItem.date}
                        onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-zinc-855 border border-slate-200 dark:border-zinc-700"
                        placeholder="e.g. 2026"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={currentItem.description}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, description: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-700"
                    />
                  </div>

                  {/* Achievement Image */}
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                        Related Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAchImageFile(file);
                            setAchImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:bg-blue-50 file:text-blue-700 file:border-0 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-slate-400 mb-1 font-bold">Preview</span>
                      <div className="w-16 h-16 border rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                        {achImagePreview ? (
                          <img src={achImagePreview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-zinc-800 mt-8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <FaSpinner className="animate-spin" />} Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Confirm Deletion
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this {deleteItemData?.type}? This action cannot be
              undone, and the associated files on the disk will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4.5 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-sm font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4.5 py-2.5 bg-red-600 hover:bg-red-750 text-white text-sm font-bold rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper local components for rendering icons cleanly without breaking compile
function FaEnvelopeOpenTextWrapper() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="14"
      width="14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.88L99.03 273.89A48 48 0 0 0 64 316.8V448a32 32 0 0 0 32 32h320a32 32 0 0 0 32-32V316.8a48 48 0 0 0-35.03-42.91L256 417.88zM448 160H64c-35.35 0-64 28.65-64 64v30.43c0 9.07 5.09 17.39 12.87 21.91l141.4 82.02A160.002 160.002 0 0 0 256 368c36.43 0 71.18-12.44 101.73-39.64l141.4-82.02A25.4 25.4 0 0 0 512 254.43V224c0-35.35-28.65-64-64-64zM256 0c-35.35 0-64 28.65-64 64v32h128V64c0-35.35-28.65-64-64-64z" />
    </svg>
  );
}
