import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { DESIGN } from "../../theme/design";

type RetroInputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
};

export default function RetroInput({
  style,
  containerStyle,
  placeholderTextColor,
  ...props
}: RetroInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor || DESIGN.colors.textDim}
      selectionColor={DESIGN.colors.primary}
      style={[styles.input, containerStyle, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.input,
    backgroundColor: DESIGN.colors.bgSecondary,
    color: DESIGN.colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
});
