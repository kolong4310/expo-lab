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
      selectionColor={DESIGN.colors.pink}
      style={[styles.input, containerStyle, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 48,
    color: DESIGN.colors.text,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.cyan,
    borderRightWidth: DESIGN.borders.heavy,
    borderBottomWidth: DESIGN.borders.heavy,
    borderRightColor: DESIGN.colors.pink,
    borderBottomColor: DESIGN.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: DESIGN.fonts.body,
    fontSize: 16,
  },
});
