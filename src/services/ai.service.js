const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateContent(prompt) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return result.text;
}

module.exports = { generateContent };
