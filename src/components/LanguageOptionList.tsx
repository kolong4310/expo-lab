import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppLanguage, LANGUAGE_OPTIONS } from "../i18n/languages";
import { DESIGN } from "../theme/design";
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
  return (
    <RetroCard style={styles.card}>
      {LANGUAGE_OPTIONS.map((language, index) => {
        const selected = selectedLanguage === language.code;

        return (
          <AnimatedPressable
            key={language.code}
            style={[
              styles.languageButton,
              selected && styles.languageButtonSelected,
              index < LANGUAGE_OPTIONS.length - 1 && styles.buttonBorder,
            ]}
            pressedScale={0.98}
            onPress={() => onSelect(language.code)}
          >
            <View
              style={[styles.languageIcon, selected && styles.selectedIcon]}
            >
              <Ionicons
                name={selected ? "checkmark" : LANGUAGE_ICONS[language.code]}
                size={16}
                color={
                  selected ? DESIGN.colors.text : DESIGN.colors.primaryLight
                }
              />
            </View>
            <Text style={styles.languageLabel}>{language.nativeLabel}</Text>
            <Ionicons
              name={selected ? "checkmark-circle" : "chevron-forward"}
              size={18}
              color={selected ? DESIGN.colors.success : DESIGN.colors.textDim}
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
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
  },
  languageButtonSelected: {
    backgroundColor: "rgba(108,99,255,0.08)",
  },
  buttonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  languageIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 17,
    backgroundColor: "rgba(108,99,255,0.14)",
  },
  selectedIcon: {
    backgroundColor: DESIGN.colors.primary,
  },
  languageLabel: {
    flex: 1,
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
});
