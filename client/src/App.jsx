import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Portfolio from "./pages/Portfolio";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-zinc-950">
      <h1 className="text-9xl font-extrabold text-blue-600 dark:text-blue-400 tracking-widest animate-pulse select-none">
        404
      </h1>
      <div className="bg-slate-900 text-white px-3 py-1 text-xs font-bold rounded rotate-12 absolute -mt-16 select-none">
        Page Not Found
      </div>
      <p className="text-slate-500 dark:text-zinc-400 mt-8 font-semibold text-lg">
        The page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all select-none"
      >
        Go Back Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
