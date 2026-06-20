import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../i18n/useTranslation";
import { LIGHT_PASTEL } from "../theme/lightPastel";
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
          borderColor:
            theme.mode === "light" ? "#E8DFC9" : `${theme.colors.secondary}24`,
          backgroundColor:
            theme.mode === "light" ? "#FFFDF8" : theme.colors.surface,
        },
        completed && {
          borderColor:
            theme.mode === "light" ? "#9DCDA8" : `${theme.colors.primary}70`,
          backgroundColor:
            theme.mode === "light" ? "#E4F3DD" : `${theme.colors.primary}1A`,
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
              borderColor:
                theme.mode === "light"
                  ? "#EBCF9B"
                  : `${theme.colors.warning}3D`,
              backgroundColor:
                theme.mode === "light"
                  ? "#FFF5DA"
                  : `${theme.colors.warning}18`,
            },
            completed && {
              borderColor: theme.colors.primary,
              backgroundColor:
                theme.mode === "light"
                  ? LIGHT_PASTEL.greenSoft
                  : theme.colors.primary,
            },
          ]}
        >
          <Ionicons
            name={completed ? "checkmark" : "leaf-outline"}
            size={completed ? 21 : 19}
            color={
              completed
                ? theme.mode === "light"
                  ? LIGHT_PASTEL.greenText
                  : selectedTextColor
                : theme.colors.warning
            }
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
                ? `${theme.colors.primary}68`
                : theme.colors.border,
              backgroundColor: completed
                ? theme.mode === "light"
                  ? LIGHT_PASTEL.greenSoft
                  : `${theme.colors.primary}26`
                : theme.colors.surfaceAlt,
            },
          ]}
        >
          <Ionicons
            name={completed ? "checkmark-circle" : "ellipse-outline"}
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
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#8B8068",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 1,
  },
  toggleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  questIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 16,
    shadowColor: "#B9AA8D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    transform: [{ rotate: "-3deg" }],
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
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
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 60,
    maxWidth: 72,
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 15,
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
