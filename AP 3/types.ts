export enum AppState {
    AWAITING_OBJECTIVE,
    GENERATING_STRATEGY,
    STRATEGY_PROPOSAL,
    REFINING_STRATEGY_PILLAR,
    GENERATING_BLUEPRINT,
    BLUEPRINT_PROPOSAL,
    REFINING_BLUEPRINT,
    FINALIZED,
    ERROR,
}

export interface StrategyPillar {
    title: string;
    description: string;
}

export interface Strategy {
    persona: StrategyPillar;
    audience: StrategyPillar;
    format: StrategyPillar;
    tone: StrategyPillar;
}

export type StrategyPillarKey = keyof Strategy;

export interface Blueprint {
    prompt: string;
    analysis: string;
    suggestions: string[];
}

export interface FileAttachment {
    name: string;
    mimeType: string;
    data: string; // base64 encoded string
}