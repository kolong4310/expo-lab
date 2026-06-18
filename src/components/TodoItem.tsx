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
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
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
            <Ionicons name="checkmark" size={15} color={selectedTextColor} />
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
            <Text style={[styles.meta, { color: theme.colors.muted }]}>
              {meta}
            </Text>
          )}
        </View>
      </AnimatedPressable>
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
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  toggleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  check: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: 11,
  },
  checkDone: {},
  textWrap: {
    flex: 1,
    marginLeft: 13,
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
    marginTop: 2,
    fontSize: 12,
  },
});
