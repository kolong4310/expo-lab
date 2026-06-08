import { RetroBorders, RetroColors, RetroFonts } from './theme';

export const DESIGN = {
  colors: {
    bg: RetroColors.background,
    bgSecondary: RetroColors.surfaceAlt,
    surface: RetroColors.surface,
    text: RetroColors.text,
    textDim: RetroColors.muted,
    primary: RetroColors.neonPink,
    primaryLight: RetroColors.neonCyan,
    mint: RetroColors.neonGreen,
    yellow: RetroColors.neonYellow,
    purple: RetroColors.neonPurple,
    border: RetroColors.neonCyan,
    error: RetroColors.danger,
    success: RetroColors.neonGreen,
  },
  spacing: {
    base: 8,
    padding: 24,
    radius: RetroBorders.radius,
    radiusPill: RetroBorders.radiusLarge,
  },
  borders: {
    pixel: RetroBorders.pixel,
    heavy: RetroBorders.heavy,
  },
  typography: {
    largeTitle: {
      fontSize: 32,
      fontWeight: '900' as const,
      letterSpacing: 1.4,
      fontFamily: RetroFonts.title,
      textTransform: 'uppercase' as const,
    },
    title: {
      fontSize: 22,
      fontWeight: '900' as const,
      letterSpacing: 1,
      fontFamily: RetroFonts.title,
      textTransform: 'uppercase' as const,
    },
    body: {
      fontSize: 17,
      lineHeight: 24,
    },
    footnote: {
      fontSize: 13,
      fontWeight: '700' as const,
      fontFamily: RetroFonts.pixel,
    },
  },
};
