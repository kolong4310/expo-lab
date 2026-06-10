import { AppColors, AppFonts, AppRadius, AppSpacing } from "./theme";

export const DESIGN = {
  colors: {
    bg: AppColors.background,
    bgSecondary: AppColors.surfaceAlt,
    surface: AppColors.surface,
    surfaceAlt: AppColors.surfaceAlt,
    text: AppColors.text,
    textDim: AppColors.muted,
    primary: AppColors.primary,
    primaryLight: AppColors.secondary,
    secondary: AppColors.secondary,
    success: AppColors.success,
    warning: AppColors.warning,
    error: AppColors.danger,
    border: AppColors.border,
    borderStrong: AppColors.borderStrong,
    // Compatibility aliases while screens migrate away from the retro palette.
    pink: AppColors.primary,
    purple: AppColors.primary,
    cyan: AppColors.secondary,
    green: AppColors.success,
    mint: AppColors.success,
    yellow: AppColors.warning,
  },
  fonts: {
    title: AppFonts.title,
    pixelKo: AppFonts.body,
    body: AppFonts.body,
    score: AppFonts.title,
  },
  spacing: {
    base: AppSpacing.sm,
    padding: AppSpacing.lg,
    radius: AppRadius.card,
    radiusPill: AppRadius.pill,
    cardGap: AppSpacing.md,
  },
  radius: AppRadius,
  borders: {
    pixel: 1,
    heavy: 1,
  },
  typography: {
    largeTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      letterSpacing: -0.7,
      fontFamily: AppFonts.title,
    },
    title: {
      fontSize: 20,
      fontWeight: "700" as const,
      letterSpacing: -0.3,
      fontFamily: AppFonts.title,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    footnote: {
      fontSize: 13,
      fontWeight: "500" as const,
      fontFamily: AppFonts.body,
    },
  },
};
