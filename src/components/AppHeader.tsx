import { Ionicons } from "@expo/vector-icons";
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
  compact?: boolean;
  onBack?: () => void;
  onHome?: () => void;
  right?: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
}

export default function AppHeader({
  title,
  subtitle,
  compact = false,
  onBack,
  onHome,
  right,
  titleStyle,
}: AppHeaderProps) {
  if (onBack || right || onHome) {
    return (
      <View style={styles.navigationHeader}>
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              hitSlop={10}
              style={styles.iconButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={DESIGN.colors.text}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.navigationTitle, titleStyle]}>{title}</Text>
        <View style={[styles.side, styles.right]}>
          <View style={styles.rightActions}>
            {right}
            {onHome && (
              <TouchableOpacity
                onPress={onHome}
                hitSlop={10}
                style={styles.iconButton}
                accessibilityLabel="홈으로 이동"
              >
                <Ionicons
                  name="home-outline"
                  size={21}
                  color={DESIGN.colors.textDim}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screenHeader, compact && styles.screenHeaderCompact]}>
      <Text style={[styles.screenTitle, titleStyle]}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screenHeader: {
    marginBottom: 24,
  },
  screenHeaderCompact: {
    marginBottom: 18,
  },
  screenTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.text,
  },
  subtitle: {
    marginTop: 5,
    color: DESIGN.colors.textDim,
    fontSize: 14,
    fontWeight: "500",
  },
  navigationHeader: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  side: {
    width: 116,
  },
  right: {
    alignItems: "flex-end",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationTitle: {
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
});
