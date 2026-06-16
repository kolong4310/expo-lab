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
import AppHeader from "../components/AppHeader";
import LogCard from "../components/LogCard";
import RetroInput from "../components/ui/RetroInput";
import { searchLogs } from "../database/repositories/logsRepository";
import { WorkLog } from "../database/types";
import { goHome } from "../navigation/homeNavigation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";

const POPULAR_TAGS = ["ReactNative", "SQLite", "UI", "공부", "운동", "개발"];

export default function SearchScreen({
  navigation,
}: BottomTabScreenProps<"Search">) {
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<WorkLog[]>([]);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
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
            <AppHeader title="검색" onHome={() => goHome(navigation)} />
            <View style={styles.searchWrap}>
              <Ionicons name="search" size={19} color={DESIGN.colors.textDim} />
              <RetroInput
                style={styles.searchInput}
                value={keyword}
                onChangeText={setKeyword}
                placeholder="기록 또는 태그 검색"
                returnKeyType="search"
                onSubmitEditing={submitSearch}
              />
              {keyword.length > 0 && (
                <TouchableOpacity onPress={() => setKeyword("")} hitSlop={10}>
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={DESIGN.colors.textDim}
                  />
                </TouchableOpacity>
              )}
            </View>

            {recentSearches.length > 0 && (
              <>
                <View style={styles.sectionHeading}>
                  <Text style={styles.sectionTitle}>최근 검색</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text style={styles.clearText}>지우기</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipGrid}>
                  {recentSearches.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.recentChip}
                      onPress={() => selectKeyword(item)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={DESIGN.colors.textDim}
                      />
                      <Text style={styles.recentText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.sectionTitle}>인기 태그</Text>
            <View style={styles.chipGrid}>
              {POPULAR_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagChip}
                  onPress={() => selectKeyword(tag)}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.resultHeading}>
              <Text style={styles.sectionTitle}>검색 결과</Text>
              {keyword.length > 0 && (
                <Text style={styles.count}>{results.length}개</Text>
              )}
            </View>
            {keyword.length === 0 && (
              <Text style={styles.emptyText}>
                검색어를 입력하면 관련 기록이 표시됩니다.
              </Text>
            )}
            {keyword.length > 0 && results.length === 0 && (
              <Text style={styles.emptyText}>
                조건에 맞는 기록이 아직 없어요.
              </Text>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DESIGN.colors.bg },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: 18,
    backgroundColor: DESIGN.colors.surface,
    paddingHorizontal: 14,
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
  sectionTitle: { color: DESIGN.colors.text, fontSize: 17, fontWeight: "700" },
  clearText: { color: DESIGN.colors.textDim, fontSize: 12, fontWeight: "600" },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 28,
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.pill,
    backgroundColor: DESIGN.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  recentText: {
    marginLeft: 6,
    color: DESIGN.colors.text,
    fontSize: 13,
    fontWeight: "500",
  },
  tagChip: {
    borderRadius: DESIGN.radius.pill,
    backgroundColor: "rgba(108,99,255,0.14)",
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  tagText: {
    color: DESIGN.colors.primaryLight,
    fontSize: 13,
    fontWeight: "600",
  },
  resultHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  count: { color: DESIGN.colors.textDim, fontSize: 12, fontWeight: "600" },
  emptyText: {
    marginBottom: 20,
    color: DESIGN.colors.textDim,
    fontSize: 13,
    lineHeight: 20,
  },
});
