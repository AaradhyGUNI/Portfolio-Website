import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function PremiumBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
      {/* Mesh Gradient Layer */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          theme === "dark" ? "mesh-gradient-dark" : "mesh-gradient-light"
        }`}
      />

      {/* Grid Pattern Layer */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          theme === "dark" ? "grid-bg-dark" : "grid-bg-light"
        }`}
      />

      {/* Top Spotlight Glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-all duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-b from-blue-500/10 to-indigo-500/0 opacity-40"
            : "bg-gradient-to-b from-blue-400/5 to-indigo-400/0 opacity-60"
        }`}
      />

      {/* Bottom Subtle Ambient Glow */}
      <div
        className={`absolute bottom-0 right-10 w-[500px] h-[300px] rounded-full blur-[150px] pointer-events-none transition-all duration-500 ${
          theme === "dark"
            ? "bg-purple-900/5 opacity-30"
            : "bg-purple-200/5 opacity-50"
        }`}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise-overlay opacity-100" />
    </div>
  );
}
