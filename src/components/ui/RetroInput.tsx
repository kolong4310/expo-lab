import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { DESIGN } from "../../theme/design";
import { LIGHT_PASTEL } from "../../theme/lightPastel";
import { useAppTheme } from "../../theme/useAppTheme";

type RetroInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
};

export default function RetroInput({
  style,
  containerStyle,
  placeholderTextColor,
  onFocus,
  onBlur,
  ...props
}: RetroInputProps) {
  const { mode, theme } = useAppTheme();
  const [focused, setFocused] = React.useState(false);

  const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <TextInput
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholderTextColor={
        placeholderTextColor ||
        (mode === "light" ? "#8F8066" : theme.colors.muted)
      }
      selectionColor={
        mode === "light" ? LIGHT_PASTEL.greenStrong : theme.colors.primary
      }
      underlineColorAndroid="transparent"
      style={[
        styles.input,
        {
          borderColor:
            mode === "light"
              ? focused
                ? LIGHT_PASTEL.greenStrong
                : LIGHT_PASTEL.line
              : focused
                ? theme.colors.primary
                : theme.colors.border,
          backgroundColor:
            mode === "light"
              ? focused
                ? LIGHT_PASTEL.paper
                : LIGHT_PASTEL.paperWarm
              : theme.colors.surfaceAlt,
          color: theme.colors.text,
        },
        mode === "light" && styles.lightInput,
        mode === "light" && focused && styles.lightInputFocused,
        containerStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: DESIGN.radius.input,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  lightInput: {
    borderWidth: 1.5,
    borderRadius: 18,
  },
  lightInputFocused: {
    borderWidth: 2,
    shadowColor: LIGHT_PASTEL.greenStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
});
