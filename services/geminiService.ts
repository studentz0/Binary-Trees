
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

  // CRITICAL: Initialize a fresh instance for each request right before making the call.
  // This ensures it uses the most up-to-date API key from potential external dialogs.
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Using gemini-3-pro-preview for complex tasks like quiz generation and code logic implementation.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: isJson ? { 
        responseMimeType: "application/json"
      } : undefined
    });

    // Directly access the .text property (not a method call) to extract generated content.
    if (!response.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return response.text;
  } catch (error: any) {
    // Handle cases where the API key is invalid or requires reset, allowing the UI to trigger openSelectKey().
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("MISSING_KEY");
    }
    console.error("AI Service Error:", error.message || "Unknown error");
    throw new Error(error.message || "Unable to communicate with the AI service.");
  }
};
