// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">Smart Journal 📔</h1>
        <p className="text-xl font-medium text-white/90">
          Capture your thoughts. Reflect. Grow. 🌱
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-pink-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            Signup
          </Link>
        </div>
      </div>

      <footer className="mt-10 text-sm text-white/70 text-center">
        Made with ❤️ by{" "}
        <a
          href="https://www.linkedin.com/in/ankit-6b2973330/"
          className="underline hover:text-indigo-200"
          target="_blank"
          rel="noreferrer"
        >
          Ankit
        </a>
      </footer>
    </div>
  );
}

export default Home;
