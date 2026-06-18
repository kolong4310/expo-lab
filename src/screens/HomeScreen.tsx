import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AnimatedPressable from "../components/AnimatedPressable";
import AppHeader from "../components/AppHeader";
import FadeInView from "../components/FadeInView";
import PrimaryButton from "../components/PrimaryButton";
import TodoItem from "../components/TodoItem";
import PixelProgressBar from "../components/ui/PixelProgressBar";
import RetroCard from "../components/ui/RetroCard";
import RetroInput from "../components/ui/RetroInput";
import { useLogs } from "../hooks/useLogs";
import { useStats } from "../hooks/useStats";
import { useTodos } from "../hooks/useTodos";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { formatLocalDate } from "../utils/date";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function TrendChart({ values }: { values: number[] }) {
  const data = values.length === 7 ? values : Array(7).fill(0);

  return (
    <View style={styles.chart}>
      {data.map((value, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index - 1));

        return (
          <View key={index} style={styles.chartColumn}>
            <View style={styles.chartTrack}>
              <View
                style={[
                  styles.chartBar,
                  { height: `${Math.max(8, value)}%` as `${number}%` },
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>{WEEKDAYS[date.getDay()]}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen({
  navigation,
}: BottomTabScreenProps<"Today">) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const today = formatLocalDate();
  const todayDate = new Date();
  const dateLabel = `${today.replace(/-/g, ".")} ${WEEKDAYS[todayDate.getDay()]}요일`;
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const { todayLog, refreshLogs } = useLogs(today);
  const {
    dailyTodos,
    todayOnlyTodos,
    refreshTodos,
    addTodo,
    toggleDailyTodo,
    toggleTodayOnlyTodo,
    deleteTodo,
  } = useTodos(today);
  const { streak, stats, recentRates, weeklyRate, refreshStats } =
    useStats(today);

  const refreshHome = useCallback(() => {
    refreshLogs();
    refreshTodos();
    refreshStats();
  }, [refreshLogs, refreshStats, refreshTodos]);

  useFocusEffect(
    useCallback(() => {
      refreshHome();
    }, [refreshHome]),
  );

  const handleAddTodo = () => {
    const title = newTodoTitle.trim();
    if (!title) return;
    addTodo(title);
    setNewTodoTitle("");
    refreshStats();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader title={t("today.title")} subtitle={dateLabel} compact />

        <FadeInView>
          <RetroCard style={styles.streakCard}>
            <View style={styles.cardHeading}>
              <View>
                <Text style={styles.cardLabel}>{t("today.streak")}</Text>
                <View style={styles.streakValueRow}>
                  <Text style={styles.streakValue}>{streak}</Text>
                  <Text style={styles.streakUnit}>{t("today.dayUnit")}</Text>
                </View>
              </View>
              <View style={styles.streakIcon}>
                <Ionicons
                  name="flame"
                  size={21}
                  color={DESIGN.colors.warning}
                />
              </View>
            </View>
            <TrendChart values={recentRates} />
          </RetroCard>
        </FadeInView>

        <FadeInView delay={70}>
          <View style={styles.statsRow}>
            <RetroCard style={styles.statCard}>
              <Text style={styles.cardLabel}>{t("today.weeklyGrowth")}</Text>
              <Text style={styles.statValue}>{weeklyRate}%</Text>
              <PixelProgressBar value={weeklyRate} />
            </RetroCard>
            <RetroCard style={styles.statCard}>
              <Text style={styles.cardLabel}>{t("today.completionRate")}</Text>
              <Text style={styles.statValue}>{stats.rate}%</Text>
              <Text style={styles.statMeta}>
                {stats.completed} / {stats.total} {t("today.completed")}
              </Text>
            </RetroCard>
          </View>
        </FadeInView>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>{t("today.goals")}</Text>
          <AnimatedPressable onPress={() => navigation.navigate("GoalManage")}>
            <Text style={styles.sectionAction}>
              {t("today.manageRepeatGoals")}
            </Text>
          </AnimatedPressable>
        </View>

        <FadeInView delay={120}>
          <RetroCard style={styles.todoCard}>
            {dailyTodos.map((todo) => (
              <TodoItem
                key={`daily-${todo.goal_id}`}
                title={todo.title}
                completed={todo.is_done === 1}
                meta={
                  todo.streak > 1
                    ? `${todo.streak}${t("today.dayUnit")} ${t("today.streak")}`
                    : todo.category
                }
                onToggle={() => {
                  toggleDailyTodo(todo);
                  refreshStats();
                }}
              />
            ))}
            {todayOnlyTodos.map((todo) => (
              <TodoItem
                key={`once-${todo.id}`}
                title={todo.title}
                completed={todo.is_done === 1}
                meta={t("today.onceGoal")}
                onToggle={() => {
                  toggleTodayOnlyTodo(todo);
                  refreshStats();
                }}
                onDelete={
                  todo.id === undefined
                    ? undefined
                    : () => {
                        deleteTodo(todo.id!);
                        refreshStats();
                      }
                }
              />
            ))}
            {stats.total === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>{t("today.emptyTitle")}</Text>
                <Text style={styles.emptyText}>{t("today.emptyText")}</Text>
              </View>
            )}

            <View style={styles.addRow}>
              <View style={styles.todayOnlyLabelWrap}>
                <Text style={styles.todayOnlyLabel}>
                  {t("today.onceGoalAdd")}
                </Text>
                <Text style={styles.todayOnlyDescription}>
                  {t("today.onceGoalDescription")}
                </Text>
              </View>
              <View style={styles.todoInputRow}>
                <RetroInput
                  style={styles.todoInput}
                  value={newTodoTitle}
                  onChangeText={setNewTodoTitle}
                  placeholder={t("today.onceGoalPlaceholder")}
                  returnKeyType="done"
                  onSubmitEditing={handleAddTodo}
                />
                <AnimatedPressable
                  style={styles.addButton}
                  pressedScale={0.97}
                  onPress={handleAddTodo}
                >
                  <Ionicons name="add" size={22} color={DESIGN.colors.text} />
                </AnimatedPressable>
              </View>
            </View>
          </RetroCard>
        </FadeInView>

        {todayLog && (
          <Text style={styles.loggedHint}>{t("today.loggedHint")}</Text>
        )}
      </ScrollView>

      <View
        style={[styles.ctaDock, { paddingBottom: Math.max(insets.bottom, 10) }]}
      >
        <PrimaryButton
          label={todayLog ? t("today.edit") : t("today.write")}
          onPress={() => {
            if (todayLog?.id !== undefined) {
              navigation.navigate("Write", { logId: todayLog.id });
              return;
            }
            navigation.navigate("Write");
          }}
        />
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
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  streakCard: {
    marginBottom: 16,
    padding: 22,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: DESIGN.colors.textDim,
    fontSize: 13,
    fontWeight: "600",
  },
  streakValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  streakValue: {
    color: DESIGN.colors.text,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  streakUnit: {
    marginLeft: 5,
    color: DESIGN.colors.textDim,
    fontSize: 14,
    fontWeight: "600",
  },
  streakIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "rgba(245,158,11,0.12)",
  },
  chart: {
    height: 72,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 18,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
  },
  chartTrack: {
    width: "100%",
    height: 52,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: DESIGN.colors.bgSecondary,
  },
  chartBar: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: DESIGN.colors.secondary,
  },
  chartLabel: {
    marginTop: 5,
    color: DESIGN.colors.textDim,
    fontSize: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    minHeight: 132,
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
  },
  statValue: {
    color: DESIGN.colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  statMeta: {
    color: DESIGN.colors.success,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: DESIGN.colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  sectionAction: {
    color: DESIGN.colors.primaryLight,
    fontSize: 13,
    fontWeight: "600",
  },
  todoCard: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 16,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyTitle: {
    color: DESIGN.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 5,
    color: DESIGN.colors.textDim,
    fontSize: 13,
  },
  addRow: {
    marginTop: 16,
  },
  todayOnlyLabelWrap: {
    marginBottom: 10,
  },
  todayOnlyLabel: {
    color: DESIGN.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  todayOnlyDescription: {
    marginTop: 3,
    color: DESIGN.colors.textDim,
    fontSize: 11,
  },
  todoInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },
  todoInput: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 16,
    backgroundColor: DESIGN.colors.primary,
  },
  loggedHint: {
    marginTop: 12,
    color: DESIGN.colors.textDim,
    fontSize: 12,
    textAlign: "center",
  },
  ctaDock: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.border,
    backgroundColor: "rgba(11,15,20,0.96)",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
