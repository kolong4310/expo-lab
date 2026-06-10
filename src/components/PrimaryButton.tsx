import React from "react";
import { PressableProps, StyleProp, TextStyle, ViewStyle } from "react-native";
import RetroButton from "./ui/RetroButton";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function PrimaryButton({
  label,
  style,
  textStyle,
  ...props
}: PrimaryButtonProps) {
  return (
    <RetroButton {...props} label={label} style={style} textStyle={textStyle} />
  );
}
