// src/components/Sidebar.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "ai_chats"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(data);
    });

    return () => unsubscribe();
  }, []);

  const handleNewChat = () => {
    navigate("/chat"); // navigate to a fresh chat page
  };

  const openChat = (chatId) => {
    navigate(`/chat?id=${chatId}`);
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 flex flex-col border-r border-gray-700">
      <h2 className="text-xl font-bold mb-4">💬 AI Chats</h2>

      <button
        onClick={handleNewChat}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded mb-6"
      >
        ➕ New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.length === 0 && <p className="text-gray-400 text-sm">No chats yet</p>}
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => openChat(chat.id)}
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded"
          >
            <p className="truncate">{chat.title || "Untitled Chat"}</p>
            <p className="text-xs text-gray-400">
              {chat.createdAt?.toDate().toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
