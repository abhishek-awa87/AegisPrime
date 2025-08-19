import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateStrategy, generateBlueprintStream } from '../services/geminiService';
import { AegisState, Strategy } from '../types';
import { useNotificationStore } from './notificationStore';

interface AegisStateStore {
  state: AegisState;
  objective: string;
  strategy: Strategy | null;
  blueprint: string;
  error: string | null;
  generateStrategy: (objective: string) => Promise<void>;
  generateBlueprint: () => Promise<void>;
  startWithExample: (objective: string) => void;
  reset: () => void;
  clearError: () => void;
}

const initialStrategy: Strategy = {
    persona: '',
    audience: '',
    format: '',
    tone: '',
};

const announce = useNotificationStore.getState().addNotification;

export const useAegisStore = create<AegisStateStore>()(
  persist(
    (set, get) => ({
      state: 'idle',
      objective: '',
      strategy: null,
      blueprint: '',
      error: null,
      
      generateStrategy: async (objective) => {
        if (get().state === 'generating_strategy') return;

        set({ 
            state: 'generating_strategy', 
            objective, 
            error: null, 
            strategy: initialStrategy,
            blueprint: '' 
        });
        announce("Generating strategy.");

        try {
          const finalStrategy = await generateStrategy(objective);
          set({ strategy: finalStrategy, state: 'strategy_generated' });
          announce("Strategy successfully generated.");
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            set({ state: 'idle', error: `Failed to generate strategy: ${errorMessage}` });
            announce(`Error: ${errorMessage}`);
        }
      },

      generateBlueprint: async () => {
        const { objective, strategy } = get();
        if (!objective || !strategy || get().state === 'generating_blueprint') return;

        set({ state: 'generating_blueprint', error: null, blueprint: '' });
        announce("Generating blueprint.");

        try {
            const stream = generateBlueprintStream(objective, strategy);
            for await (const chunk of stream) {
                set(state => ({ blueprint: state.blueprint + chunk }));
            }
            set({ state: 'blueprint_generated' });
            announce("Blueprint successfully generated.");
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            set({ state: 'strategy_generated', error: `Failed to generate blueprint: ${errorMessage}` });
            announce(`Error: ${errorMessage}`);
        }
      },

      startWithExample: (objective) => {
        get().generateStrategy(objective);
      },

      reset: () => {
        set({
          state: 'idle',
          objective: '',
          strategy: null,
          blueprint: '',
          error: null,
        });
        announce("Session reset.");
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'aegis-session-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
