export type AppLanguage = "ko" | "en" | "ja" | "zh";

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}

export const DEFAULT_LANGUAGE: AppLanguage = "ko";

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "ko", label: "한국어", nativeLabel: "한국어" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ja", label: "日本語", nativeLabel: "日本語" },
  { code: "zh", label: "中文", nativeLabel: "中文" },
];

const APP_LANGUAGE_CODES = LANGUAGE_OPTIONS.map((language) => language.code);

export const isAppLanguage = (value: string | null): value is AppLanguage =>
  APP_LANGUAGE_CODES.includes(value as AppLanguage);
