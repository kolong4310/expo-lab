import React from "react";
import { StyleSheet, View } from "react-native";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";

interface TinySproutProps {
  size?: number;
  leafColor?: string;
  seedColor?: string;
}

export default function TinySprout({
  size = 48,
  leafColor,
  seedColor,
}: TinySproutProps) {
  const { theme } = useAppTheme();
  const resolvedLeafColor = leafColor ?? theme.colors.success;
  const resolvedSeedColor = seedColor ?? theme.colors.warning;
  const leafWidth = size * 0.33;
  const leafHeight = size * 0.22;
  const stemWidth = Math.max(3, size * 0.08);
  const stemHeight = size * 0.38;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.leafRow, { height: leafHeight * 1.4 }]}>
        <View
          style={[
            styles.leaf,
            styles.leftLeaf,
            {
              width: leafWidth,
              height: leafHeight,
              borderTopLeftRadius: leafHeight,
              borderBottomRightRadius: leafHeight,
              backgroundColor: resolvedLeafColor,
            },
          ]}
        />
        <View
          style={[
            styles.leaf,
            styles.rightLeaf,
            {
              width: leafWidth,
              height: leafHeight,
              borderTopRightRadius: leafHeight,
              borderBottomLeftRadius: leafHeight,
              backgroundColor: resolvedLeafColor,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.stem,
          {
            width: stemWidth,
            height: stemHeight,
            borderRadius: stemWidth,
            backgroundColor: resolvedLeafColor,
          },
        ]}
      />
      <View
        style={[
          styles.seed,
          {
            width: size * 0.72,
            height: size * 0.18,
            borderRadius: size,
            backgroundColor: resolvedSeedColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  leafRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  leaf: {
    opacity: 0.96,
  },
  leftLeaf: {
    transform: [{ rotate: "-18deg" }],
  },
  rightLeaf: {
    marginLeft: -3,
    transform: [{ rotate: "18deg" }],
  },
  stem: {
    marginTop: -2,
  },
  seed: {
    marginTop: -2,
    opacity: 0.22,
  },
});
