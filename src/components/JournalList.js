import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { analyzeJournal } from "../utils/aiAnalyzer";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import jsPDF from "jspdf";
import "jspdf-autotable"; // ✅ Required for table export

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editText, setEditText] = useState("");
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeFirestore = null;
    let unsubscribeAuth = null;

    const startListeningToEntries = (user) => {
      const q = query(
        collection(db, "entries"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(data);
        setLoading(false);
      });
    };

    if (auth.currentUser) {
      startListeningToEntries(auth.currentUser);
    } else {
      unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (user) {
          startListeningToEntries(user);
        } else {
          setEntries([]);
          setLoading(false);
        }
      });
    }

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const deleteEntry = async (entryId) => {
    await deleteDoc(doc(db, "entries", entryId));
  };

  const startEditing = (entry) => {
    setEditingEntry(entry);
    setEditText(entry.text || "");
  };

  const saveEdit = async () => {
    if (!editingEntry) return;
    const entryRef = doc(db, "entries", editingEntry.id);
    await updateDoc(entryRef, { text: editText });
    setEditingEntry(null);
  };

  const exportToPDF = () => {
    const moodMap = {
      "😊": "Happy",
      "😔": "Sad",
      "😠": "Angry",
      "😃": "Excited",
      "😢": "Crying",
    };

    const docPDF = new jsPDF();
    docPDF.setFontSize(18);
    docPDF.text("📘 Smart Journal - Your Entries", 14, 15);
    docPDF.setFontSize(12);
    docPDF.setTextColor(100);

    const tableRows = entries.map((entry, i) => [
      i + 1,
      entry.timestamp?.toDate().toLocaleString() || "No Date",
      moodMap[entry.mood] || entry.mood || "Neutral",
      entry.text?.length > 100 ? entry.text.slice(0, 100) + "..." : entry.text,
    ]);

    docPDF.autoTable({
      startY: 25,
      head: [["#", "Date & Time", "Mood", "Entry Summary"]],
      body: tableRows,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    docPDF.save("SmartJournal_Entries.pdf");
  };

  const handleAnalyze = async (entry) => {
    setAnalyzingId(entry.id);
    try {
      const result = await analyzeJournal(entry.text);
      setAnalysisResults((prev) => ({ ...prev, [entry.id]: result }));
    } catch (err) {
      setAnalysisResults((prev) => ({
        ...prev,
        [entry.id]: "⚠️ Analysis failed. Try again.",
      }));
    } finally {
      setAnalyzingId(null);
    }
  };

  const navigateToChat = (text) => {
    navigate("/chat", { state: { journalText: text } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6 flex justify-center items-start">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl text-gray-800 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-700 flex items-center gap-2">
            📝 Your Past Entries
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded text-gray-700"
            >
              ⬅ Back
            </button>
            <button
              onClick={exportToPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              📄 Export to PDF
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 italic text-center">
            ⏳ Fetching your journals...
          </p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No entries found. Start writing your thoughts!
          </p>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-50 rounded-lg p-4 shadow-sm border-l-4 border-purple-400"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">
                    {entry.timestamp?.toDate().toLocaleString() || "No Date"}
                  </span>
                  <span className="text-lg">{entry.mood}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{entry.text}</p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    onClick={() => startEditing(entry)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => handleAnalyze(entry)}
                    className="text-indigo-600 hover:underline"
                    disabled={analyzingId === entry.id}
                  >
                    {analyzingId === entry.id ? "Analyzing..." : "🧠 Analyze"}
                  </button>
                </div>

                {analysisResults[entry.id] && (
                  <div className="mt-3 p-3 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-900 rounded">
                    <strong>AI Insight:</strong> {analysisResults[entry.id]}
                    <div className="mt-2">
                      <button
                        onClick={() => navigateToChat(entry.text)}
                        className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        💬 Continue with AI Assistant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editingEntry && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-gray-800">
              <h3 className="text-lg font-semibold mb-4">Edit Entry</h3>
              <textarea
                className="w-full mb-4 px-3 py-2 border rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows="4"
                placeholder="Edit your entry"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalList;
