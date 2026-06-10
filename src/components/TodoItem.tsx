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
        activeOpacity={0.75}
      >
        <View style={[styles.check, completed && styles.checkDone]}>
          {completed && <View style={styles.checkInner} />}
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
          <Text style={styles.delete}>삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: DESIGN.borders.pixel,
    borderColor: "#343B49",
    backgroundColor: "#090B10",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  toggleArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  check: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.textDim,
    backgroundColor: DESIGN.colors.bg,
  },
  checkDone: {
    borderColor: DESIGN.colors.green,
  },
  checkInner: {
    width: 12,
    height: 12,
    backgroundColor: DESIGN.colors.green,
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: DESIGN.colors.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },
  titleDone: {
    color: DESIGN.colors.green,
    textDecorationLine: "line-through",
  },
  meta: {
    marginTop: 2,
    color: DESIGN.colors.textDim,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 11,
  },
  delete: {
    paddingLeft: 10,
    color: DESIGN.colors.error,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 12,
    fontWeight: "900",
  },
});
