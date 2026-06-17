import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RetroCard from "../components/ui/RetroCard";
import { AppLanguage, LANGUAGE_OPTIONS } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";

const LANGUAGE_ICONS: Record<AppLanguage, keyof typeof Ionicons.glyphMap> = {
  ko: "ellipse",
  en: "ellipse-outline",
  ja: "radio-button-on",
  zh: "radio-button-off",
};

export default function LanguageSelectScreen(
  _props: RootStackScreenProps<"LanguageSelect">,
) {
  const { setLanguage, t } = useTranslation();

  const handleSelect = (language: AppLanguage) => {
    setLanguage(language);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("language.title")}</Text>
          <Text style={styles.description}>{t("language.description")}</Text>
        </View>

        <RetroCard style={styles.card}>
          {LANGUAGE_OPTIONS.map((language, index) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageButton,
                index < LANGUAGE_OPTIONS.length - 1 && styles.buttonBorder,
              ]}
              activeOpacity={0.78}
              onPress={() => handleSelect(language.code)}
            >
              <View style={styles.languageIcon}>
                <Ionicons
                  name={LANGUAGE_ICONS[language.code]}
                  size={16}
                  color={DESIGN.colors.primaryLight}
                />
              </View>
              <Text style={styles.languageLabel}>{language.nativeLabel}</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={DESIGN.colors.textDim}
              />
            </TouchableOpacity>
          ))}
        </RetroCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.text,
  },
  description: {
    marginTop: 8,
    color: DESIGN.colors.textDim,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  languageButton: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
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
  languageLabel: {
    flex: 1,
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
});
