import React from "react";
import { StyleSheet, View } from "react-native";
import { DESIGN } from "../../theme/design";
import { useAppTheme } from "../../theme/useAppTheme";

type PixelProgressBarProps = {
  value: number;
  blocks?: number;
};

export default function PixelProgressBar({ value }: PixelProgressBarProps) {
  const { theme } = useAppTheme();
  const width = `${Math.max(0, Math.min(100, value))}%` as `${number}%`;

  return (
    <View style={[styles.track, { backgroundColor: theme.colors.surfaceAlt }]}>
      <View
        style={[
          styles.fill,
          {
            width,
            backgroundColor: theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    overflow: "hidden",
    borderRadius: 999,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
