import { GoogleGenAI, Type, Content } from '@google/genai';
import { Strategy } from '../types';

// --- HARDCODED API KEY ---
// This approach is suitable for personal, single-user applications where the code is not publicly exposed.
//
// --- SECURITY PRECAUTIONS ---
// If you ever expose this application on the web, you MUST take these steps to protect your key:
// 1.  **Restrict the API Key:** In your Google Cloud Console, restrict this API key to be used only from your specific web domain(s).
//     This is the most critical step to prevent unauthorized use from other websites.
// 2.  **Monitor Usage:** Regularly check your API usage in the Google Cloud Console to detect any unexpected activity.
// 3.  **Regenerate Key if Compromised:** If you suspect your key has been compromised, delete it and generate a new one immediately.
const HARDCODED_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
// -------------------------

if (HARDCODED_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.error("Gemini API Key is not set. Please replace the placeholder in services/geminiService.ts");
}

// Memoized client instance to avoid re-creating it on every call.
let clientInstance: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!clientInstance) {
    clientInstance = new GoogleGenAI({ apiKey: HARDCODED_API_KEY });
  }
  return clientInstance;
}

const strategySchema = {
    type: Type.OBJECT,
    properties: {
        persona: { type: Type.STRING },
        audience: { type: Type.STRING },
        format: { type: Type.STRING },
        tone: { type: Type.STRING },
    },
    required: ['persona', 'audience', 'format', 'tone'],
};

/**
 * Generates the 4-pillar strategy using a structured JSON response.
 */
export async function generateStrategy(objective: string): Promise<Strategy> {
    const ai = getClient();
    const systemInstruction: Content = {
        role: "user",
        parts: [
          { text: `Analyze the user's objective to create a 4-pillar prompt strategy. The objective is: "${objective}"` },
        ],
    };

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [systemInstruction],
            config: {
                responseMimeType: "application/json",
                responseSchema: strategySchema,
            }
        });

        return JSON.parse(result.text) as Strategy;

    } catch (error) {
        console.error("Error generating strategy:", error);
        if (error instanceof Error && error.message.toLowerCase().includes('api key')) {
            throw new Error("Your API key is not valid. Please check the key in services/geminiService.ts.");
        }
        throw new Error("Could not generate a strategy from the AI.");
    }
}


/**
 * Generates the final blueprint as a stream of text for a real-time typing effect.
 */
export async function* generateBlueprintStream(objective: string, strategy: Strategy): AsyncGenerator<string> {
    const ai = getClient();
    const systemInstruction: Content = {
        role: "user",
        parts: [
            { text: `You are a world-class prompt engineering assistant. Your task is to synthesize the user's objective and a 4-pillar strategy into a final, detailed, and effective prompt "blueprint". The final output should be a well-structured, clear, and actionable prompt that the user can copy and paste.

User Objective: "${objective}"

4-Pillar Strategy:
- Persona: ${strategy.persona}
- Audience: ${strategy.audience}
- Format: ${strategy.format}
- Tone: ${strategy.tone}

Synthesize these elements into a complete prompt blueprint. Ensure the output is formatted with Markdown for clarity.`}
        ]
    };

    try {
        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: [systemInstruction]
        });

        for await (const chunk of stream) {
            yield chunk.text;
        }

    } catch (error) {
        console.error("Error generating blueprint:", error);
        if (error instanceof Error && error.message.toLowerCase().includes('api key')) {
            throw new Error("Your API key is not valid. Please check the key in services/geminiService.ts.");
        }
        throw new Error("Could not generate a blueprint from the AI.");
    }
}
