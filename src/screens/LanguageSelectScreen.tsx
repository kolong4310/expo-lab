import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageOptionList from "../components/LanguageOptionList";
import { AppLanguage } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";

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

        <LanguageOptionList onSelect={handleSelect} />
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
});
