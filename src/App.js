// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AIChat from "./components/AIChat";
import JournalList from "./components/JournalList";
import WriteJournal from "./components/WriteJournal";
import Home from "./components/Home"; // ✅ import Home

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Main Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/write" element={<WriteJournal />} />
      <Route path="/entries" element={<JournalList />} />
      <Route path="/chat" element={<AIChat />} />
    </Routes>
  );
}

export default App;
