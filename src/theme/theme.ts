export const RetroColors = {
  background: "#050505",
  surface: "#151922",
  surfaceAlt: "#0B0E14",
  neonPink: "#FF4DB8",
  neonCyan: "#00E5FF",
  neonYellow: "#FFE45C",
  neonGreen: "#6DFF8F",
  neonPurple: "#A855F7",
  text: "#FFFFFF",
  muted: "#9AA3B2",
  danger: "#FF5A6B",
};

export const RetroFonts = {
  pixel: "monospace",
  title: "monospace",
  body: undefined,
};

export const RetroSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RetroBorders = {
  thin: 2,
  pixel: 3,
  heavy: 4,
  radius: 10,
  radiusLarge: 14,
};

export const RetroTypography = {
  title: {
    fontFamily: RetroFonts.title,
    fontWeight: "900" as const,
    letterSpacing: 1.2,
    color: RetroColors.text,
  },
  label: {
    fontFamily: RetroFonts.pixel,
    fontWeight: "900" as const,
    letterSpacing: 0.8,
    color: RetroColors.neonCyan,
  },
  number: {
    fontFamily: RetroFonts.pixel,
    fontWeight: "900" as const,
    color: RetroColors.neonYellow,
  },
};

export const Colors = RetroColors;
export const Spacing = RetroSpacing;
export const Typography = RetroTypography;
