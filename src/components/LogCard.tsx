import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WorkLog } from "../database/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

interface LogCardProps {
  log: WorkLog;
  onPress: () => void;
}

export default function LogCard({ log, onPress }: LogCardProps) {
  const { mode, theme } = useAppTheme();
  const firstTag = log.tags?.split(",").filter(Boolean)[0];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor:
            mode === "light" ? LIGHT_PASTEL.border : theme.colors.border,
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.paper : theme.colors.surface,
        },
        mode === "light" && styles.lightCard,
      ]}
      onPress={onPress}
      activeOpacity={0.72}
    >
      <View
        pointerEvents="none"
        style={[
          styles.noteTape,
          {
            backgroundColor:
              mode === "light" ? LIGHT_PASTEL.yellow : theme.colors.surfaceAlt,
          },
        ]}
      />
      <View style={styles.topRow}>
        <View style={styles.dateWrap}>
          <View
            style={[
              styles.noteIcon,
              {
                backgroundColor:
                  mode === "light"
                    ? LIGHT_PASTEL.greenSoft
                    : theme.colors.surfaceAlt,
              },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={14}
              color={theme.colors.primary}
            />
          </View>
          <Text style={[styles.date, { color: theme.colors.muted }]}>
            {log.date.replace(/-/g, ".")}
          </Text>
        </View>
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
    position: "relative",
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: DESIGN.radius.card,
    padding: 18,
  },
  lightCard: {
    borderWidth: 2,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  noteTape: {
    position: "absolute",
    top: -4,
    right: 28,
    width: 42,
    height: 12,
    borderRadius: 3,
    opacity: 0.82,
    transform: [{ rotate: "2deg" }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderRadius: 10,
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
