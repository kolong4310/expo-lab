import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WorkLog } from "../database/types";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";

interface LogCardProps {
  log: WorkLog;
  onPress: () => void;
}

export default function LogCard({ log, onPress }: LogCardProps) {
  const { theme } = useAppTheme();
  const firstTag = log.tags?.split(",").filter(Boolean)[0];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.72}
    >
      <View style={styles.topRow}>
        <Text style={[styles.date, { color: theme.colors.muted }]}>
          {log.date.replace(/-/g, ".")}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
      </View>
      <Text
        style={[styles.title, { color: theme.colors.text }]}
        numberOfLines={1}
      >
        {log.title}
      </Text>
      {log.daily_summary && (
        <Text
          style={[styles.summary, { color: theme.colors.muted }]}
          numberOfLines={2}
        >
          {log.daily_summary}
        </Text>
      )}
      {firstTag && (
        <Text
          style={[
            styles.tag,
            {
              backgroundColor: `${theme.colors.primary}24`,
              color: theme.colors.primary,
            },
          ]}
        >
          #{firstTag}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: DESIGN.radius.card,
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
  },
  summary: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
  },
  tag: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: DESIGN.radius.pill,
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
});
