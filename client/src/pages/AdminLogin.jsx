import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon, FaLock, FaUser, FaSpinner } from "react-icons/fa";
import PremiumBackground from "../components/PremiumBackground";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { username, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate("/admin/dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 text-text-primary bg-bg-page">
      <PremiumBackground />

      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-6xl mx-auto">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-text-primary"
        >
          Aaradhya{" "}
          <span className="text-accent-primary">Sharma</span>
        </a>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-bg-input border border-border-theme backdrop-blur-md text-text-primary"
        >
          {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
        </button>
      </header>

      <div className="w-full max-w-md bg-bg-card border border-border-theme rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Admin Portal
          </h2>
          <p className="text-text-secondary text-sm mt-2 font-medium">
            Sign in to manage your portfolio content
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm font-semibold rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-text-secondary/80 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                <FaUser size={14} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-input border border-border-theme rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/25 text-text-primary placeholder-text-secondary/40 transition"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary/80 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50">
                <FaLock size={14} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-input border border-border-theme rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/25 text-text-primary placeholder-text-secondary/40 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 bg-accent-primary hover:bg-accent-hover text-white rounded-2xl py-4 font-bold shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 select-none"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
