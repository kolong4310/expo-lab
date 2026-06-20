import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "../components/FadeInView";
import LanguageOptionList from "../components/LanguageOptionList";
import TinySprout from "../components/TinySprout";
import { AppLanguage } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

export default function LanguageSelectScreen(
  _props: RootStackScreenProps<"LanguageSelect">,
) {
  const { setLanguage, t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;

  const handleSelect = (language: AppLanguage) => {
    setLanguage(language);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.backgroundBlob, styles.backgroundBlobMint]} />
        <View style={[styles.backgroundBlob, styles.backgroundBlobYellow]} />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.sproutBadge,
              {
                backgroundColor:
                  mode === "light"
                    ? LIGHT_PASTEL.mint
                    : theme.colors.surfaceAlt,
              },
            ]}
          >
            <TinySprout size={48} />
          </View>
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
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobMint: {
    top: -70,
    right: -90,
    width: 260,
    height: 260,
    backgroundColor: "rgba(221,242,210,0.68)",
  },
  backgroundBlobYellow: {
    bottom: -80,
    left: -100,
    width: 250,
    height: 250,
    backgroundColor: "rgba(255,230,184,0.46)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 28,
  },
  sproutBadge: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 28,
    transform: [{ rotate: "-2deg" }],
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
