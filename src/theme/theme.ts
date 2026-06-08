export const RetroColors = {
  background: '#050505',
  surface: '#151922',
  surfaceAlt: '#0D1018',
  neonPink: '#ff4db8',
  neonCyan: '#69f2ff',
  neonYellow: '#ffe45c',
  neonGreen: '#6dff8f',
  neonPurple: '#a64dff',
  text: '#f8f8f8',
  muted: '#9aa3b2',
  danger: '#ff5a6b',
};

export const RetroFonts = {
  pixel: 'monospace',
  title: 'monospace',
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
    fontWeight: '900' as const,
    letterSpacing: 1.2,
    color: RetroColors.text,
  },
  label: {
    fontFamily: RetroFonts.pixel,
    fontWeight: '900' as const,
    letterSpacing: 0.8,
    color: RetroColors.neonCyan,
  },
  number: {
    fontFamily: RetroFonts.pixel,
    fontWeight: '900' as const,
    color: RetroColors.neonYellow,
  },
};

export const Colors = RetroColors;
export const Spacing = RetroSpacing;
export const Typography = RetroTypography;
