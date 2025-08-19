import { GoogleGenAI, Type, Content, Part } from "@google/genai";
import { PAFTContext, ResponseItem, UploadedFile, UrlContent, AudioFile, VideoFile, PDFFile, PAFTSuggestions, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const paftSuggestionsSchema = {
    type: Type.OBJECT,
    properties: {
        persona: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 creative and diverse persona suggestions (e.g., 'Socratic Tutor', 'Technical Architect', 'Cautious Skeptic')." },
        audience: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 specific audience suggestions (e.g., 'Domain Experts', 'Newcomers', 'Executive Stakeholders')." },
        format: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 effective format suggestions (e.g., 'Technical Document', 'FAQ', 'Comparative Analysis')." },
        tone: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 distinct tone suggestions (e.g., 'Analytical', 'Inspirational', 'Objective and Neutral')." },
    },
    required: ["persona", "audience", "format", "tone"],
};


const getFileContextText = (file: UploadedFile): string => {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    let meta = '';
    let analysisSummary = '';

    if ('duration' in file) {
        meta = `, duration: ${Math.round(file.duration)}s`;
        if ((file as AudioFile | VideoFile).analysis) {
            analysisSummary = `\n[Analysis Summary: ${(file as AudioFile | VideoFile).analysis!.summary}]`;
        }
    }
    if ('pageCount' in file) {
        meta = `, pages: ${file.pageCount}`;
        if ((file as PDFFile).analysis) {
            analysisSummary = `\n[Analysis Summary: ${(file as PDFFile).analysis!.summary}]`;
        }
    }
    return `--- Attached file: ${file.name} (${file.mimeType}, ${sizeMB}MB${meta}) ---${analysisSummary}`;
};

const buildHistory = (history: ResponseItem[]): Content[] => {
    return history.flatMap(item => {
        const userParts: Part[] = [];
        
        let textContext = '';
        if (item.urlContent) {
            textContext += `\n--- URL CONTEXT ---\nTitle: ${item.urlContent.title}\nSource: ${item.urlContent.source.name}\nSummary: ${item.urlContent.summary}\n-------------------\n`;
        }
        if (item.files && item.files.length > 0) {
            textContext += item.files.map(getFileContextText).join('\n') + '\n\n';
        }
        if (item.prompt) {
            textContext += `User Prompt: ${item.prompt}`;
        }
        if (item.targetAI) {
            textContext += `\nTarget AI & Instructions: ${item.targetAI}`;
        }

        if (textContext.trim()) {
            userParts.push({ text: textContext.trim() });
        }
        
        if (item.files && item.files.length > 0) {
            item.files.forEach(file => {
                userParts.push({
                    inlineData: { mimeType: file.mimeType, data: file.data }
                });
            });
        }
        
        if (userParts.length === 0) {
            return [];
        }

        const modelResponseText = item.response;

        return [
            { role: 'user', parts: userParts },
            { role: 'model', parts: [{ text: modelResponseText }] }
        ];
    });
};

export const generatePaftSuggestions = async (
    objective: string,
    targetAI: string,
    files: UploadedFile[],
    urlContent: UrlContent | null
): Promise<PAFTSuggestions> => {
    const systemInstruction = `You are an expert prompt engineering assistant. Your task is to analyze the user's core objective, their target AI instructions, and any provided context (files, URL content) and generate tailored suggestions for a Persona, Audience, Format, and Tone (PAFT). These suggestions will help the user craft a more effective final prompt. Provide exactly 4 diverse and creative options for each category.`;

    const userParts: Part[] = [];
    let userTextContext = '';

    if (urlContent) {
        userTextContext += `--- URL CONTEXT ---\nTitle: ${urlContent.title}\nSummary: ${urlContent.summary}\n-------------------\n`;
    }
    if (files.length > 0) {
        userTextContext += files.map(getFileContextText).join('\n') + '\n\n';
    }
    userTextContext += `Based on the context above, analyze the following user request and generate PAFT suggestions.\n\n--- CORE OBJECTIVE ---\n${objective}\n\n--- TARGET AI & INSTRUCTIONS ---\n${targetAI}`;

    userParts.push({ text: userTextContext.trim() });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: userParts }],
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: paftSuggestionsSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        if (Array.isArray(parsedResponse.persona) && Array.isArray(parsedResponse.audience) && Array.isArray(parsedResponse.format) && Array.isArray(parsedResponse.tone)) {
            return parsedResponse;
        } else {
            throw new Error("Invalid JSON structure for PAFT suggestions received from API.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for PAFT suggestions:", error);
        throw new Error("Failed to get valid PAFT suggestions from the AI.");
    }
};

export const getGenerativeResponse = async (
    prompt: string, 
    files: UploadedFile[],
    urlContent: UrlContent | null,
    history: ResponseItem[],
    paftContext: Omit<PAFTContext, 'audience'> & { audience: string[] },
    targetAI: string,
): Promise<{ responseText: string; confidenceScore: number | null, sources: GroundingSource[] | null }> => {
    
    const systemInstruction = `
You are an AI assistant.
Your persona is: ${paftContext.persona}.
You are writing for: ${paftContext.audience.join(', ')}.
The desired format is: ${paftContext.format}.
The tone should be: ${paftContext.tone}.
Follow these additional user-provided instructions for the AI model: ${targetAI}.
Your responses should be well-researched and grounded in information from Google Search.
Please provide a detailed response to the user's prompt (which may include text, media, and URL content).
    `.trim();

    const historicalContents = buildHistory(history);
    
    const currentUserParts: Part[] = [];
    let currentUserTextContext = '';

    if (urlContent) {
        currentUserTextContext += `
--- URL CONTEXT ---
Title: ${urlContent.title}
Source: ${urlContent.source.name}
Summary: ${urlContent.summary}
-------------------
Based on the context from the URL above, please answer the following prompt.\n`;
    }

    if (files.length > 0) {
        currentUserTextContext += files.map(getFileContextText).join('\n') + '\n\n';
    }

    if (prompt) {
        currentUserTextContext += `User Prompt: ${prompt}`;
    }

    if (currentUserTextContext.trim()) {
        currentUserParts.push({ text: currentUserTextContext.trim() });
    }

    files.forEach(file => {
        currentUserParts.push({
            inlineData: { mimeType: file.mimeType, data: file.data }
        });
    });

    const contents: Content[] = [
        ...historicalContents,
        { role: 'user', parts: currentUserParts }
    ];
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
                temperature: 0.7,
            },
        });

        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources = groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web && !!web.uri) ?? null;

        return {
            responseText: response.text,
            confidenceScore: null,
            sources: sources,
        };
    } catch (error) {
        console.error("Error calling Gemini API with Google Search:", error);
        throw new Error("Failed to get a grounded response from the AI. The model may have returned an unexpected format.");
    }
};
