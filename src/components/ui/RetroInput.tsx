import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { DESIGN } from "../../theme/design";
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
  const { theme } = useAppTheme();

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor || theme.colors.muted}
      selectionColor={theme.colors.primary}
      style={[
        styles.input,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surfaceAlt,
          color: theme.colors.text,
        },
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
});
