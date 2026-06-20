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
import RetroCard from "../components/ui/RetroCard";
import RetroInput from "../components/ui/RetroInput";
import { useLogs } from "../hooks/useLogs";
import { useStats } from "../hooks/useStats";
import { useTodos } from "../hooks/useTodos";
import { AppLanguage } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";
import { formatLocalDate } from "../utils/date";

const ADVENTURE_WEEKDAYS: Record<AppLanguage, string[]> = {
  ko: ["일", "월", "화", "수", "목", "금", "토"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
  ja: ["日", "月", "火", "水", "木", "金", "土"],
  zh: ["日", "一", "二", "三", "四", "五", "六"],
};

const DATE_WEEKDAYS: Record<AppLanguage, string[]> = {
  ko: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  ja: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  zh: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
};

function SproutFriend() {
  const { mode, theme } = useAppTheme();
  const faceColor = mode === "dark" ? "#E9D98F" : "#F3D887";
  const cheekColor = mode === "dark" ? "#D98E85" : "#E99B91";

  return (
    <View style={styles.mascotStage}>
      <Text style={[styles.mascotSparkle, { color: theme.colors.warning }]}>
        ✦
      </Text>
      <Text
        style={[
          styles.mascotSparkle,
          styles.mascotSparkleSmall,
          { color: theme.colors.secondary },
        ]}
      >
        ✦
      </Text>
      <View
        style={[
          styles.mascotLeaf,
          styles.mascotLeafLeft,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.mascotLeaf,
          styles.mascotLeafRight,
          { backgroundColor: theme.colors.primary },
        ]}
      />
      <View
        style={[
          styles.mascotArm,
          styles.mascotArmLeft,
          { backgroundColor: faceColor },
        ]}
      />
      <View
        style={[
          styles.mascotArm,
          styles.mascotArmRight,
          { backgroundColor: faceColor },
        ]}
      />
      <View
        style={[
          styles.mascotBody,
          {
            borderColor:
              mode === "light" ? "rgba(255,255,255,0.72)" : "transparent",
            backgroundColor: faceColor,
          },
        ]}
      >
        <View style={styles.mascotEyes}>
          <View
            style={[styles.mascotEye, { backgroundColor: theme.colors.text }]}
          />
          <View
            style={[styles.mascotEye, { backgroundColor: theme.colors.text }]}
          />
        </View>
        <View style={styles.mascotCheeks}>
          <View style={[styles.mascotCheek, { backgroundColor: cheekColor }]} />
          <View style={[styles.mascotCheek, { backgroundColor: cheekColor }]} />
        </View>
        <View
          style={[styles.mascotSmile, { borderBottomColor: theme.colors.text }]}
        />
      </View>
      <View
        style={[
          styles.mascotFoot,
          styles.mascotFootLeft,
          { backgroundColor: faceColor },
        ]}
      />
      <View
        style={[
          styles.mascotFoot,
          styles.mascotFootRight,
          { backgroundColor: faceColor },
        ]}
      />
      <View
        style={[
          styles.mascotGround,
          { backgroundColor: `${theme.colors.text}14` },
        ]}
      />
    </View>
  );
}

function AdventureMap({
  values,
  language,
}: {
  values: number[];
  language: AppLanguage;
}) {
  const { mode, theme } = useAppTheme();
  const data = values.length === 7 ? values : Array(7).fill(0);
  const labels = ADVENTURE_WEEKDAYS[language];

  return (
    <View style={styles.adventureMap}>
      <View
        style={[
          styles.mapTrail,
          { borderTopColor: `${theme.colors.warning}70` },
        ]}
      />
      {data.map((value, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index - 1));
        const hillHeight = 25 + Math.min(34, Math.round(value * 0.34));
        const isToday = index === data.length - 1;
        const hasGrowth = value > 0;

        return (
          <View key={index} style={styles.mapStepColumn}>
            <View
              style={[
                styles.mapHill,
                {
                  height: hillHeight,
                  backgroundColor: hasGrowth
                    ? `${theme.colors.primary}${mode === "dark" ? "48" : "32"}`
                    : `${theme.colors.muted}16`,
                },
              ]}
            >
              <View
                style={[
                  styles.mapMarker,
                  {
                    borderColor: isToday
                      ? theme.colors.warning
                      : `${theme.colors.primary}72`,
                    backgroundColor: hasGrowth
                      ? theme.colors.primary
                      : theme.colors.surface,
                  },
                ]}
              >
                <Ionicons
                  name={hasGrowth ? "leaf" : "leaf-outline"}
                  size={isToday ? 15 : 13}
                  color={
                    hasGrowth
                      ? mode === "light"
                        ? theme.colors.surface
                        : theme.colors.text
                      : theme.colors.muted
                  }
                />
              </View>
            </View>
            <Text
              style={[
                styles.mapLabel,
                { color: isToday ? theme.colors.text : theme.colors.muted },
                isToday && styles.mapLabelToday,
              ]}
            >
              {labels[date.getDay()]}
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
  const { language, t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const homeBackground = mode === "light" ? "#F7F3E9" : theme.colors.background;
  const today = formatLocalDate();
  const todayDate = new Date();
  const dateLabel = `${today.replace(/-/g, ".")} ${DATE_WEEKDAYS[language][todayDate.getDay()]}`;
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
      style={[styles.container, { backgroundColor: homeBackground }]}
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
            styles.backgroundGlowWarm,
            {
              backgroundColor:
                mode === "light" ? "rgba(247,221,191,0.42)" : "transparent",
            },
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
        backgroundColor={homeBackground}
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
                borderColor: `${theme.colors.primary}38`,
                backgroundColor: mode === "dark" ? "#1D3930" : "#CFEAF4",
              },
            ]}
          >
            <View pointerEvents="none" style={styles.heroGarden}>
              <View
                style={[
                  styles.heroSun,
                  {
                    backgroundColor: mode === "dark" ? "#E8C878" : "#FFD985",
                  },
                ]}
              />
              <View style={[styles.heroCloud, styles.heroCloudOne]}>
                <View style={[styles.cloudPuff, styles.cloudPuffLeft]} />
                <View style={[styles.cloudPuff, styles.cloudPuffRight]} />
              </View>
              <View style={[styles.heroCloud, styles.heroCloudTwo]}>
                <View style={[styles.cloudPuff, styles.cloudPuffSmall]} />
              </View>
              <View
                style={[
                  styles.heroHill,
                  styles.heroHillBack,
                  {
                    backgroundColor: mode === "dark" ? "#315B48" : "#A7D99B",
                  },
                ]}
              />
              <View
                style={[
                  styles.heroHill,
                  styles.heroHillFront,
                  {
                    backgroundColor: mode === "dark" ? "#274B3B" : "#7FC78A",
                  },
                ]}
              />
              <View
                style={[
                  styles.heroPath,
                  {
                    backgroundColor: mode === "dark" ? "#A98A5A" : "#F3D6A0",
                  },
                ]}
              />
              <View style={[styles.gardenTree, styles.gardenTreeLeft]}>
                <View style={styles.treeCrownSmall} />
                <View style={styles.treeCrown} />
                <View style={styles.treeTrunk} />
              </View>
              <View style={[styles.gardenTree, styles.gardenTreeRight]}>
                <View style={styles.treeCrownSmall} />
                <View style={styles.treeCrown} />
                <View style={styles.treeTrunk} />
              </View>
              <View style={[styles.gardenFlower, styles.gardenFlowerOne]}>
                <View style={styles.flowerCenter} />
              </View>
              <View style={[styles.gardenFlower, styles.gardenFlowerTwo]}>
                <View style={styles.flowerCenter} />
              </View>
            </View>
            <View style={styles.heroIntro}>
              <View style={styles.heroCopy}>
                <View
                  style={[
                    styles.heroKicker,
                    { backgroundColor: `${theme.colors.surface}B8` },
                  ]}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.heroKickerText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {t("today.title")}
                  </Text>
                </View>
                <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
                  {t("today.heroTitle")}
                </Text>
                <Text
                  style={[
                    styles.heroSubtitle,
                    {
                      color: theme.colors.text,
                      backgroundColor:
                        mode === "light"
                          ? "rgba(255,255,255,0.58)"
                          : "rgba(11,16,16,0.52)",
                    },
                  ]}
                >
                  {t("today.heroSubtitle")}
                </Text>
              </View>
              <SproutFriend />
            </View>
          </RetroCard>
        </FadeInView>

        <FadeInView delay={60}>
          <RetroCard
            style={[
              styles.mapCard,
              {
                borderColor: `${theme.colors.warning}38`,
                backgroundColor: mode === "dark" ? "#1A2B24" : "#FFFDF7",
              },
            ]}
          >
            <View style={styles.mapHeader}>
              <View
                style={[
                  styles.mapTitleIcon,
                  { backgroundColor: `${theme.colors.warning}22` },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={theme.colors.warning}
                />
              </View>
              <Text style={[styles.mapTitle, { color: theme.colors.text }]}>
                {t("today.adventureMap")}
              </Text>
            </View>
            <AdventureMap values={recentRates} language={language} />
          </RetroCard>
        </FadeInView>

        <FadeInView delay={90}>
          <View style={styles.statsRow}>
            <RetroCard
              style={[
                styles.statCard,
                styles.statCardMint,
                {
                  borderColor: `${theme.colors.primary}35`,
                  backgroundColor: mode === "dark" ? "#24483A" : "#DDF2D2",
                },
              ]}
            >
              <Ionicons name="leaf" size={22} color={theme.colors.success} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {weeklyRate}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                {t("today.growthSeeds")}
              </Text>
            </RetroCard>
            <RetroCard
              style={[
                styles.statCard,
                styles.statCardGold,
                {
                  borderColor: `${theme.colors.warning}40`,
                  backgroundColor: mode === "dark" ? "#4A3D26" : "#FFE6B8",
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={theme.colors.warning}
              />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.rate}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                {t("today.todayQuest")}
              </Text>
            </RetroCard>
            <RetroCard
              style={[
                styles.statCard,
                styles.statCardSky,
                {
                  borderColor: `${theme.colors.secondary}40`,
                  backgroundColor: mode === "dark" ? "#24404A" : "#DCE9F7",
                },
              ]}
            >
              <Ionicons name="heart" size={22} color={theme.colors.secondary} />
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {streak}
                </Text>
                <Text style={[styles.statUnit, { color: theme.colors.text }]}>
                  {t("today.dayUnit")}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>
                {t("today.adventureStreak")}
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
                name="checkmark-circle-outline"
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
              style={[
                styles.sectionAction,
                {
                  color:
                    mode === "light"
                      ? LIGHT_PASTEL.greenText
                      : theme.colors.secondary,
                },
              ]}
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
                backgroundColor:
                  mode === "light" ? "#FFF8EE" : `${theme.colors.primary}08`,
              },
            ]}
          >
            <View pointerEvents="none" style={styles.questBoardPins}>
              <View
                style={[
                  styles.questBoardPin,
                  { backgroundColor: theme.colors.warning },
                ]}
              />
              <View
                style={[
                  styles.questBoardPin,
                  { backgroundColor: theme.colors.secondary },
                ]}
              />
            </View>
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
                ? "rgba(247,243,233,0.97)"
                : "rgba(11,16,16,0.96)",
          },
        ]}
      >
        <PrimaryButton
          label={todayLog ? t("today.edit") : t("today.write")}
          style={[
            styles.adventureCta,
            mode === "light" && styles.adventureCtaLight,
          ]}
          textStyle={styles.adventureCtaText}
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
  backgroundGlowWarm: {
    right: -80,
    bottom: 120,
    width: 230,
    height: 230,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  streakCard: {
    overflow: "hidden",
    marginBottom: 16,
    minHeight: 250,
    padding: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: "#66836F",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 3,
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
    right: -80,
    bottom: 18,
    width: 340,
    height: 150,
    transform: [{ rotate: "-5deg" }],
  },
  heroHillFront: {
    right: 40,
    bottom: -82,
    width: 390,
    height: 180,
    transform: [{ rotate: "7deg" }],
  },
  heroSun: {
    position: "absolute",
    top: 22,
    right: 28,
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.9,
  },
  heroCloud: {
    position: "absolute",
    width: 52,
    height: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.68)",
  },
  cloudPuff: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.68)",
    borderRadius: 999,
  },
  cloudPuffLeft: {
    top: -8,
    left: 8,
    width: 22,
    height: 22,
  },
  cloudPuffRight: {
    top: -5,
    right: 6,
    width: 17,
    height: 17,
  },
  cloudPuffSmall: {
    top: -7,
    left: 8,
    width: 18,
    height: 18,
  },
  heroCloudOne: {
    top: 38,
    right: 96,
  },
  heroCloudTwo: {
    top: 72,
    right: 20,
    width: 34,
    opacity: 0.7,
  },
  heroPath: {
    position: "absolute",
    right: 36,
    bottom: -34,
    width: 76,
    height: 150,
    borderRadius: 60,
    opacity: 0.72,
    transform: [{ rotate: "24deg" }],
  },
  gardenTree: {
    position: "absolute",
    width: 38,
    height: 62,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  gardenTreeLeft: {
    bottom: 42,
    left: 12,
    transform: [{ scale: 0.82 }],
  },
  gardenTreeRight: {
    right: 108,
    bottom: 56,
    transform: [{ scale: 0.68 }],
  },
  treeCrownSmall: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    width: 24,
    height: 34,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#4F9E6B",
  },
  treeCrown: {
    position: "absolute",
    zIndex: 1,
    top: 16,
    width: 38,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#70B981",
  },
  treeTrunk: {
    width: 8,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#A77D55",
  },
  gardenFlower: {
    position: "absolute",
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#F4B6B0",
  },
  gardenFlowerOne: {
    right: 95,
    bottom: 25,
  },
  gardenFlowerTwo: {
    right: 18,
    bottom: 38,
    backgroundColor: "#F8D37E",
    transform: [{ scale: 0.8 }],
  },
  flowerCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFF9E8",
  },
  heroIntro: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 202,
  },
  heroCopy: {
    flex: 1,
    alignSelf: "flex-start",
    paddingTop: 6,
    paddingRight: 8,
  },
  heroTitle: {
    color: DESIGN.colors.text,
    maxWidth: 210,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    letterSpacing: -0.8,
    textShadowColor: "rgba(255,255,255,0.48)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  heroKicker: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroKickerText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    alignSelf: "flex-start",
    maxWidth: 190,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    color: DESIGN.colors.textDim,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    borderRadius: 13,
    overflow: "hidden",
  },
  mascotStage: {
    position: "relative",
    width: 104,
    height: 136,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mascotBody: {
    zIndex: 3,
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 38,
    borderBottomRightRadius: 30,
    transform: [{ rotate: "3deg" }],
  },
  mascotLeaf: {
    position: "absolute",
    zIndex: 2,
    top: 23,
    width: 39,
    height: 25,
  },
  mascotLeafLeft: {
    left: 19,
    borderTopLeftRadius: 26,
    borderBottomRightRadius: 26,
    transform: [{ rotate: "-28deg" }],
  },
  mascotLeafRight: {
    right: 18,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 26,
    transform: [{ rotate: "28deg" }],
  },
  mascotArm: {
    position: "absolute",
    zIndex: 2,
    bottom: 31,
    width: 22,
    height: 11,
    borderRadius: 9,
  },
  mascotArmLeft: {
    left: 5,
    transform: [{ rotate: "-24deg" }],
  },
  mascotArmRight: {
    right: 5,
    transform: [{ rotate: "24deg" }],
  },
  mascotEyes: {
    width: 38,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  mascotEye: {
    width: 6,
    height: 8,
    borderRadius: 4,
  },
  mascotCheeks: {
    position: "absolute",
    top: 45,
    width: 55,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mascotCheek: {
    width: 10,
    height: 6,
    borderRadius: 5,
    opacity: 0.72,
  },
  mascotSmile: {
    width: 14,
    height: 8,
    marginTop: 7,
    borderBottomWidth: 2,
    borderRadius: 8,
  },
  mascotFoot: {
    position: "absolute",
    zIndex: 4,
    bottom: 7,
    width: 23,
    height: 12,
    borderRadius: 12,
  },
  mascotFootLeft: {
    left: 22,
    transform: [{ rotate: "-8deg" }],
  },
  mascotFootRight: {
    right: 22,
    transform: [{ rotate: "8deg" }],
  },
  mascotGround: {
    width: 96,
    height: 15,
    marginTop: -7,
    borderRadius: 999,
  },
  mascotSparkle: {
    position: "absolute",
    zIndex: 4,
    top: 4,
    right: 1,
    fontSize: 19,
    fontWeight: "900",
  },
  mascotSparkleSmall: {
    top: 46,
    right: 0,
    fontSize: 11,
  },
  mapCard: {
    marginBottom: 14,
    padding: 18,
    borderRadius: 28,
    borderWidth: 2,
    shadowColor: "#8B8068",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 2,
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  mapTitleIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    borderRadius: 12,
    transform: [{ rotate: "-5deg" }],
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  adventureMap: {
    position: "relative",
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    paddingHorizontal: 2,
  },
  mapTrail: {
    position: "absolute",
    right: 15,
    bottom: 41,
    left: 15,
    borderTopWidth: 2,
    borderStyle: "dashed",
    transform: [{ rotate: "-2deg" }],
  },
  mapStepColumn: {
    zIndex: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mapHill: {
    width: "100%",
    maxWidth: 38,
    alignItems: "center",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  mapMarker: {
    width: 29,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
    borderWidth: 2,
    borderRadius: 15,
  },
  mapLabel: {
    marginTop: 7,
    color: DESIGN.colors.textDim,
    fontSize: 11,
    fontWeight: "600",
  },
  mapLabelToday: {
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },
  statCard: {
    minHeight: 116,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.78)",
    borderRadius: 24,
    shadowColor: "#847A68",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardMint: {
    transform: [{ rotate: "-2deg" }],
  },
  statCardGold: {
    transform: [{ translateY: 3 }, { rotate: "1.5deg" }],
  },
  statCardSky: {
    transform: [{ rotate: "-1deg" }],
  },
  statValue: {
    color: DESIGN.colors.text,
    marginTop: 5,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  statUnit: {
    marginLeft: 2,
    fontSize: 11,
    fontWeight: "800",
  },
  statLabel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flex: 1,
    minWidth: 0,
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
    flexShrink: 1,
    color: DESIGN.colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  sectionAction: {
    marginLeft: 8,
    color: DESIGN.colors.primaryLight,
    fontSize: 13,
    fontWeight: "600",
  },
  todoCard: {
    position: "relative",
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 16,
    borderStyle: "solid",
    borderRadius: 28,
    shadowColor: "#8B8068",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  questBoardPins: {
    position: "absolute",
    top: 8,
    right: 12,
    left: 12,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  questBoardPin: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  adventureCta: {
    minHeight: 60,
    borderRadius: 24,
  },
  adventureCtaLight: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 28,
    backgroundColor: "#397D54",
    shadowColor: "#477B58",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  adventureCtaText: {
    fontSize: 17,
    fontWeight: "900",
  },
});
