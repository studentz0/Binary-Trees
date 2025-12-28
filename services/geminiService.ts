import { GoogleGenAI } from "@google/genai";

/**
 * Secure Gemini Content Generation Service.
 * Note: For security, the API Key is never hardcoded. 
 * It is sourced from process.env.API_KEY which is managed via environment variables.
 */
export const generateContent = async (prompt: string, isJson: boolean = false) => {
  // Ensure the environment variable is available
  if (!process.env.API_KEY) {
    throw new Error("API configuration is missing. Please set the API_KEY environment variable.");
  }

  // Initialize a fresh instance for the request
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: isJson ? { 
        responseMimeType: "application/json"
      } : undefined
    });

    // Check for safety filters or empty responses
    if (!response.text) {
      throw new Error("The AI model returned an empty response. This may be due to safety filters.");
    }

    return response.text;
  } catch (error: any) {
    // Log generic error for security, avoiding leaking sensitive stack traces to the user
    console.error("AI Service Error:", error.message || "Unknown error");
    throw new Error("Unable to communicate with the AI service. Please try again later.");
  }
};