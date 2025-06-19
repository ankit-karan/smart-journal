import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function JournalEntryForm({ onEntryAdded }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("😊");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("❌ You must be logged in to save entries.");
        return;
      }

      const userId = user.uid;

      // Save to Firestore inside a shared 'entries' collection with userId included
      await addDoc(collection(db, "entries"), {
        userId: userId,
        text: text,
        mood: mood,
        timestamp: serverTimestamp(),
      });

      setText("");
      setMood("😊");

      if (onEntryAdded) onEntryAdded();
      alert("✅ Entry saved successfully!");
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("❌ Failed to save entry. Please check your Firebase rules.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-4">
      <textarea
        className="w-full border p-2 rounded text-black"
        placeholder="How was your day?"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border rounded p-2 text-black"
        >
          <option>😊</option>
          <option>😔</option>
          <option>😠</option>
          <option>😃</option>
          <option>😢</option>
        </select>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
}

export default JournalEntryForm;
