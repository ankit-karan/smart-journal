// src/components/Dashboard.js
import React from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
      }`}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Smart Journal Dashboard</h1>
          <p className="text-lg">Welcome back!</p>
          <p className="text-sm mt-1 text-gray-200">
            Logged in as:{" "}
            <span className="font-medium text-yellow-300">
              {auth.currentUser?.email}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/write")}
            className="w-full bg-white text-purple-700 font-semibold py-3 px-4 rounded shadow hover:bg-gray-100"
          >
            📝 Write Journal
          </button>
          <button
            onClick={() => navigate("/entries")}
            className="w-full bg-white text-green-700 font-semibold py-3 px-4 rounded shadow hover:bg-gray-100"
          >
            📚 View Past Entries
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="w-full bg-white text-indigo-700 font-semibold py-3 px-4 rounded shadow hover:bg-gray-100"
          >
            🤖 Talk to AI Assistant
          </button>
        </div>

        <div className="flex justify-between pt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white text-sm text-black px-3 py-1 rounded hover:bg-gray-200"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-white text-sm text-red-600 px-3 py-1 rounded hover:bg-gray-200"
          >
            🚪 Logout
          </button>
        </div>

        <p className="text-center text-xs text-white/70 pt-6">
          © {new Date().getFullYear()} Smart Journal | Made by{" "}
          <a
            href="https://www.linkedin.com/in/ankit-6b2973330/"
            className="underline hover:text-yellow-200"
            target="_blank"
            rel="noreferrer"
          >
            Ankit
          </a>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
