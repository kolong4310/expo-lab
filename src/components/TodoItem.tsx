import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DESIGN } from "../theme/design";

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
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.toggleArea}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.check, completed && styles.checkDone]}>
          {completed && (
            <Ionicons name="checkmark" size={15} color={DESIGN.colors.text} />
          )}
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, completed && styles.titleDone]}>
            {title}
          </Text>
          {meta && <Text style={styles.meta}>{meta}</Text>}
        </View>
      </TouchableOpacity>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} hitSlop={10}>
          <Ionicons name="close" size={19} color={DESIGN.colors.textDim} />
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
    borderBottomColor: DESIGN.colors.border,
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
    borderColor: DESIGN.colors.borderStrong,
    borderRadius: 11,
  },
  checkDone: {
    borderColor: DESIGN.colors.secondary,
    backgroundColor: DESIGN.colors.secondary,
  },
  textWrap: {
    flex: 1,
    marginLeft: 13,
  },
  title: {
    color: DESIGN.colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  titleDone: {
    color: DESIGN.colors.textDim,
    textDecorationLine: "line-through",
  },
  meta: {
    marginTop: 2,
    color: DESIGN.colors.textDim,
    fontSize: 12,
  },
});
