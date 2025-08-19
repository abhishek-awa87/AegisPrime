import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  
  isSettingsOpen: boolean;
  toggleSettings: () => void;

  speechRate: number;
  setSpeechRate: (rate: number) => void;
  
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string) => void;
  
  availableVoices: SpeechSynthesisVoice[];
  loadVoices: () => void;

  isSoundEnabled: boolean;
  toggleSound: () => void;

  hasSeenTutorial: boolean;
  setHasSeenTutorial: (seen: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      isFocusMode: false,
      toggleFocusMode: () => set(state => ({ isFocusMode: !state.isFocusMode })),
      
      isSettingsOpen: false,
      toggleSettings: () => set(state => ({ isSettingsOpen: !state.isSettingsOpen })),

      speechRate: 1,
      setSpeechRate: (rate) => set({ speechRate: rate }),
      
      selectedVoiceURI: null,
      setSelectedVoiceURI: (uri) => set({ selectedVoiceURI: uri }),
      
      availableVoices: [],
      loadVoices: () => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        
        const updateVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                set({ availableVoices: voices });
                if (!get().selectedVoiceURI && voices.length > 0) {
                    const defaultVoice = voices.find(v => v.default) || voices[0];
                    if (defaultVoice) {
                        set({ selectedVoiceURI: defaultVoice.voiceURI });
                    }
                }
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            updateVoices();
            return;
        }

        window.speechSynthesis.onvoiceschanged = updateVoices;
      },

      isSoundEnabled: true,
      toggleSound: () => set(state => ({ isSoundEnabled: !state.isSoundEnabled })),

      hasSeenTutorial: false,
      setHasSeenTutorial: (seen) => set({ hasSeenTutorial: seen }),
    }),
    {
      name: 'aegis-settings-storage',
      storage: createJSONStorage(() => localStorage),
      // Prevent non-serializable parts from being persisted
      partialize: (state) => ({
        ...state,
        availableVoices: [], 
      }),
    }
  )
);
