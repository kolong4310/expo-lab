import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "../components/FadeInView";
import LanguageOptionList from "../components/LanguageOptionList";
import { AppLanguage } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";

export default function LanguageSelectScreen(
  _props: RootStackScreenProps<"LanguageSelect">,
) {
  const { setLanguage, t } = useTranslation();
  const { mode, theme } = useAppTheme();

  const handleSelect = (language: AppLanguage) => {
    setLanguage(language);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t("language.title")}
          </Text>
          <Text style={[styles.description, { color: theme.colors.muted }]}>
            {t("language.description")}
          </Text>
        </View>

        <FadeInView delay={80}>
          <LanguageOptionList onSelect={handleSelect} />
        </FadeInView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
});
