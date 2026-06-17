import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import LanguageOptionList from "../components/LanguageOptionList";
import RetroCard from "../components/ui/RetroCard";
import { LANGUAGE_OPTIONS } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";

export default function SettingsScreen(
  _props: BottomTabScreenProps<"Settings">,
) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useTranslation();
  const currentLanguage = LANGUAGE_OPTIONS.find(
    (item) => item.code === language,
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
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

        <RetroCard style={styles.currentCard}>
          <Text style={styles.cardLabel}>{t("settings.currentLanguage")}</Text>
          <Text style={styles.currentValue}>
            {currentLanguage?.nativeLabel ?? language}
          </Text>
        </RetroCard>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
          <Text style={styles.sectionDescription}>
            {t("settings.changeLanguage")}
          </Text>
        </View>

        <LanguageOptionList
          selectedLanguage={language}
          onSelect={(nextLanguage) => {
            setLanguage(nextLanguage);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
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
    color: DESIGN.colors.textDim,
    fontSize: 13,
    fontWeight: "600",
  },
  currentValue: {
    marginTop: 8,
    color: DESIGN.colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  sectionDescription: {
    marginTop: 5,
    color: DESIGN.colors.textDim,
    fontSize: 13,
    lineHeight: 20,
  },
});
