import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import FadeInView from "../components/FadeInView";
import LanguageOptionList from "../components/LanguageOptionList";
import RetroCard from "../components/ui/RetroCard";
import ThemeOptionList from "../components/ThemeOptionList";
import { LANGUAGE_OPTIONS } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";

export default function SettingsScreen(
  _props: BottomTabScreenProps<"Settings">,
) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useTranslation();
  const { mode, setThemeMode, theme } = useAppTheme();
  const currentLanguage = LANGUAGE_OPTIONS.find(
    (item) => item.code === language,
  );
  const currentThemeLabel =
    mode === "dark" ? t("settings.themeDark") : t("settings.themeLight");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title={t("settings.title")}
          subtitle={t("settings.subtitle")}
          compact
        />

        <FadeInView>
          <RetroCard style={styles.currentCard}>
            <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>
              {t("settings.currentLanguage")}
            </Text>
            <Text style={[styles.currentValue, { color: theme.colors.text }]}>
              {currentLanguage?.nativeLabel ?? language}
            </Text>
          </RetroCard>
        </FadeInView>

        <FadeInView delay={60}>
          <RetroCard style={styles.currentCard}>
            <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>
              {t("settings.currentTheme")}
            </Text>
            <Text style={[styles.currentValue, { color: theme.colors.text }]}>
              {currentThemeLabel}
            </Text>
          </RetroCard>
        </FadeInView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("settings.appearance")}
          </Text>
          <Text
            style={[styles.sectionDescription, { color: theme.colors.muted }]}
          >
            {t("settings.appearanceSubtitle")}
          </Text>
        </View>

        <FadeInView delay={100}>
          <ThemeOptionList selectedMode={mode} onSelect={setThemeMode} />
        </FadeInView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t("settings.language")}
          </Text>
          <Text
            style={[styles.sectionDescription, { color: theme.colors.muted }]}
          >
            {t("settings.changeLanguage")}
          </Text>
        </View>

        <FadeInView delay={140}>
          <LanguageOptionList
            selectedLanguage={language}
            onSelect={(nextLanguage) => {
              setLanguage(nextLanguage);
            }}
          />
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  currentCard: {
    marginBottom: 24,
    padding: 20,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  currentValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  sectionDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 20,
  },
});
