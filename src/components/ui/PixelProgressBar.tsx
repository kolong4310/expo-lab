import React from "react";
import { StyleSheet, View } from "react-native";
import { DESIGN } from "../../theme/design";

type PixelProgressBarProps = {
  value: number;
  blocks?: number;
};

export default function PixelProgressBar({ value }: PixelProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%` as `${number}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: DESIGN.colors.bgSecondary,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: DESIGN.colors.primary,
  },
});
