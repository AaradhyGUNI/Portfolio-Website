/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#3b82f6",
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      boxShadow: {
        premium: "0 4px 30px rgba(0, 0, 0, 0.03)",
        "premium-hover": "0 10px 40px rgba(0, 0, 0, 0.08)",
        glass: "0 4px 30px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};
