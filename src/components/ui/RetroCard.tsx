import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { DESIGN } from "../../theme/design";

type RetroCardProps = ViewProps & {
  accent?: "cyan" | "pink" | "green" | "yellow" | "purple";
};

export default function RetroCard({
  style,
  children,
  accent: _accent,
  ...props
}: RetroCardProps) {
  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.card,
    backgroundColor: DESIGN.colors.surface,
  },
});
