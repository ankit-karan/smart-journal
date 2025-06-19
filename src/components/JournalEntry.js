// src/components/JournalEntry.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function JournalEntry() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("😊");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "journalEntries"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    return onSnapshot(q, (snap) => {
      setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;
    try {
      if (editId) {
        await updateDoc(doc(db, "journalEntries", editId), {
          content: entry,
          mood,
        });
        setEditId(null);
        setMessage("Entry edited ✅");
      } else {
        await addDoc(collection(db, "journalEntries"), {
          userId: auth.currentUser.uid,
          content: entry,
          mood,
          timestamp: serverTimestamp(),
        });
        setMessage("New entry saved ✅");
      }
      setEntry("");
    } catch (err) {
      setMessage("❌ Save failed: " + err.message);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEntry(item.content);
    setMood(item.mood || "😊");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await deleteDoc(doc(db, "journalEntries", id));
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-2">
        {editId ? "Edit Entry" : "New Entry"}
      </h2>
      <form onSubmit={handleSave}>
        <div className="mb-2">
          <label>Mood: </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="border p-1 rounded"
          >
            <option>😊</option>
            <option>😔</option>
            <option>😡</option>
            <option>😢</option>
            <option>😌</option>
          </select>
        </div>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows="4"
          className="w-full border p-2 rounded mb-2"
          placeholder="Write your thoughts..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Save Changes" : "Save Entry"}
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </form>

      <h3 className="text-lg font-semibold mb-2 mt-6">Your Entries</h3>
      {entries.map((item) => (
        <div
          key={item.id}
          className="border p-4 rounded mb-2 bg-gray-50 relative"
        >
          <span role="img" aria-label="mood">
            {item.mood}
          </span>{" "}
          <span>{item.content}</span>
          <div className="text-xs italic mt-1">
            {item.timestamp?.toDate().toLocaleString()}
          </div>
          <div className="absolute top-2 right-2 space-x-2">
            <button
              onClick={() => startEdit(item)}
              className="text-blue-500"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JournalEntry;
