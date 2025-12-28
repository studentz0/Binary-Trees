
import { GoogleGenAI } from "@google/genai";

/**
 * Secure Gemini Content Generation Service.
 * Note: The API Key is obtained exclusively from process.env.API_KEY.
 */
export const generateContent = async (prompt: string, isJson: boolean = false) => {
  // Use the injected API key. If it's missing, the SDK will throw an error we can catch.
  const apiKey = process.env.API_KEY || "";
  
  // Initialize a fresh instance for the request as per guidelines
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: isJson ? { 
        responseMimeType: "application/json"
      } : undefined
    });

    if (!response.text) {
      throw new Error("The AI model returned an empty response.");
    }

    return response.text;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    
    // Check for specific error types to provide better feedback
    if (error.message?.includes("API_KEY") || error.status === 401) {
      throw new Error("API configuration is missing or invalid.");
    }
    
    throw new Error(error.message || "Unable to communicate with the AI service.");
  }
};
