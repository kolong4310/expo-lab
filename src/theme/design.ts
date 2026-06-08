export const DESIGN = {
  colors: {
    bg: '#050608',
    bgSecondary: '#10151F',
    surface: '#151B26',
    text: '#F8FBFF',
    textDim: '#9AA7B8',
    primary: '#FF4DB8',
    primaryLight: '#00BFFF',
    mint: '#00FF7F',
    yellow: '#FFD700',
    purple: '#A64DFF',
    border: '#2AF6FF',
    error: '#FF5A6B',
    success: '#63FF6A',
  },
  spacing: {
    base: 8,
    padding: 24,
    radius: 16,
    radiusPill: 999,
  },
  borders: {
    pixel: 2,
    heavy: 3,
  },
  typography: {
    largeTitle: {
      fontSize: 32,
      fontWeight: '900' as const,
      letterSpacing: 1,
      fontFamily: 'monospace',
    },
    title: {
      fontSize: 22,
      fontWeight: '900' as const,
      letterSpacing: 0.8,
      fontFamily: 'monospace',
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
