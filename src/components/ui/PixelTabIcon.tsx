import { Ionicons } from "@expo/vector-icons";
import React from "react";

type PixelTabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  accent?: string;
};

export default function PixelTabIcon({
  name,
  color,
  focused,
}: PixelTabIconProps) {
  return <Ionicons name={name} size={focused ? 23 : 21} color={color} />;
}
