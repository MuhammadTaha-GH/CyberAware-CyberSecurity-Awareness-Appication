
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion, Flashcard } from "../types";

const SYSTEM_PROMPT = `You are a specialized Cybersecurity Awareness Chatbot named 'CyberAware'. 
Your primary goal is to educate users on cybersecurity topics and answer security-related queries.
RULES:
1. ONLY answer queries related to cybersecurity, online safety, privacy, networking, or threat intelligence.
2. If a user asks something unrelated to cybersecurity (e.g., cooking, sports, general math), politely decline and state that you are specialized only in cybersecurity awareness.
3. Keep answers concise, actionable, and professional.
4. Use formatting like bullet points for clarity.`;

export const getGeminiChatResponse = async (history: ChatMessage[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with the security brain. Please try again later.";
  }
};

export const generateQuiz = async (category: string): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 multiple-choice questions for a cybersecurity awareness quiz about: ${category}. 
      Make them challenging but educational.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Four multiple choice options"
              },
              correctIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
              explanation: { type: Type.STRING, description: "Educational explanation of why the answer is correct" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return [];
  }
};

export const generateFlashcards = async (category: string): Promise<Flashcard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 informative flashcards for cybersecurity awareness about: ${category}. 
      The front should be a term or question, and the back should be a concise definition or answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ["front", "back"]
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Flashcard Generation Error:", error);
    return [];
  }
};
