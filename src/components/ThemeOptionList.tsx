import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TranslationKey } from "../i18n/translations";
import { useTranslation } from "../i18n/useTranslation";
import { AppThemeMode } from "../theme/theme";
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";
import AnimatedPressable from "./AnimatedPressable";
import RetroCard from "./ui/RetroCard";

const THEME_OPTIONS: {
  mode: AppThemeMode;
  labelKey: TranslationKey;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { mode: "dark", labelKey: "settings.themeDark", icon: "moon-outline" },
  { mode: "light", labelKey: "settings.themeLight", icon: "sunny-outline" },
];

interface ThemeOptionListProps {
  selectedMode: AppThemeMode;
  onSelect: (mode: AppThemeMode) => void;
}

export default function ThemeOptionList({
  selectedMode,
  onSelect,
}: ThemeOptionListProps) {
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();

  return (
    <RetroCard
      style={[
        styles.card,
        mode === "light" && { backgroundColor: LIGHT_PASTEL.paperWarm },
      ]}
    >
      {THEME_OPTIONS.map((item, index) => {
        const selected = selectedMode === item.mode;

        return (
          <AnimatedPressable
            key={item.mode}
            style={[
              styles.optionButton,
              selected && {
                backgroundColor:
                  mode === "light"
                    ? LIGHT_PASTEL.greenSoft
                    : `${theme.colors.primary}14`,
              },
              index < THEME_OPTIONS.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              },
            ]}
            pressedScale={0.98}
            onPress={() => onSelect(item.mode)}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor:
                    mode === "light"
                      ? LIGHT_PASTEL.blue
                      : `${theme.colors.primary}24`,
                },
                selected && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Ionicons
                name={selected ? "checkmark" : item.icon}
                size={17}
                color={
                  selected
                    ? theme.mode === "light"
                      ? theme.colors.surface
                      : theme.colors.text
                    : mode === "light"
                      ? LIGHT_PASTEL.greenText
                      : theme.colors.secondary
                }
              />
            </View>
            <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
              {t(item.labelKey)}
            </Text>
            <Ionicons
              name={selected ? "checkmark-circle" : "chevron-forward"}
              size={18}
              color={selected ? theme.colors.success : theme.colors.muted}
            />
          </AnimatedPressable>
        );
      })}
    </RetroCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  optionButton: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 18,
  },
  iconWrap: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 17,
  },
  optionLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
});
