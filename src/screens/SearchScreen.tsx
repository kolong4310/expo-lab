import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnimatedPressable from "../components/AnimatedPressable";
import AppHeader from "../components/AppHeader";
import LogCard from "../components/LogCard";
import RetroInput from "../components/ui/RetroInput";
import { searchLogs } from "../database/repositories/logsRepository";
import { WorkLog } from "../database/types";
import { useTranslation } from "../i18n/useTranslation";
import { goHome } from "../navigation/homeNavigation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

const POPULAR_TAGS = ["ReactNative", "SQLite", "UI", "공부", "운동", "개발"];
const LIGHT_TAG_COLORS = [
  LIGHT_PASTEL.mint,
  LIGHT_PASTEL.yellow,
  LIGHT_PASTEL.blue,
  LIGHT_PASTEL.pink,
];

export default function SearchScreen({
  navigation,
}: BottomTabScreenProps<"Search">) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
  const [keyword, setKeyword] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<WorkLog[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const refreshResults = useCallback(() => {
    const query = keyword.trim();
    setResults(query ? searchLogs(query) : []);
  }, [keyword]);

  useEffect(() => {
    refreshResults();
  }, [refreshResults]);

  useFocusEffect(
    useCallback(() => {
      refreshResults();
    }, [refreshResults]),
  );

  const submitSearch = () => {
    const query = keyword.trim();
    if (!query) return;
    setRecentSearches((current) =>
      [query, ...current.filter((item) => item !== query)].slice(0, 5),
    );
  };

  const selectKeyword = (value: string) => {
    setKeyword(value);
    setRecentSearches((current) =>
      [value, ...current.filter((item) => item !== value)].slice(0, 5),
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.backgroundBlob, styles.backgroundBlobMint]} />
        <View style={[styles.backgroundBlob, styles.backgroundBlobBlue]} />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <LogCard
            log={item}
            onPress={() => {
              if (item.id !== undefined) {
                navigation.navigate("Detail", {
                  logId: item.id,
                  returnTo: "Search",
                });
              }
            }}
          />
        )}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? `${item.date}-${index}`
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 110 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AppHeader
              title={t("search.title")}
              onHome={() => goHome(navigation)}
            />
            <View
              style={[
                styles.searchWrap,
                {
                  borderColor:
                    mode === "light"
                      ? isSearchFocused
                        ? LIGHT_PASTEL.greenStrong
                        : LIGHT_PASTEL.line
                      : isSearchFocused
                        ? theme.colors.primary
                        : theme.colors.border,
                  backgroundColor:
                    mode === "light"
                      ? isSearchFocused
                        ? LIGHT_PASTEL.paper
                        : LIGHT_PASTEL.paperWarm
                      : theme.colors.surface,
                },
                mode === "light" && styles.lightSearchWrap,
                mode === "light" &&
                  isSearchFocused &&
                  styles.lightSearchWrapFocused,
              ]}
            >
              <Ionicons name="search" size={19} color={theme.colors.muted} />
              <RetroInput
                style={styles.searchInput}
                value={keyword}
                onChangeText={setKeyword}
                placeholder={t("search.placeholder")}
                returnKeyType="search"
                onSubmitEditing={submitSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {keyword.length > 0 && (
                <TouchableOpacity onPress={() => setKeyword("")} hitSlop={10}>
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={theme.colors.muted}
                  />
                </TouchableOpacity>
              )}
            </View>

            {recentSearches.length > 0 && (
              <>
                <View style={styles.sectionHeading}>
                  <Text
                    style={[styles.sectionTitle, { color: theme.colors.text }]}
                  >
                    {t("search.recent")}
                  </Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text
                      style={[styles.clearText, { color: theme.colors.muted }]}
                    >
                      {t("search.clear")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipGrid}>
                  {recentSearches.map((item) => (
                    <AnimatedPressable
                      key={item}
                      style={[
                        styles.recentChip,
                        mode === "light" && styles.lightRecentChip,
                      ]}
                      onPress={() => selectKeyword(item)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={theme.colors.muted}
                      />
                      <Text
                        style={[
                          styles.recentText,
                          { color: theme.colors.text },
                        ]}
                      >
                        {item}
                      </Text>
                    </AnimatedPressable>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t("search.popularTags")}
            </Text>
            <View style={styles.chipGrid}>
              {POPULAR_TAGS.map((tag, index) => (
                <AnimatedPressable
                  key={tag}
                  style={[
                    styles.tagChip,
                    mode === "light" && {
                      borderColor: LIGHT_PASTEL.line,
                      backgroundColor:
                        index % 2 === 0
                          ? LIGHT_PASTEL.paper
                          : LIGHT_TAG_COLORS[index % LIGHT_TAG_COLORS.length],
                    },
                    mode === "light" && styles.lightTagChip,
                  ]}
                  onPress={() => selectKeyword(tag)}
                >
                  <Ionicons
                    name="pricetag-outline"
                    size={13}
                    color={
                      mode === "light"
                        ? LIGHT_PASTEL.greenText
                        : theme.colors.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color:
                          mode === "light"
                            ? LIGHT_PASTEL.greenText
                            : theme.colors.secondary,
                      },
                    ]}
                  >
                    #{tag}
                  </Text>
                </AnimatedPressable>
              ))}
            </View>

            <View style={styles.resultHeading}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t("search.results")}
              </Text>
              {keyword.length > 0 && (
                <Text style={[styles.count, { color: theme.colors.muted }]}>
                  {t("search.count", { count: results.length })}
                </Text>
              )}
            </View>
            {keyword.length === 0 && (
              <View
                style={[
                  styles.emptyCard,
                  mode === "light" && styles.lightEmptyCard,
                ]}
              >
                <View
                  style={[
                    styles.emptyIcon,
                    {
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.yellow
                          : theme.colors.surfaceAlt,
                    },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={22}
                    color={theme.colors.warning}
                  />
                </View>
                <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                  {t("search.emptyPrompt")}
                </Text>
              </View>
            )}
            {keyword.length > 0 && results.length === 0 && (
              <View
                style={[
                  styles.emptyCard,
                  mode === "light" && styles.lightEmptyCard,
                ]}
              >
                <View
                  style={[
                    styles.emptyIcon,
                    {
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.blue
                          : theme.colors.surfaceAlt,
                    },
                  ]}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color={theme.colors.secondary}
                  />
                </View>
                <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                  {t("search.emptyResult")}
                </Text>
              </View>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobMint: {
    top: 40,
    right: -120,
    width: 260,
    height: 260,
    backgroundColor: "rgba(221,242,210,0.58)",
  },
  backgroundBlobBlue: {
    bottom: 80,
    left: -120,
    width: 250,
    height: 250,
    backgroundColor: "rgba(220,233,247,0.52)",
  },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    marginBottom: 28,
    borderWidth: 2,
    borderRadius: 28,
    paddingHorizontal: 16,
  },
  lightSearchWrap: {
    borderWidth: 2,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  lightSearchWrapFocused: {
    shadowColor: LIGHT_PASTEL.greenStrong,
    shadowOpacity: 0.11,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  clearText: { fontSize: 12, fontWeight: "600" },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 28,
  },
  recentChip: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.line,
    borderRadius: DESIGN.radius.pill,
    backgroundColor: LIGHT_PASTEL.paper,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  lightRecentChip: {
    borderColor: LIGHT_PASTEL.greenStrong,
    backgroundColor: LIGHT_PASTEL.greenSoft,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  recentText: {
    flexShrink: 1,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  tagChip: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.line,
    borderRadius: DESIGN.radius.pill,
    backgroundColor: LIGHT_PASTEL.paper,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  lightTagChip: {
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  tagText: {
    flexShrink: 1,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  resultHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  count: { fontSize: 12, fontWeight: "600" },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyCard: {
    alignItems: "center",
    marginBottom: 20,
    padding: 24,
    borderWidth: 1,
    borderRadius: 26,
  },
  lightEmptyCard: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    backgroundColor: LIGHT_PASTEL.paperWarm,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 18,
    transform: [{ rotate: "-3deg" }],
  },
});
