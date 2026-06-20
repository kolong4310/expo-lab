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
import TinySprout from "../components/TinySprout";
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
import { useAppTheme } from "../theme/useAppTheme";
import { formatLocalDate } from "../utils/date";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function TrendChart({ values }: { values: number[] }) {
  const { theme } = useAppTheme();
  const data = values.length === 7 ? values : Array(7).fill(0);

  return (
    <View style={styles.chart}>
      {data.map((value, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index - 1));

        return (
          <View key={index} style={styles.chartColumn}>
            <View
              style={[
                styles.chartTrack,
                { backgroundColor: theme.colors.surfaceAlt },
              ]}
            >
              <View
                style={[
                  styles.chartBar,
                  {
                    height: `${Math.max(8, value)}%` as `${number}%`,
                    backgroundColor: theme.colors.secondary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.chartLabel, { color: theme.colors.muted }]}>
              {WEEKDAYS[date.getDay()]}
            </Text>
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
  const { mode, theme } = useAppTheme();
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View pointerEvents="none" style={styles.backgroundGarden}>
        <View
          style={[
            styles.backgroundGlow,
            styles.backgroundGlowTop,
            { backgroundColor: `${theme.colors.primary}12` },
          ]}
        />
        <View
          style={[
            styles.backgroundGlow,
            styles.backgroundGlowSide,
            { backgroundColor: `${theme.colors.secondary}0C` },
          ]}
        />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        style={[styles.container, styles.transparentBackground]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader title={t("today.title")} subtitle={dateLabel} compact />

        <FadeInView>
          <RetroCard
            style={[
              styles.streakCard,
              {
                borderColor: `${theme.colors.primary}24`,
                backgroundColor:
                  mode === "dark"
                    ? `${theme.colors.surface}F2`
                    : `${theme.colors.surface}F8`,
              },
            ]}
          >
            <View pointerEvents="none" style={styles.heroGarden}>
              <View
                style={[
                  styles.heroHill,
                  styles.heroHillBack,
                  { backgroundColor: `${theme.colors.secondary}12` },
                ]}
              />
              <View
                style={[
                  styles.heroHill,
                  styles.heroHillFront,
                  { backgroundColor: `${theme.colors.primary}15` },
                ]}
              />
            </View>
            <View style={styles.heroIntro}>
              <View style={styles.heroCopy}>
                <View style={styles.heroKicker}>
                  <Ionicons
                    name="sparkles-outline"
                    size={14}
                    color={theme.colors.warning}
                  />
                  <Text
                    style={[
                      styles.heroKickerText,
                      { color: theme.colors.muted },
                    ]}
                  >
                    {t("today.title")}
                  </Text>
                </View>
                <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
                  {t("today.heroTitle")}
                </Text>
                <Text
                  style={[styles.heroSubtitle, { color: theme.colors.muted }]}
                >
                  {t("today.heroSubtitle")}
                </Text>
              </View>
              <View
                style={[
                  styles.sproutBadge,
                  {
                    borderColor: `${theme.colors.primary}28`,
                    backgroundColor: `${theme.colors.primary}18`,
                  },
                ]}
              >
                <TinySprout size={38} />
              </View>
            </View>
            <View style={styles.cardHeading}>
              <View>
                <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>
                  {t("today.streak")}
                </Text>
                <View style={styles.streakValueRow}>
                  <Text
                    style={[styles.streakValue, { color: theme.colors.text }]}
                  >
                    {streak}
                  </Text>
                  <Text
                    style={[styles.streakUnit, { color: theme.colors.muted }]}
                  >
                    {t("today.dayUnit")}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.streakIcon,
                  { backgroundColor: `${theme.colors.primary}1C` },
                ]}
              >
                <Ionicons name="leaf" size={21} color={DESIGN.colors.success} />
              </View>
            </View>
            <TrendChart values={recentRates} />
          </RetroCard>
        </FadeInView>

        <FadeInView delay={70}>
          <View style={styles.statsRow}>
            <RetroCard
              style={[
                styles.statCard,
                { backgroundColor: `${theme.colors.secondary}0E` },
              ]}
            >
              <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>
                {t("today.weeklyGrowth")}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {weeklyRate}%
              </Text>
              <PixelProgressBar value={weeklyRate} />
            </RetroCard>
            <RetroCard
              style={[
                styles.statCard,
                { backgroundColor: `${theme.colors.warning}0C` },
              ]}
            >
              <Text style={[styles.cardLabel, { color: theme.colors.muted }]}>
                {t("today.completionRate")}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.rate}%
              </Text>
              <Text style={[styles.statMeta, { color: theme.colors.success }]}>
                {stats.completed} / {stats.total} {t("today.completed")}
              </Text>
            </RetroCard>
          </View>
        </FadeInView>

        <View style={styles.sectionHeading}>
          <View style={styles.sectionTitleRow}>
            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: `${theme.colors.primary}18` },
              ]}
            >
              <Ionicons
                name="map-outline"
                size={17}
                color={theme.colors.primary}
              />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t("today.goals")}
            </Text>
          </View>
          <AnimatedPressable onPress={() => navigation.navigate("GoalManage")}>
            <Text
              style={[styles.sectionAction, { color: theme.colors.secondary }]}
            >
              {t("today.manageRepeatGoals")}
            </Text>
          </AnimatedPressable>
        </View>

        <FadeInView delay={120}>
          <RetroCard
            style={[
              styles.todoCard,
              {
                borderColor: `${theme.colors.primary}1F`,
                backgroundColor: `${theme.colors.primary}08`,
              },
            ]}
          >
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
                <View
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: `${theme.colors.warning}16` },
                  ]}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={22}
                    color={theme.colors.warning}
                  />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  {t("today.emptyTitle")}
                </Text>
                <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                  {t("today.emptyText")}
                </Text>
              </View>
            )}

            <View style={styles.addRow}>
              <View style={styles.todayOnlyLabelWrap}>
                <Text
                  style={[styles.todayOnlyLabel, { color: theme.colors.text }]}
                >
                  {t("today.onceGoalAdd")}
                </Text>
                <Text
                  style={[
                    styles.todayOnlyDescription,
                    { color: theme.colors.muted },
                  ]}
                >
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
                  style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  pressedScale={0.97}
                  onPress={handleAddTodo}
                >
                  <Ionicons
                    name="add"
                    size={22}
                    color={
                      mode === "light"
                        ? theme.colors.surface
                        : theme.colors.text
                    }
                  />
                </AnimatedPressable>
              </View>
            </View>
          </RetroCard>
        </FadeInView>

        {todayLog && (
          <Text style={[styles.loggedHint, { color: theme.colors.muted }]}>
            {t("today.loggedHint")}
          </Text>
        )}
      </ScrollView>

      <View
        style={[
          styles.ctaDock,
          {
            paddingBottom: Math.max(insets.bottom, 10),
            borderTopColor: theme.colors.border,
            backgroundColor:
              mode === "light"
                ? "rgba(244,247,239,0.96)"
                : "rgba(11,16,16,0.96)",
          },
        ]}
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
  backgroundGarden: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  backgroundGlow: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundGlowTop: {
    top: -110,
    right: -90,
    width: 280,
    height: 280,
  },
  backgroundGlowSide: {
    top: 360,
    left: -130,
    width: 260,
    height: 260,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  streakCard: {
    overflow: "hidden",
    marginBottom: 16,
    padding: 24,
  },
  heroGarden: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  heroHill: {
    position: "absolute",
    borderRadius: 999,
  },
  heroHillBack: {
    top: -54,
    right: -52,
    width: 210,
    height: 126,
    transform: [{ rotate: "-8deg" }],
  },
  heroHillFront: {
    top: 10,
    right: -78,
    width: 190,
    height: 118,
    transform: [{ rotate: "10deg" }],
  },
  heroIntro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    color: DESIGN.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  heroKicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  heroKickerText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    marginTop: 6,
    color: DESIGN.colors.textDim,
    fontSize: 13,
    lineHeight: 19,
  },
  sproutBadge: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: 27,
    backgroundColor: "rgba(116,217,159,0.08)",
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
    backgroundColor: "rgba(116,217,159,0.11)",
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
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 17,
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyIcon: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
    borderRadius: 23,
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
    borderRadius: 18,
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
    backgroundColor: "rgba(11,16,16,0.96)",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
