import React, { createContext, ReactNode, useMemo, useState } from "react";
import {
  getSelectedLanguage,
  setSelectedLanguage as saveSelectedLanguage,
} from "../database/repositories/settingsRepository";
import { AppLanguage, DEFAULT_LANGUAGE } from "./languages";
import { TranslationKey, translations } from "./translations";

interface I18nContextValue {
  language: AppLanguage;
  selectedLanguage: AppLanguage | null;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

const interpolate = (
  text: string,
  values: Record<string, string | number> = {},
) =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    text,
  );

export function I18nProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] =
    useState<AppLanguage | null>(() => getSelectedLanguage());

  const language = selectedLanguage ?? DEFAULT_LANGUAGE;

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      selectedLanguage,
      setLanguage: (nextLanguage) => {
        saveSelectedLanguage(nextLanguage);
        setSelectedLanguageState(nextLanguage);
      },
      t: (key, values) => interpolate(translations[language][key], values),
    }),
    [language, selectedLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
