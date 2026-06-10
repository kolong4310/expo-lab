import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { DESIGN } from "../theme/design";
import RetroCard from "./ui/RetroCard";

interface StatCardProps {
  label: string;
  value: string;
  accent?: "cyan" | "pink" | "green" | "yellow" | "purple";
  style?: StyleProp<ViewStyle>;
}

export default function StatCard({
  label,
  value,
  accent = "cyan",
  style,
}: StatCardProps) {
  return (
    <RetroCard accent={accent} style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </RetroCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 108,
    flex: 1,
    justifyContent: "center",
    padding: 14,
  },
  label: {
    marginBottom: 8,
    color: DESIGN.colors.cyan,
    fontFamily: DESIGN.fonts.title,
    fontSize: 11,
    fontWeight: "900",
  },
  value: {
    color: DESIGN.colors.yellow,
    fontFamily: DESIGN.fonts.score,
    fontSize: 20,
    fontWeight: "900",
  },
});
