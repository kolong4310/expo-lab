import { execute, queryFirst } from "../db";
import { AppLanguage, isAppLanguage } from "../../i18n/languages";
import { AppThemeMode, isAppThemeMode } from "../../theme/theme";

const SELECTED_LANGUAGE_KEY = "selectedLanguage";
const SELECTED_THEME_MODE_KEY = "selectedThemeMode";

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

export const getSelectedThemeMode = (): AppThemeMode | null => {
  const row = queryFirst<AppSettingRow>(
    "SELECT value FROM app_settings WHERE key = ?",
    [SELECTED_THEME_MODE_KEY],
  );
  const value = row?.value ?? null;

  return isAppThemeMode(value) ? value : null;
};

export const setSelectedThemeMode = (mode: AppThemeMode) => {
  execute(
    `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at
    `,
    [SELECTED_THEME_MODE_KEY, mode, new Date().toISOString()],
  );
};
