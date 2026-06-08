import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { DESIGN } from '../../theme/design';

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
    minHeight: 58,
    backgroundColor: DESIGN.colors.pink,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.cyan,
    borderRightColor: DESIGN.colors.cyan,
    borderBottomColor: DESIGN.colors.yellow,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  secondary: {
    backgroundColor: DESIGN.colors.cyan,
    borderBottomColor: DESIGN.colors.green,
  },
  pressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
    borderRightWidth: DESIGN.borders.pixel,
    borderBottomWidth: DESIGN.borders.pixel,
  },
  text: {
    color: DESIGN.colors.text,
    fontFamily: DESIGN.fonts.title,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 16,
  },
  secondaryText: {
    color: DESIGN.colors.bg,
  },
});
