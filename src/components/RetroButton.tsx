import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { DESIGN } from '../theme/design';

type RetroButtonProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function RetroButton({ label, variant = 'primary', style, textStyle, ...props }: RetroButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.button,
        isSecondary && styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, isSecondary && styles.secondaryText, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    backgroundColor: DESIGN.colors.primary,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.border,
    borderRightColor: DESIGN.colors.border,
    borderBottomColor: DESIGN.colors.yellow,
    borderRadius: DESIGN.spacing.radius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondary: {
    backgroundColor: DESIGN.colors.primaryLight,
    borderBottomColor: DESIGN.colors.mint,
  },
  pressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
    borderRightWidth: DESIGN.borders.pixel,
    borderBottomWidth: DESIGN.borders.pixel,
  },
  text: {
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 0.8,
    fontSize: 16,
  },
  secondaryText: {
    color: DESIGN.colors.bg,
  },
});
