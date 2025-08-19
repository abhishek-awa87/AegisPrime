import { GoogleGenAI, Type, Part } from "@google/genai";
import { Strategy, Blueprint, StrategyPillarKey, StrategyPillar, FileAttachment } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const strategyPillarSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise, catchy title for this pillar (e.g., 'The Seasoned Mentor')." },
        description: { type: Type.STRING, description: "A detailed explanation of this pillar and its rationale." },
    },
    required: ["title", "description"],
};

const strategySchema = {
    type: Type.OBJECT,
    properties: {
        persona: { ...strategyPillarSchema, description: "The AI's persona." },
        audience: { ...strategyPillarSchema, description: "The target audience for the output." },
        format: { ...strategyPillarSchema, description: "The structure and format of the output." },
        tone: { ...strategyPillarSchema, description: "The tone and style of the output." },
    },
    required: ["persona", "audience", "format", "tone"],
};

function buildContent(prompt: string, file?: FileAttachment | null): Part[] {
    const parts: Part[] = [{ text: prompt }];
    if (file) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType,
                data: file.data,
            },
        });
    }
    return parts;
}

export async function generateStrategy(objective: string, file?: FileAttachment | null): Promise<Strategy> {
    const prompt = `
        You are Aegis Prime, a proactive AI co-pilot for prompt engineering.
        Your Director has provided a high-level objective${file ? ' and an attached image' : ''}.
        Your task is to generate a complete, multi-part strategy proposal (Persona, Audience, Format, Tone) to create a hyper-optimized prompt for this objective.
        For each part of the strategy, provide a title and a detailed description.

        Director's Objective: "${objective}"
    `;

    const contents = buildContent(prompt, file);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents },
        config: {
            responseMimeType: "application/json",
            responseSchema: strategySchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Strategy;
}

export async function refineStrategyPillar(
    objective: string,
    currentStrategy: Strategy,
    pillarToRefine: StrategyPillarKey,
    file?: FileAttachment | null
): Promise<StrategyPillar> {
    const prompt = `
        You are Aegis Prime, a proactive AI co-pilot for prompt engineering.
        We are refining the strategy for the objective: "${objective}"${file ? ' (an image was also provided for context)' : ''}.
        The current strategy is:
        - Persona: ${currentStrategy.persona.title}
        - Audience: ${currentStrategy.audience.title}
        - Format: ${currentStrategy.format.title}
        - Tone: ${currentStrategy.tone.title}
        
        Please generate one new, distinct alternative for the "${pillarToRefine}" pillar. Provide a new title and description for it.
    `;
    
    const contents = buildContent(prompt, file);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents },
        config: {
            responseMimeType: "application/json",
            responseSchema: strategyPillarSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as StrategyPillar;
}

const blueprintSchema = {
    type: Type.OBJECT,
    properties: {
        prompt: { type: Type.STRING, description: "The final, complete, hyper-optimized prompt, ready to be copied and used." },
        analysis: { type: Type.STRING, description: "A brief analysis of why this prompt is effective, referencing the strategy pillars." },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 suggestions for how the Director can use or adapt this prompt."
        },
    },
    required: ["prompt", "analysis", "suggestions"],
};

export async function generateBlueprint(strategy: Strategy, objective: string, refinementFeedback?: string, file?: FileAttachment | null): Promise<Blueprint> {
    let prompt = `
        You are Aegis Prime, a prompt architect.
        Your task is to generate a detailed "AEGIS BLUEPRINT" based on the confirmed strategy for the Director's objective.
        The blueprint must contain the final prompt draft, an analysis of its construction, and suggestions for use.

        Director's Objective: "${objective}" ${file ? '(Note: An image was provided with the initial objective. Your final prompt should account for this, instructing the end user to provide an image alongside the prompt text if applicable.)' : ''}

        Confirmed Strategy:
        - Persona: ${strategy.persona.title} - ${strategy.persona.description}
        - Audience: ${strategy.audience.title} - ${strategy.audience.description}
        - Format: ${strategy.format.title} - ${strategy.format.description}
        - Tone: ${strategy.tone.title} - ${strategy.tone.description}
    `;

    if (refinementFeedback) {
        prompt += `\n\nPlease incorporate the following refinement feedback from the Director into the new blueprint:\n"${refinementFeedback}"`;
    }

    const contents = buildContent(prompt, file);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents },
        config: {
            responseMimeType: "application/json",
            responseSchema: blueprintSchema,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Blueprint;
}