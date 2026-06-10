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

const CATEGORIES = ["건강", "공부", "일", "생활", "성장", "기타"];

export default function GoalManageScreen({
  navigation,
}: RootStackScreenProps<"GoalManage">) {
  const insets = useSafeAreaInsets();
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
    <View style={styles.goalRow}>
      <View style={styles.goalInfo}>
        <Text style={styles.goalCategory}>{item.category}</Text>
        <Text
          style={[
            styles.goalTitle,
            item.is_active === 0 && styles.disabledText,
          ]}
        >
          {item.title}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleToggleActive(item)}
        style={[styles.switchBox, item.is_active === 1 && styles.switchOn]}
      >
        <Text style={styles.switchText}>
          {item.is_active === 1 ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
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
                      selectedCategory === cat && styles.catChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catText,
                        selectedCategory === cat && styles.catTextSelected,
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
            <Text style={styles.emptyText}>등록된 반복 목표가 없습니다.</Text>
          </RetroCard>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
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
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.pill,
    backgroundColor: DESIGN.colors.bgSecondary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
  },
  catChipSelected: {
    borderColor: DESIGN.colors.primary,
    backgroundColor: DESIGN.colors.primary,
  },
  catText: {
    color: DESIGN.colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  catTextSelected: {
    color: DESIGN.colors.text,
  },
  goalRow: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
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
    color: DESIGN.colors.textDim,
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
  },
  goalTitle: {
    color: DESIGN.colors.text,
    fontWeight: "600",
    fontSize: 16,
  },
  disabledText: {
    color: DESIGN.colors.textDim,
  },
  switchBox: {
    minWidth: 58,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: DESIGN.radius.pill,
    backgroundColor: DESIGN.colors.bgSecondary,
  },
  switchOn: {
    backgroundColor: "rgba(34,197,94,0.18)",
  },
  switchText: {
    color: DESIGN.colors.success,
    fontWeight: "700",
    fontSize: 12,
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {
    color: DESIGN.colors.textDim,
  },
});
