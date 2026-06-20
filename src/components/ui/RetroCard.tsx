import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { DESIGN } from "../../theme/design";
import {
  LIGHT_PASTEL,
  LIGHT_PASTEL_CARD_SHADOW,
} from "../../theme/lightPastel";
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
  const { mode, theme } = useAppTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          borderColor:
            mode === "light" ? LIGHT_PASTEL.border : theme.colors.border,
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.paper : theme.colors.surface,
        },
        mode === "light" && styles.lightCard,
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
  lightCard: {
    borderWidth: 2,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
});
