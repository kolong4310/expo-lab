import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { DESIGN } from "../../theme/design";

type Accent = "cyan" | "pink" | "green" | "yellow" | "purple";

type RetroCardProps = ViewProps & {
  accent?: Accent;
};

const accentColor: Record<Accent, string> = {
  cyan: DESIGN.colors.cyan,
  pink: DESIGN.colors.pink,
  green: DESIGN.colors.green,
  yellow: DESIGN.colors.yellow,
  purple: DESIGN.colors.purple,
};

export default function RetroCard({
  accent = "cyan",
  style,
  children,
  ...props
}: RetroCardProps) {
  const color = accentColor[accent];

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          borderColor: color,
          borderRightColor: DESIGN.colors.pink,
          borderBottomColor: DESIGN.colors.yellow,
        },
        style,
      ]}
    >
      <View style={[styles.corner, { backgroundColor: color }]} />
      <View
        style={[styles.cornerSmall, { backgroundColor: DESIGN.colors.yellow }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.pixel,
    borderRadius: 8,
    borderRightWidth: DESIGN.borders.pixel,
    borderBottomWidth: DESIGN.borders.pixel,
  },
  corner: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 8,
    height: 8,
  },
  cornerSmall: {
    position: "absolute",
    right: 20,
    top: 8,
    width: 4,
    height: 4,
  },
});
