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

export default function StatCard({ label, value, style }: StatCardProps) {
  return (
    <RetroCard style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
    color: DESIGN.colors.textDim,
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: DESIGN.colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
});
