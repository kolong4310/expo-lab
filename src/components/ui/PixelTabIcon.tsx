import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { LIGHT_PASTEL } from "../../theme/lightPastel";
import { useAppTheme } from "../../theme/useAppTheme";

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
  const { mode } = useAppTheme();

  return (
    <View
      style={[
        styles.iconWrap,
        focused && mode === "light" && styles.lightFocused,
      ]}
    >
      <Ionicons name={name} size={focused ? 22 : 20} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 38,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  lightFocused: {
    backgroundColor: LIGHT_PASTEL.greenSoft,
  },
});
