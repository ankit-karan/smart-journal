import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JournalEntryForm from "./JournalEntryForm";

const WriteJournal = () => {
  const navigate = useNavigate();
  const [entrySaved, setEntrySaved] = useState(false);

  const handleEntryAdded = () => {
    setEntrySaved(true); // ✅ Just mark it saved
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl text-gray-800 transition-all duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            📔 Write a New Journal
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded"
          >
            ⬅ Back
          </button>
        </div>

        {/* Journal Entry Form */}
        <JournalEntryForm onEntryAdded={handleEntryAdded} />

        {/* Save confirmation and actions */}
        {entrySaved && (
          <div className="mt-6 space-y-3 border-t pt-4">
            <p className="text-green-600 font-semibold text-center">
              ✅ Your journal was saved!
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/entries")}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                📚 View Past Entries
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteJournal;
