// src/utils/aiAnalyzer.js

export async function analyzeJournal(journalText) {
  const apiKey = process.env.REACT_APP_OPENROUTER_APIKEY;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an emotional wellness assistant. When a user writes their journal, your job is to summarize it briefly, identify the mood or issue, and give helpful advice or comfort.",
          },
          {
            role: "user",
            content: journalText,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("AI Response:", data);

    return data.choices?.[0]?.message?.content || "⚠️ No response from AI";
  } catch (error) {
    console.error("AI Error:", error);
    return "⚠️ AI failed to respond. Try again later.";
  }
}
