import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { DESIGN } from "../../theme/design";

type PixelSectionTitleProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default function PixelSectionTitle({
  children,
  style,
}: PixelSectionTitleProps) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, style]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  title: {
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
