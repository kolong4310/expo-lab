import React from "react";
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { DESIGN } from "../../theme/design";
import AnimatedPressable from "../AnimatedPressable";

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
    <AnimatedPressable
      {...props}
      pressedScale={0.98}
      style={[
        styles.button,
        isSecondary && styles.secondary,
        props.disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[styles.text, isSecondary && styles.secondaryText, textStyle]}
      >
        {label}
      </Text>
    </AnimatedPressable>
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
