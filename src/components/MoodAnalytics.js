import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MOOD_COLORS = {
  "😊": "#4ade80", // Green
  "😔": "#facc15", // Yellow
  "😠": "#f87171", // Red
  "😃": "#60a5fa", // Blue
  "😢": "#a78bfa", // Purple
};

const MoodAnalytics = () => {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const fetchMoodData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "entries"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const moodCount = {};
      querySnapshot.forEach((doc) => {
        const { mood } = doc.data();
        moodCount[mood] = (moodCount[mood] || 0) + 1;
      });

      const formattedData = Object.entries(moodCount).map(([mood, count]) => ({
        name: mood,
        value: count,
      }));

      setMoodData(formattedData);
    };

    fetchMoodData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-xl mx-auto my-8">
      <h2 className="text-2xl font-semibold text-center mb-4 text-indigo-600">Mood Analytics</h2>
      {moodData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={moodData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {moodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || "#8884d8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No mood data available.</p>
      )}
    </div>
  );
};

export default MoodAnalytics;
