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
      <View style={styles.dots}>
        {Array.from({ length: 8 }, (_, index) => (
          <View key={index} style={styles.dot} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  title: {
    fontFamily: DESIGN.fonts.title,
    color: DESIGN.colors.yellow,
    fontWeight: "900",
    letterSpacing: 1.2,
    fontSize: 15,
  },
  dots: {
    flexDirection: "row",
    marginTop: 7,
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: DESIGN.colors.cyan,
    marginRight: 6,
  },
});
