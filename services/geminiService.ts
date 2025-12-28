
import { GoogleGenAI } from "@google/genai";

/**
 * Secure Gemini Content Generation Service.
 * Interfaces with window.aistudio for key management in supported environments.
 */
export const generateContent = async (prompt: string, isJson: boolean = false) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("MISSING_KEY");
  }

  // Fix: Initialize a fresh instance for each request to ensure it uses the latest API key
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // Fix: Use simple string for text contents as per guidelines
      contents: prompt,
      config: isJson ? { 
        responseMimeType: "application/json"
      } : undefined
    });

    if (!response.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return response.text;
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("MISSING_KEY");
    }
    console.error("AI Service Error:", error.message || "Unknown error");
    throw new Error(error.message || "Unable to communicate with the AI service.");
  }
};
