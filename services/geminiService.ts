import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle Gemini API calls for code generation and quiz questions.
 * Adheres to the latest SDK guidelines.
 */
export const generateContent = async (prompt: string, isJson: boolean = false) => {
  // Always initialize a new instance before making an API call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: isJson ? { 
        responseMimeType: "application/json"
      } : undefined
    });

    // Access the .text property directly as per the coding guidelines.
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};