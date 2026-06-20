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
import { LANGUAGE_OPTIONS } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

export default function SettingsScreen(
  _props: BottomTabScreenProps<"Settings">,
) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
  const currentLanguage = LANGUAGE_OPTIONS.find(
    (item) => item.code === language,
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.backgroundBlob, styles.backgroundBlobBlue]} />
        <View style={[styles.backgroundBlob, styles.backgroundBlobPeach]} />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
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
          <RetroCard
            style={[
              styles.currentCard,
              mode === "light" && { backgroundColor: LIGHT_PASTEL.mint },
            ]}
          >
            <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>
              {t("settings.currentLanguage")}
            </Text>
            <Text style={[styles.currentValue, { color: theme.colors.text }]}>
              {currentLanguage?.nativeLabel ?? language}
            </Text>
          </RetroCard>
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

        <FadeInView delay={60}>
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
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobBlue: {
    top: 50,
    right: -120,
    width: 260,
    height: 260,
    backgroundColor: "rgba(220,233,247,0.48)",
  },
  backgroundBlobPeach: {
    bottom: 100,
    left: -120,
    width: 250,
    height: 250,
    backgroundColor: "rgba(247,221,191,0.38)",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  currentCard: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 26,
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
