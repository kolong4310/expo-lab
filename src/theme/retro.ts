import { ViewStyle, TextStyle } from 'react-native';
import { DESIGN } from './design';

const pixelOffset = {
  borderRightWidth: DESIGN.borders.heavy,
  borderBottomWidth: DESIGN.borders.heavy,
  borderRightColor: DESIGN.colors.primary,
  borderBottomColor: DESIGN.colors.yellow,
};

export const retroStyles = {
  card: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.spacing.radius,
    ...pixelOffset,
  } satisfies ViewStyle,
  cardPink: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.primary,
    borderRadius: DESIGN.spacing.radius,
    borderRightWidth: DESIGN.borders.heavy,
    borderBottomWidth: DESIGN.borders.heavy,
    borderRightColor: DESIGN.colors.border,
    borderBottomColor: DESIGN.colors.yellow,
  } satisfies ViewStyle,
  input: {
    backgroundColor: DESIGN.colors.bgSecondary,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.spacing.radius,
    borderRightWidth: DESIGN.borders.heavy,
    borderBottomWidth: DESIGN.borders.heavy,
    borderRightColor: DESIGN.colors.primary,
    borderBottomColor: DESIGN.colors.yellow,
  } satisfies ViewStyle,
  button: {
    backgroundColor: DESIGN.colors.primary,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.spacing.radius,
    borderRightWidth: DESIGN.borders.heavy,
    borderBottomWidth: DESIGN.borders.heavy,
    borderRightColor: DESIGN.colors.border,
    borderBottomColor: DESIGN.colors.yellow,
  } satisfies ViewStyle,
  pixelText: {
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 0.8,
  } satisfies TextStyle,
  dotLine: {
    borderBottomWidth: DESIGN.borders.pixel,
    borderStyle: 'dashed',
    borderBottomColor: DESIGN.colors.border,
  } satisfies ViewStyle,
};
