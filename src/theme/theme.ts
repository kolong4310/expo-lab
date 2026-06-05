export const Colors = {
  primary: '#4F46E5', // Indigo 600
  secondary: '#10B981', // Emerald 500
  background: '#F9FAFB', // Gray 50
  surface: '#FFFFFF',
  text: '#111827', // Gray 900
  textSecondary: '#6B7280', // Gray 500
  border: '#E5E7EB', // Gray 200
  error: '#EF4444', // Red 500
  white: '#FFFFFF',
  black: '#000000',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
};
