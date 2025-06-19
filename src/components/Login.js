// src/components/Login.js
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Invalid email or password. Try again or sign up.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("❌ Google sign-in failed. Try again.");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("⚠️ Please enter your email first to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("✅ Password reset email sent. Check your inbox.");
    } catch (err) {
      setError("❌ Unable to send reset email. Please check your email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-gray-800 space-y-4">
        <h2 className="text-3xl font-bold text-center text-indigo-700">Welcome Back 👋</h2>
        <p className="text-center text-sm text-gray-500">Log in to continue your journaling journey</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>

        <div className="flex justify-between text-sm mt-2">
          <button
            onClick={handleResetPassword}
            className="text-indigo-600 hover:underline"
          >
            Forgot Password?
          </button>
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Don't have an account?
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
