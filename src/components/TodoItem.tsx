import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DESIGN } from "../theme/design";
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
  const { theme } = useAppTheme();
  const selectedTextColor =
    theme.mode === "light" ? theme.colors.surface : theme.colors.text;

  return (
    <View
      style={[
        styles.row,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        completed && {
          borderColor: `${theme.colors.primary}38`,
          backgroundColor: `${theme.colors.primary}12`,
        },
      ]}
    >
      <AnimatedPressable
        style={styles.toggleArea}
        onPress={onToggle}
        pressedScale={0.99}
      >
        <View
          style={[
            styles.check,
            { borderColor: theme.colors.borderStrong },
            completed && {
              borderColor: theme.colors.secondary,
              backgroundColor: theme.colors.secondary,
            },
          ]}
        >
          {completed && (
            <Ionicons name="checkmark" size={18} color={selectedTextColor} />
          )}
        </View>
        <View style={styles.textWrap}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.text },
              completed && { color: theme.colors.muted },
              completed && styles.titleDone,
            ]}
          >
            {title}
          </Text>
          {meta && (
            <View
              style={[
                styles.metaBadge,
                { backgroundColor: `${theme.colors.secondary}10` },
              ]}
            >
              <Text style={[styles.meta, { color: theme.colors.muted }]}>
                {meta}
              </Text>
            </View>
          )}
        </View>
      </AnimatedPressable>
      {completed && !onDelete && (
        <Ionicons
          name="leaf"
          size={18}
          color={theme.colors.success}
          style={styles.completionLeaf}
        />
      )}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} hitSlop={10}>
          <Ionicons name="close" size={19} color={theme.colors.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 20,
  },
  toggleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  check: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 14,
  },
  checkDone: {},
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  titleDone: {
    textDecorationLine: "line-through",
  },
  meta: {
    fontSize: 12,
    fontWeight: "600",
  },
  metaBadge: {
    alignSelf: "flex-start",
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  completionLeaf: {
    marginLeft: 8,
  },
});
