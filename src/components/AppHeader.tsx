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
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

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
  const { mode, theme } = useAppTheme();

  if (onBack || right || onHome) {
    return (
      <View style={styles.navigationHeader}>
        <View style={styles.side}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              hitSlop={10}
              style={[
                styles.iconButton,
                mode === "light" && styles.lightIconButton,
              ]}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={[
            styles.navigationTitle,
            { color: theme.colors.text },
            titleStyle,
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <View style={[styles.side, styles.right]}>
          <View style={styles.rightActions}>
            {right}
            {onHome && (
              <TouchableOpacity
                onPress={onHome}
                hitSlop={10}
                style={[
                  styles.iconButton,
                  mode === "light" && styles.lightIconButton,
                ]}
                accessibilityLabel="홈으로 이동"
              >
                <Ionicons
                  name="home-outline"
                  size={21}
                  color={theme.colors.muted}
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
      <Text
        style={[styles.screenTitle, { color: theme.colors.text }, titleStyle]}
      >
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          {subtitle}
        </Text>
      )}
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
  },
  subtitle: {
    marginTop: 5,
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
    minWidth: 40,
  },
  right: {
    alignItems: "flex-end",
    marginLeft: 8,
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
  lightIconButton: {
    borderWidth: 1,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 16,
    backgroundColor: LIGHT_PASTEL.paper,
  },
  navigationTitle: {
    flex: 1,
    flexShrink: 1,
    marginHorizontal: 8,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
  },
});
