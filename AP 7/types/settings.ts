import { Theme } from ".";

export interface SettingsState {
  theme: Theme;
  toggleTheme: () => void;
}
