import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WorkLog } from "../database/types";
import { DESIGN } from "../theme/design";

interface LogCardProps {
  log: WorkLog;
  onPress: () => void;
}

export default function LogCard({ log, onPress }: LogCardProps) {
  const firstTag = log.tags?.split(",").filter(Boolean)[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.72}
    >
      <View style={styles.topRow}>
        <Text style={styles.date}>{log.date.replace(/-/g, ".")}</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={DESIGN.colors.textDim}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {log.title}
      </Text>
      {log.daily_summary && (
        <Text style={styles.summary} numberOfLines={2}>
          {log.daily_summary}
        </Text>
      )}
      {firstTag && <Text style={styles.tag}>#{firstTag}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.card,
    backgroundColor: DESIGN.colors.surface,
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    color: DESIGN.colors.textDim,
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    marginTop: 10,
    color: DESIGN.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    marginTop: 7,
    color: DESIGN.colors.textDim,
    fontSize: 13,
    lineHeight: 19,
  },
  tag: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: DESIGN.radius.pill,
    backgroundColor: "rgba(116,217,159,0.14)",
    color: DESIGN.colors.primary,
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
});
