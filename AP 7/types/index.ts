import { PAFTContext } from './paft';
import { UploadedFile } from './multimodal';
import { UrlContent } from './url';

export * from './paft';
export * from './multimodal';
export * from './session';
export * from './settings';
export * from './url';

export type Theme = 'light' | 'dark';

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ResponseItem {
    id: string;
    prompt: string;
    targetAI: string;
    files: UploadedFile[];
    urlContent: UrlContent | null;
    response: string;
    confidenceScore: number | null;
    paftContext: PAFTContext;
    sources?: GroundingSource[] | null;
}

export type WorkflowStep = 'objectiveInput' | 'paftSelection' | 'refinementLoop';

export interface PAFTSuggestions {
    persona: string[];
    audience: string[];
    format: string[];
    tone: string[];
}

export interface AppState {
  isLoading: boolean; // For blueprint generation
  isLoadingSuggestions: boolean;
  error: string | null;
  currentStep: WorkflowStep;
  paftSuggestions: PAFTSuggestions | null;
  generatePaftSuggestions: (objective: string, targetAI: string, files: UploadedFile[], urlContent: UrlContent | null) => Promise<void>;
  generateBlueprint: (prompt: string, files: UploadedFile[], urlContent: UrlContent | null) => Promise<void>;
  setError: (error: string | null) => void;
  resetWorkflow: () => void;
}