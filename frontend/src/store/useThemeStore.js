import { create } from "zustand";
import { THEMES } from "../constants";

const STORAGE_KEY = "nexora-theme";
const DEFAULT_THEME = "nexora";

// localStorage can be unavailable (private mode, blocked storage) - never let that crash the app.
const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.some((t) => t.name === stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const useThemeStore = create((set) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore - the theme still applies for this session */
    }
    set({ theme });
  },
}));
