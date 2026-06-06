export const DESIGN = {
  colors: {
    bg: '#FFFFFF',          // Canvas
    bgSecondary: '#F5F5F7', // Canvas Parchment
    text: '#1D1D1F',        // Ink
    textDim: '#7A7A7A',     // Muted
    primary: '#0066CC',      // iOS Blue
    primaryLight: '#2997FF', // Light Blue
    border: '#E0E0E0',       // Hairline
    error: '#FF3B30',       // iOS Red
    success: '#34C759',     // iOS Green
  },
  spacing: {
    base: 8,
    padding: 24,
    radius: 18,
    radiusPill: 999,
  },
  typography: {
    largeTitle: {
      fontSize: 34,
      fontWeight: '600' as const,
      letterSpacing: -0.5,
    },
    title: {
      fontSize: 22,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
    },
    body: {
      fontSize: 17,
      lineHeight: 24,
    },
    footnote: {
      fontSize: 13,
      fontWeight: '400' as const,
    }
  }
};
