import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppLanguage, LANGUAGE_OPTIONS } from "../i18n/languages";
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";
import AnimatedPressable from "./AnimatedPressable";
import RetroCard from "./ui/RetroCard";

const LANGUAGE_ICONS: Record<AppLanguage, keyof typeof Ionicons.glyphMap> = {
  ko: "ellipse",
  en: "ellipse-outline",
  ja: "radio-button-on",
  zh: "radio-button-off",
};

interface LanguageOptionListProps {
  selectedLanguage?: AppLanguage | null;
  onSelect: (language: AppLanguage) => void;
}

export default function LanguageOptionList({
  selectedLanguage,
  onSelect,
}: LanguageOptionListProps) {
  const { mode, theme } = useAppTheme();

  return (
    <RetroCard
      style={[
        styles.card,
        mode === "light" && { backgroundColor: LIGHT_PASTEL.paperWarm },
      ]}
    >
      {LANGUAGE_OPTIONS.map((language) => {
        const selected = selectedLanguage === language.code;

        return (
          <AnimatedPressable
            key={language.code}
            style={[
              styles.languageButton,
              {
                borderColor:
                  mode === "light" ? LIGHT_PASTEL.line : theme.colors.border,
                backgroundColor:
                  mode === "light" ? LIGHT_PASTEL.paper : theme.colors.surface,
              },
              selected && {
                borderWidth: 2,
                backgroundColor:
                  mode === "light"
                    ? LIGHT_PASTEL.greenSoft
                    : `${theme.colors.primary}14`,
                borderColor:
                  mode === "light"
                    ? LIGHT_PASTEL.greenStrong
                    : theme.colors.primary,
              },
              mode === "light" && selected && styles.lightSelectedLanguage,
            ]}
            pressedScale={0.98}
            onPress={() => onSelect(language.code)}
          >
            <View
              style={[
                styles.languageIcon,
                {
                  backgroundColor:
                    mode === "light"
                      ? LIGHT_PASTEL.yellow
                      : `${theme.colors.primary}24`,
                },
                selected && { backgroundColor: theme.colors.primary },
              ]}
            >
              <Ionicons
                name={selected ? "checkmark" : LANGUAGE_ICONS[language.code]}
                size={16}
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
            <Text style={[styles.languageLabel, { color: theme.colors.text }]}>
              {language.nativeLabel}
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
  languageButton: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  languageIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 17,
  },
  languageLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23,
  },
  lightSelectedLanguage: {
    shadowColor: LIGHT_PASTEL.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 1,
  },
});
