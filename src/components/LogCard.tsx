import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { WorkLog } from "../database/db";
import { DESIGN } from "../theme/design";

interface LogCardProps {
  log: WorkLog;
  onPress: () => void;
}

export default function LogCard({ log, onPress }: LogCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.date}>{log.date.replace(/-/g, ".")}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {log.title}
      </Text>
      {log.daily_summary && (
        <Text style={styles.summary} numberOfLines={2}>
          {log.daily_summary}
        </Text>
      )}
      <Text style={styles.openMark}>{">"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.cyan,
    borderRightColor: DESIGN.colors.pink,
    borderBottomColor: DESIGN.colors.yellow,
    backgroundColor: DESIGN.colors.surface,
    padding: 14,
  },
  date: {
    marginBottom: 4,
    color: DESIGN.colors.purple,
    fontFamily: DESIGN.fonts.title,
    fontWeight: "900",
  },
  title: {
    marginBottom: 6,
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  summary: {
    color: DESIGN.colors.textDim,
    lineHeight: 20,
  },
  openMark: {
    position: "absolute",
    right: 12,
    top: 16,
    color: DESIGN.colors.primary,
    fontFamily: DESIGN.fonts.title,
    fontWeight: "900",
  },
});
