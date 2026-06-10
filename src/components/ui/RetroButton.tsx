import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { DESIGN } from "../../theme/design";

type RetroButtonProps = PressableProps & {
  label: string;
  variant?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function RetroButton({
  label,
  variant = "primary",
  style,
  textStyle,
  ...props
}: RetroButtonProps) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.button,
        isSecondary && styles.secondary,
        pressed && styles.pressed,
        props.disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[styles.text, isSecondary && styles.secondaryText, textStyle]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: DESIGN.radius.button,
    backgroundColor: DESIGN.colors.primary,
    paddingHorizontal: 20,
  },
  secondary: {
    borderWidth: 1,
    borderColor: DESIGN.colors.borderStrong,
    backgroundColor: DESIGN.colors.surfaceAlt,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: DESIGN.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {
    color: DESIGN.colors.text,
  },
});
