import { execute, queryFirst } from "../db";
import { AppLanguage, isAppLanguage } from "../../i18n/languages";

const SELECTED_LANGUAGE_KEY = "selectedLanguage";

interface AppSettingRow {
  value: string;
}

export const getSelectedLanguage = (): AppLanguage | null => {
  const row = queryFirst<AppSettingRow>(
    "SELECT value FROM app_settings WHERE key = ?",
    [SELECTED_LANGUAGE_KEY],
  );
  const value = row?.value ?? null;

  return isAppLanguage(value) ? value : null;
};

export const setSelectedLanguage = (language: AppLanguage) => {
  execute(
    `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `,
    [SELECTED_LANGUAGE_KEY, language, new Date().toISOString()],
  );
};
