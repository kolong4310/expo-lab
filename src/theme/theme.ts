export type AppThemeMode = "dark" | "light";

export interface AppTheme {
  mode: AppThemeMode;
  colors: typeof darkThemeColors;
}

export const darkThemeColors = {
  background: "#0B1010",
  surface: "#151C1A",
  surfaceAlt: "#1D2723",
  primary: "#74D99F",
  secondary: "#8AD7C1",
  success: "#5FD38D",
  warning: "#E6B86A",
  danger: "#F87171",
  text: "#F7FBF7",
  muted: "#9BAEA4",
  border: "rgba(247,251,247,0.055)",
  borderStrong: "rgba(247,251,247,0.13)",
};

export const lightThemeColors: typeof darkThemeColors = {
  background: "#F4F7EF",
  surface: "#FFFFFF",
  surfaceAlt: "#EAF1E6",
  primary: "#2F8F5F",
  secondary: "#5FAE92",
  success: "#2F9D63",
  warning: "#B7791F",
  danger: "#D94F4F",
  text: "#14201A",
  muted: "#607468",
  border: "rgba(47,80,60,0.10)",
  borderStrong: "rgba(47,80,60,0.18)",
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: darkThemeColors,
};

export const lightTheme: AppTheme = {
  mode: "light",
  colors: lightThemeColors,
};

// Tiny Growth 1.0.0 ships with the light pastel experience only.
export const RELEASE_THEME_MODE: AppThemeMode = "light";
export const DEFAULT_THEME_MODE: AppThemeMode = RELEASE_THEME_MODE;

export const isAppThemeMode = (value: string | null): value is AppThemeMode =>
  value === "dark" || value === "light";

export const getThemeByMode = (mode: AppThemeMode): AppTheme =>
  mode === "light" ? lightTheme : darkTheme;

export const AppColors = darkThemeColors;

export const AppFonts = {
  title: undefined,
  body: undefined,
};

export const AppSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const AppRadius = {
  input: 16,
  button: 20,
  card: 26,
  pill: 999,
};

export const Colors = AppColors;
export const Spacing = AppSpacing;
