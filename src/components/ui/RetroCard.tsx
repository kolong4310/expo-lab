import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { DESIGN } from "../../theme/design";
import { useAppTheme } from "../../theme/useAppTheme";

type RetroCardProps = ViewProps & {
  accent?: "cyan" | "pink" | "green" | "yellow" | "purple";
};

export default function RetroCard({
  style,
  children,
  accent: _accent,
  ...props
}: RetroCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
    >
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
