import React, { createContext, ReactNode, useMemo, useState } from "react";
import {
  getSelectedThemeMode,
  setSelectedThemeMode as saveSelectedThemeMode,
} from "../database/repositories/settingsRepository";
import {
  AppTheme,
  AppThemeMode,
  DEFAULT_THEME_MODE,
  getThemeByMode,
} from "./theme";

interface ThemeContextValue {
  mode: AppThemeMode;
  theme: AppTheme;
  setThemeMode: (mode: AppThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppThemeMode>(
    () => getSelectedThemeMode() ?? DEFAULT_THEME_MODE,
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme: getThemeByMode(mode),
      setThemeMode: (nextMode) => {
        saveSelectedThemeMode(nextMode);
        setMode(nextMode);
      },
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
