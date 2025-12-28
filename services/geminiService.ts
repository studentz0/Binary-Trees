import { GoogleGenAI } from "@google/genai";

// API Key is obtained directly from process.env.API_KEY as per guidelines.
// Always use a new GoogleGenAI instance right before the call to ensure the latest configuration.
export const generateContent = async (prompt: string, isJson: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: isJson ? { responseMimeType: "application/json" } : undefined
    });

    // Directly access the .text property from GenerateContentResponse.
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};