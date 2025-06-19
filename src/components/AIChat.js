import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

function AIChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const journalText = location.state?.journalText || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔁 Load chat sessions for the user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "ai_chats", user.uid, "sessions"),
      orderBy("created", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const firstMsg = data.messages?.find((m) => m.role === "user")?.content?.slice(0, 30);
        return {
          id: doc.id,
          label: firstMsg || "New Chat",
          created: data.created?.toDate()?.toLocaleString() || "Unknown",
        };
      });
      setSessions(sessionList);
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Load initial chat
  useEffect(() => {
    const loadInitial = async () => {
      const user = auth.currentUser;
      if (!user) return;

      if (journalText) {
        const starter = {
          role: "user",
          content: `Here is my journal entry: "${journalText}". Please analyze it and help me understand my emotions.`,
        };
        const docRef = await addDoc(collection(db, "ai_chats", user.uid, "sessions"), {
          messages: [starter],
          created: serverTimestamp(),
        });
        setCurrentSessionId(docRef.id);
        sendToAI([starter], user.uid, docRef.id);
      }
    };

    loadInitial();
  }, [journalText]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const user = auth.currentUser;
    if (!user || !currentSessionId) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    await sendToAI(newMessages, user.uid, currentSessionId);
  };

  const sendToAI = async (chatHistory, userId, sessionId) => {
    setLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_APIKEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: chatHistory,
        }),
      });

      const data = await res.json();
      const reply = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "⚠️ No response.",
      };

      const updatedMessages = [...chatHistory, reply];
      setMessages(updatedMessages);

      await setDoc(doc(db, "ai_chats", userId, "sessions", sessionId), {
        messages: updatedMessages,
        created: serverTimestamp(),
      });
    } catch (err) {
      console.error("AI Error:", err);
      const errorReply = {
        role: "assistant",
        content: "⚠️ Error fetching response from AI.",
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "ai_chats", user.uid, "sessions", sessionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMessages(docSnap.data().messages || []);
      setCurrentSessionId(sessionId);
    }
  };

  const deleteSession = async (sessionId) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "ai_chats", user.uid, "sessions", sessionId));
    if (sessionId === currentSessionId) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  const startNewChat = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const starter = {
      role: "assistant",
      content: "Hi! How can I help you today?",
    };

    const docRef = await addDoc(collection(db, "ai_chats", user.uid, "sessions"), {
      messages: [starter],
      created: serverTimestamp(),
    });

    setMessages([starter]);
    setCurrentSessionId(docRef.id);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-50 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">💬 Chats</h2>
        <button
          onClick={startNewChat}
          className="w-full bg-indigo-600 text-white px-3 py-2 mb-4 rounded hover:bg-indigo-700"
        >
          ➕ New Chat
        </button>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => loadSession(s.id)}
              className={`cursor-pointer p-2 rounded hover:bg-indigo-100 ${
                currentSessionId === s.id ? "bg-indigo-100 border border-indigo-300" : ""
              }`}
            >
              <div className="text-sm font-medium truncate">{s.label}</div>
              <div className="text-xs text-gray-500">{s.created}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(s.id);
                }}
                className="text-red-400 text-xs hover:text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6 bg-white">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          {currentSessionId ? "🧠 AI Assistant" : "Start a conversation"}
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 border rounded p-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">Start a conversation to explore your thoughts 💬</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))
          )}
          {loading && <p className="text-gray-500 italic">AI is thinking...</p>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChat;
