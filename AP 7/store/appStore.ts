import { create } from 'zustand';
import { AppState, UploadedFile, UrlContent, ResponseItem } from '../types';
import { generatePaftSuggestions as fetchPaftSuggestions, getGenerativeResponse } from '../services/geminiService';
import { useSessionStore } from './sessionStore';

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: false, // for blueprint generation
  isLoadingSuggestions: false,
  error: null,
  currentStep: 'objectiveInput',
  paftSuggestions: null,
  
  setError: (error: string | null) => set({ error }),

  generatePaftSuggestions: async (objective: string, targetAI: string, files: UploadedFile[], urlContent: UrlContent | null) => {
    if (get().isLoadingSuggestions) return;
    if (!objective.trim() && files.length === 0 && !urlContent) {
        set({ error: "Please enter an objective or provide context." });
        return;
    }
    set({ isLoadingSuggestions: true, error: null });
    try {
      const suggestions = await fetchPaftSuggestions(objective, targetAI, files, urlContent);
      set({ paftSuggestions: suggestions, currentStep: 'paftSelection' });
      
      // Pre-select the first suggestion for each category
      const { setPersona, setFormat, setTone, toggleAudience, audience } = useSessionStore.getState();
      setPersona(suggestions.persona[0] || 'Expert Advisor');
      setFormat(suggestions.format[0] || 'Bullet Points');
      setTone(suggestions.tone[0] || 'Friendly');
      
      // Clear existing audience and set the new one
      [...audience].forEach(aud => toggleAudience(aud));
      toggleAudience(suggestions.audience[0] || 'General Public');

    } catch (error) {
      console.error('Gemini API Error (Suggestions):', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching PAFT suggestions.';
      set({ error: errorMessage });
    } finally {
      set({ isLoadingSuggestions: false });
    }
  },

  generateBlueprint: async (prompt: string, files: UploadedFile[], urlContent: UrlContent | null) => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null, currentStep: 'refinementLoop' });
    
    const { history, targetAI, ...paftContext } = useSessionStore.getState();

    try {
      const result = await getGenerativeResponse(prompt, files, urlContent, history, paftContext, targetAI);
      
      const newResponseItem: ResponseItem = {
        id: new Date().toISOString(),
        prompt,
        files,
        urlContent,
        response: result.responseText,
        confidenceScore: result.confidenceScore,
        sources: result.sources,
        targetAI: targetAI,
        paftContext: {
            persona: paftContext.persona,
            audience: paftContext.audience,
            format: paftContext.format,
            tone: paftContext.tone,
        },
      };

      useSessionStore.getState().setResponse(newResponseItem);

    } catch (error) {
      console.error('Gemini API Error (Blueprint):', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching the response.';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  resetWorkflow: () => {
    useSessionStore.getState().clearSession();
    set({
      currentStep: 'objectiveInput',
      error: null,
      paftSuggestions: null,
      isLoading: false,
      isLoadingSuggestions: false,
    });
  },
}));