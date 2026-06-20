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
import {
  LIGHT_PASTEL,
  LIGHT_PASTEL_CARD_SHADOW,
} from "../../theme/lightPastel";
import { useAppTheme } from "../../theme/useAppTheme";
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
  const { theme } = useAppTheme();

  return (
    <AnimatedPressable
      {...props}
      pressedScale={0.98}
      style={[
        styles.button,
        {
          backgroundColor: isSecondary
            ? theme.mode === "light"
              ? LIGHT_PASTEL.paper
              : theme.colors.surfaceAlt
            : theme.mode === "light"
              ? LIGHT_PASTEL.green
              : theme.colors.primary,
          borderColor:
            theme.mode === "light"
              ? LIGHT_PASTEL.border
              : theme.colors.borderStrong,
        },
        theme.mode === "light" && styles.lightButton,
        isSecondary && styles.secondary,
        props.disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color:
              theme.mode === "light" && !isSecondary
                ? theme.colors.surface
                : theme.colors.text,
          },
          isSecondary && styles.secondaryText,
          textStyle,
        ]}
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
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryText: {},
  lightButton: {
    borderWidth: 2,
    borderRadius: 24,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
});
