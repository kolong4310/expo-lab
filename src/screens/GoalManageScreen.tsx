import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";
import PrimaryButton from "../components/PrimaryButton";
import PixelSectionTitle from "../components/ui/PixelSectionTitle";
import RetroCard from "../components/ui/RetroCard";
import RetroInput from "../components/ui/RetroInput";
import {
  addGoal,
  getAllGoals,
  updateGoal,
} from "../database/repositories/goalsRepository";
import { Goal } from "../database/types";
import { goHome } from "../navigation/homeNavigation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";

const CATEGORIES = ["건강", "공부", "일", "생활", "성장", "기타"];

export default function GoalManageScreen({
  navigation,
}: RootStackScreenProps<"GoalManage">) {
  const insets = useSafeAreaInsets();
  const { mode, theme } = useAppTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("성장");

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, []),
  );

  const loadGoals = () => {
    setGoals(getAllGoals());
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), selectedCategory);
    setNewTitle("");
    loadGoals();
  };

  const handleToggleActive = (item: Goal) => {
    updateGoal(
      item.id!,
      item.title,
      item.category,
      item.is_active === 1 ? 0 : 1,
    );
    loadGoals();
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <View
      style={[
        styles.goalRow,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.goalInfo}>
        <Text style={[styles.goalCategory, { color: theme.colors.muted }]}>
          {item.category}
        </Text>
        <Text
          style={[
            styles.goalTitle,
            { color: theme.colors.text },
            item.is_active === 0 && { color: theme.colors.muted },
          ]}
        >
          {item.title}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleToggleActive(item)}
        style={[
          styles.switchBox,
          { backgroundColor: theme.colors.surfaceAlt },
          item.is_active === 1 && {
            backgroundColor: `${theme.colors.primary}29`,
          },
        ]}
      >
        <Text style={[styles.switchText, { color: theme.colors.success }]}>
          {item.is_active === 1 ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id?.toString() || ""}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 30 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AppHeader
              title="반복 목표 관리"
              onBack={() => navigation.goBack()}
              onHome={() => goHome(navigation)}
            />

            <RetroCard style={styles.addPanel}>
              <PixelSectionTitle>새 반복 목표</PixelSectionTitle>
              <RetroInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="매일 반복할 목표 입력"
                returnKeyType="done"
                onSubmitEditing={handleAdd}
                style={styles.input}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryRow}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catChip,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.surfaceAlt,
                      },
                      selectedCategory === cat && {
                        borderColor: theme.colors.primary,
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catText,
                        { color: theme.colors.text },
                        selectedCategory === cat &&
                          mode === "light" && { color: theme.colors.surface },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <PrimaryButton label="반복 목표 추가" onPress={handleAdd} />
            </RetroCard>

            <PixelSectionTitle>반복 목표 목록</PixelSectionTitle>
          </>
        }
        ListEmptyComponent={
          <RetroCard style={styles.emptyCard}>
            <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
              등록된 반복 목표가 없습니다.
            </Text>
          </RetroCard>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  addPanel: {
    padding: 20,
    marginBottom: 28,
  },
  input: {
    marginBottom: 14,
  },
  categoryRow: {
    marginBottom: 16,
  },
  catChip: {
    borderWidth: 1,
    borderRadius: DESIGN.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  catText: {
    fontWeight: "600",
    fontSize: 13,
  },
  goalRow: {
    borderWidth: 1,
    borderRadius: DESIGN.radius.card,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  goalInfo: {
    flex: 1,
  },
  goalCategory: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
  },
  goalTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  switchBox: {
    minWidth: 58,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: DESIGN.radius.pill,
  },
  switchText: {
    fontWeight: "700",
    fontSize: 12,
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {},
});
