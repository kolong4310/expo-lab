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
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

const CATEGORIES = ["건강", "공부", "일", "생활", "성장", "기타"];

export default function GoalManageScreen({
  navigation,
}: RootStackScreenProps<"GoalManage">) {
  const insets = useSafeAreaInsets();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
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
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.paper : theme.colors.surface,
        },
        mode === "light" && styles.lightGoalRow,
        item.is_active === 0 &&
          mode === "light" && { backgroundColor: LIGHT_PASTEL.paperWarm },
      ]}
    >
      <View style={styles.goalInfo}>
        <Text
          style={[
            styles.goalCategory,
            { color: theme.colors.muted },
            mode === "light" && styles.lightGoalCategory,
          ]}
        >
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
          {
            backgroundColor:
              mode === "light" ? LIGHT_PASTEL.blue : theme.colors.surfaceAlt,
          },
          item.is_active === 1 && {
            backgroundColor:
              mode === "light"
                ? LIGHT_PASTEL.greenSoft
                : `${theme.colors.primary}29`,
          },
        ]}
      >
        <Text
          style={[
            styles.switchText,
            {
              color:
                mode === "light"
                  ? LIGHT_PASTEL.greenText
                  : theme.colors.success,
            },
          ]}
        >
          {item.is_active === 1 ? "ON" : "OFF"}
        </Text>
      </TouchableOpacity>
    </View>
  );

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

            <RetroCard
              style={[
                styles.addPanel,
                mode === "light" && styles.lightAddPanel,
              ]}
            >
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
                        borderColor:
                          mode === "light"
                            ? LIGHT_PASTEL.border
                            : theme.colors.border,
                        backgroundColor:
                          mode === "light"
                            ? LIGHT_PASTEL.paper
                            : theme.colors.surfaceAlt,
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
          <RetroCard
            style={[
              styles.emptyCard,
              mode === "light" && styles.lightEmptyCard,
            ]}
          >
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
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobMint: {
    top: 70,
    right: -120,
    width: 260,
    height: 260,
    backgroundColor: "rgba(221,242,210,0.52)",
  },
  backgroundBlobYellow: {
    bottom: 80,
    left: -120,
    width: 250,
    height: 250,
    backgroundColor: "rgba(255,230,184,0.4)",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  addPanel: {
    padding: 20,
    marginBottom: 28,
  },
  lightAddPanel: {
    borderRadius: 28,
    backgroundColor: LIGHT_PASTEL.yellow,
  },
  input: {
    marginBottom: 14,
  },
  categoryRow: {
    marginBottom: 16,
  },
  catChip: {
    borderWidth: 1.5,
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
  lightGoalRow: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 26,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  goalInfo: {
    flex: 1,
    minWidth: 0,
  },
  goalCategory: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
  },
  lightGoalCategory: {
    alignSelf: "flex-start",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: LIGHT_PASTEL.blue,
  },
  goalTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  switchBox: {
    flexShrink: 0,
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
  lightEmptyCard: {
    borderRadius: 26,
    backgroundColor: LIGHT_PASTEL.paperWarm,
  },
  emptyText: {},
});
