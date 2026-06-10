import React, { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { DESIGN } from "../theme/design";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  accent?: string;
  onBack?: () => void;
  right?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
}

export default function AppHeader({
  title,
  subtitle,
  accent = DESIGN.colors.primary,
  onBack,
  right,
  titleStyle,
}: AppHeaderProps) {
  if (onBack || right) {
    return (
      <View style={styles.navigationHeader}>
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={10}>
              <Text style={styles.backText}>뒤로</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.navigationTitle, { color: accent }, titleStyle]}>
          {title}
        </Text>
        <View style={[styles.side, styles.right]}>{right}</View>
      </View>
    );
  }

  return (
    <View style={styles.screenHeader}>
      <Text style={[styles.screenTitle, { color: accent }, titleStyle]}>
        {title}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screenHeader: {
    marginBottom: 24,
  },
  screenTitle: {
    ...DESIGN.typography.largeTitle,
  },
  subtitle: {
    marginTop: 6,
    color: DESIGN.colors.textDim,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
  },
  navigationHeader: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: DESIGN.borders.heavy,
    borderBottomColor: DESIGN.colors.cyan,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  side: {
    width: 76,
  },
  right: {
    alignItems: "flex-end",
  },
  backText: {
    color: DESIGN.colors.cyan,
    fontFamily: DESIGN.fonts.title,
    fontWeight: "900",
  },
  navigationTitle: {
    fontFamily: DESIGN.fonts.title,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
