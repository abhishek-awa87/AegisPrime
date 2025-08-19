import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SettingsState } from '../types/settings';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
    }),
    {
      name: 'aegis-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
