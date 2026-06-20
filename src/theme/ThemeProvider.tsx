import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getSelectedThemeMode,
  setSelectedThemeMode as saveSelectedThemeMode,
} from "../database/repositories/settingsRepository";
import {
  AppTheme,
  AppThemeMode,
  DEFAULT_THEME_MODE,
  getThemeByMode,
  RELEASE_THEME_MODE,
} from "./theme";

interface ThemeContextValue {
  mode: AppThemeMode;
  theme: AppTheme;
  setThemeMode: (mode: AppThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppThemeMode>(DEFAULT_THEME_MODE);

  useEffect(() => {
    // Preserve the setting schema while normalizing pre-release dark values.
    if (getSelectedThemeMode() !== RELEASE_THEME_MODE) {
      saveSelectedThemeMode(RELEASE_THEME_MODE);
    }
    setMode(RELEASE_THEME_MODE);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme: getThemeByMode(mode),
      setThemeMode: (_nextMode) => {
        saveSelectedThemeMode(RELEASE_THEME_MODE);
        setMode(RELEASE_THEME_MODE);
      },
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
