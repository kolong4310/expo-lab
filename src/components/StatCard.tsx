import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";
import RetroCard from "./ui/RetroCard";

interface StatCardProps {
  label: string;
  value: string;
  accent?: "cyan" | "pink" | "green" | "yellow" | "purple";
  style?: StyleProp<ViewStyle>;
}

export default function StatCard({ label, value, style }: StatCardProps) {
  const { theme } = useAppTheme();

  return (
    <RetroCard style={[styles.card, style]}>
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
