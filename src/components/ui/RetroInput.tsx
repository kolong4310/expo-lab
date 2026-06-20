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
  ...props
}: RetroInputProps) {
  const { mode, theme } = useAppTheme();

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor || theme.colors.muted}
      selectionColor={theme.colors.primary}
      style={[
        styles.input,
        {
          borderColor:
            mode === "light" ? LIGHT_PASTEL.line : theme.colors.border,
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.paperWarm : theme.colors.surfaceAlt,
          color: theme.colors.text,
        },
        mode === "light" && styles.lightInput,
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
});
