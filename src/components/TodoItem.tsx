import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../i18n/useTranslation";
import { useAppTheme } from "../theme/useAppTheme";
import AnimatedPressable from "./AnimatedPressable";

interface TodoItemProps {
  title: string;
  completed: boolean;
  meta?: string;
  onToggle: () => void;
  onDelete?: () => void;
}

export default function TodoItem({
  title,
  completed,
  meta,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const selectedTextColor =
    theme.mode === "light" ? theme.colors.surface : theme.colors.text;

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: `${theme.colors.secondary}24`,
          backgroundColor: theme.colors.surface,
        },
        completed && {
          borderColor: `${theme.colors.primary}70`,
          backgroundColor: `${theme.colors.primary}1A`,
        },
      ]}
    >
      {completed && (
        <View pointerEvents="none" style={styles.questSparkles}>
          <Text style={[styles.questSparkle, { color: theme.colors.warning }]}>
            ✦
          </Text>
          <Text
            style={[
              styles.questSparkle,
              styles.questSparkleSmall,
              { color: theme.colors.secondary },
            ]}
          >
            ✦
          </Text>
        </View>
      )}
      <AnimatedPressable
        style={styles.toggleArea}
        onPress={onToggle}
        pressedScale={0.98}
      >
        <View
          style={[
            styles.questIcon,
            {
              borderColor: `${theme.colors.warning}3D`,
              backgroundColor: `${theme.colors.warning}18`,
            },
            completed && {
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <Ionicons
            name={completed ? "checkmark" : "leaf-outline"}
            size={completed ? 21 : 19}
            color={completed ? selectedTextColor : theme.colors.warning}
          />
        </View>
        <View style={styles.textWrap}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.text },
              completed && styles.titleDone,
            ]}
          >
            {title}
          </Text>
          {meta && (
            <View
              style={[
                styles.metaBadge,
                {
                  backgroundColor: completed
                    ? `${theme.colors.primary}22`
                    : `${theme.colors.secondary}14`,
                },
              ]}
            >
              <Text style={[styles.meta, { color: theme.colors.muted }]}>
                {meta}
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.questStatus,
            {
              borderColor: completed
                ? `${theme.colors.primary}60`
                : theme.colors.border,
              backgroundColor: completed
                ? `${theme.colors.primary}26`
                : theme.colors.surfaceAlt,
            },
          ]}
        >
          <Ionicons
            name={completed ? "sparkles" : "footsteps-outline"}
            size={13}
            color={completed ? theme.colors.success : theme.colors.muted}
          />
          <Text
            style={[
              styles.questStatusText,
              {
                color: completed ? theme.colors.success : theme.colors.muted,
              },
            ]}
          >
            {completed ? t("today.questComplete") : t("today.questReady")}
          </Text>
        </View>
      </AnimatedPressable>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={10}
          style={styles.deleteButton}
        >
          <Ionicons name="close" size={19} color={theme.colors.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: "relative",
    minHeight: 84,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderRadius: 23,
    overflow: "hidden",
  },
  toggleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  questIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    transform: [{ rotate: "-3deg" }],
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  titleDone: {
    fontWeight: "800",
  },
  meta: {
    fontSize: 11,
    fontWeight: "700",
  },
  metaBadge: {
    alignSelf: "flex-start",
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  questStatus: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 54,
    maxWidth: 68,
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 14,
  },
  questStatusText: {
    fontSize: 9,
    fontWeight: "800",
    textAlign: "center",
  },
  questSparkles: {
    ...StyleSheet.absoluteFillObject,
  },
  questSparkle: {
    position: "absolute",
    top: 3,
    right: 5,
    fontSize: 13,
    fontWeight: "900",
  },
  questSparkleSmall: {
    top: 59,
    right: 82,
    fontSize: 8,
  },
  deleteButton: {
    marginLeft: 7,
  },
});
