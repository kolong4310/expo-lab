import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";
import RetroCard from "./ui/RetroCard";

interface StatCardProps {
  label: string;
  value: string;
  accent?: "cyan" | "pink" | "green" | "yellow" | "purple";
  style?: StyleProp<ViewStyle>;
}

const LIGHT_ACCENTS = {
  cyan: LIGHT_PASTEL.blue,
  pink: LIGHT_PASTEL.pink,
  green: LIGHT_PASTEL.mint,
  yellow: LIGHT_PASTEL.yellow,
  purple: "#E7DDF4",
} as const;

export default function StatCard({
  label,
  value,
  accent = "green",
  style,
}: StatCardProps) {
  const { mode, theme } = useAppTheme();

  return (
    <RetroCard
      style={[
        styles.card,
        mode === "light" && {
          borderColor: LIGHT_PASTEL.border,
          backgroundColor: LIGHT_ACCENTS[accent],
        },
        mode === "light" && styles.lightCard,
        style,
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.muted }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
    </RetroCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 112,
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  lightCard: {
    borderWidth: 2,
    borderRadius: 24,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
});
