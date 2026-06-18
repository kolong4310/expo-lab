import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { DESIGN } from "../../theme/design";
import { useAppTheme } from "../../theme/useAppTheme";

type PixelSectionTitleProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default function PixelSectionTitle({
  children,
  style,
}: PixelSectionTitleProps) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.colors.text }, style]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
