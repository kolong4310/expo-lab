import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
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
import RetroCard from "../components/ui/RetroCard";
import {
  getDailyGoalsWithCheck,
  getTodayOnlyGoals,
} from "../database/repositories/goalsRepository";
import { deleteLog, getLogById } from "../database/repositories/logsRepository";
import { goHome, goToMainTab } from "../navigation/homeNavigation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";

const MOOD_MAP: Record<string, string> = {
  best: "최고",
  good: "좋음",
  normal: "보통",
  hard: "힘듦",
};

function ContentSection({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  const { mode, theme } = useAppTheme();
  if (!content?.trim()) return null;
  return (
    <View
      style={[
        styles.section,
        {
          borderColor:
            mode === "light" ? LIGHT_PASTEL.border : theme.colors.border,
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.paper : theme.colors.surface,
        },
        mode === "light" && styles.lightPaperCard,
      ]}
    >
      <Text style={[styles.sectionLabel, { color: theme.colors.muted }]}>
        {label}
      </Text>
      <Text style={[styles.sectionText, { color: theme.colors.text }]}>
        {content}
      </Text>
    </View>
  );
}

export default function DetailScreen({
  navigation,
  route,
}: RootStackScreenProps<"Detail">) {
  const insets = useSafeAreaInsets();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
  const { logId, returnTo } = route.params;
  const log = getLogById(logId);

  if (!log) return null;
  const goals = [
    ...getDailyGoalsWithCheck(log.date).map((goal) => ({
      id: `daily-${goal.goal_id}`,
      title: goal.title,
      isDone: goal.is_done === 1,
      type: "반복 목표",
    })),
    ...getTodayOnlyGoals(log.date).map((goal) => ({
      id: `once-${goal.id}`,
      title: goal.title,
      isDone: goal.is_done === 1,
      type: "오늘만 목표",
    })),
  ];
  const completedGoals = goals.filter((goal) => goal.isDone);
  const pendingGoals = goals.filter((goal) => !goal.isDone);

  const handleDelete = () => {
    Alert.alert("기록 삭제", "이 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (log.id) {
            deleteLog(log.id);
            if (returnTo === "Archive" || returnTo === "Search") {
              goToMainTab(navigation, returnTo);
            } else {
              goHome(navigation);
            }
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.backgroundBlob, styles.backgroundBlobYellow]} />
        <View style={[styles.backgroundBlob, styles.backgroundBlobBlue]} />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
      />
      <AppHeader
        title="기록 상세"
        onBack={() => navigation.goBack()}
        onHome={() => goHome(navigation)}
        right={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Write", { logId })}
              style={[
                styles.iconButton,
                mode === "light" && styles.lightIconButton,
              ]}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={[
                styles.iconButton,
                mode === "light" && styles.lightDeleteButton,
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={19}
                color={DESIGN.colors.error}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View style={[styles.hero, mode === "light" && styles.lightHero]}>
          {mode === "light" && <View style={styles.noteTape} />}
          <Text style={[styles.date, { color: theme.colors.muted }]}>
            {log.date.replace(/-/g, ".")}
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {log.title}
          </Text>
          {log.daily_summary && (
            <Text style={[styles.summary, { color: theme.colors.muted }]}>
              {log.daily_summary}
            </Text>
          )}
          <View style={styles.metaRow}>
            {log.mood && (
              <Text
                style={[
                  styles.metaChip,
                  mode === "light" && styles.lightMoodChip,
                ]}
              >
                {MOOD_MAP[log.mood] ?? log.mood}
              </Text>
            )}
            {log.tags
              ?.split(",")
              .filter(Boolean)
              .map((tag) => (
                <Text
                  key={tag}
                  style={[
                    styles.tagChip,
                    mode === "light" && styles.lightTagChip,
                  ]}
                >
                  #{tag}
                </Text>
              ))}
          </View>
        </View>

        {goals.length > 0 && (
          <RetroCard
            style={[
              styles.goalsCard,
              mode === "light" && styles.lightGoalsCard,
            ]}
          >
            <View style={styles.goalSummaryRow}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                그날 목표
              </Text>
              <Text
                style={[styles.goalSummary, { color: theme.colors.success }]}
              >
                {completedGoals.length} / {goals.length} 완료
              </Text>
            </View>
            {completedGoals.length > 0 && (
              <View style={styles.goalGroup}>
                <Text
                  style={[styles.goalGroupTitle, { color: theme.colors.muted }]}
                >
                  완료
                </Text>
                {completedGoals.map((goal) => (
                  <View key={goal.id} style={styles.goalRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={19}
                      color={DESIGN.colors.success}
                    />
                    <View style={styles.goalTextWrap}>
                      <Text
                        style={[styles.goalText, { color: theme.colors.text }]}
                      >
                        {goal.title}
                      </Text>
                      <Text
                        style={[styles.goalType, { color: theme.colors.muted }]}
                      >
                        {goal.type}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {pendingGoals.length > 0 && (
              <View style={styles.goalGroup}>
                <Text
                  style={[styles.goalGroupTitle, { color: theme.colors.muted }]}
                >
                  미완료
                </Text>
                {pendingGoals.map((goal) => (
                  <View key={goal.id} style={styles.goalRow}>
                    <Ionicons
                      name="ellipse-outline"
                      size={19}
                      color={theme.colors.muted}
                    />
                    <View style={styles.goalTextWrap}>
                      <Text
                        style={[
                          styles.goalText,
                          styles.goalTextPending,
                          { color: theme.colors.muted },
                        ]}
                      >
                        {goal.title}
                      </Text>
                      <Text
                        style={[styles.goalType, { color: theme.colors.muted }]}
                      >
                        {goal.type}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </RetroCard>
        )}

        <ContentSection label="상세 내용" content={log.content} />
        <ContentSection label="배운 점" content={log.learned} />
        <ContentSection label="이슈" content={log.issue} />
        <ContentSection label="해결 방법" content={log.solution} />
        <ContentSection label="메모" content={log.memo} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DESIGN.colors.bg },
  headerActions: { flexDirection: "row", gap: 4 },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobYellow: {
    top: 80,
    right: -120,
    width: 250,
    height: 250,
    backgroundColor: "rgba(255,230,184,0.48)",
  },
  backgroundBlobBlue: {
    bottom: 80,
    left: -130,
    width: 260,
    height: 260,
    backgroundColor: "rgba(220,233,247,0.42)",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  lightIconButton: {
    borderWidth: 1,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 14,
    backgroundColor: LIGHT_PASTEL.blue,
  },
  lightDeleteButton: {
    borderWidth: 1,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 14,
    backgroundColor: LIGHT_PASTEL.pink,
  },
  content: { flex: 1, paddingHorizontal: 20 },
  hero: { paddingTop: 22, paddingBottom: 28 },
  lightHero: {
    position: "relative",
    marginTop: 12,
    marginBottom: 18,
    padding: 24,
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 30,
    backgroundColor: LIGHT_PASTEL.paperWarm,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  noteTape: {
    position: "absolute",
    top: -6,
    right: 32,
    width: 48,
    height: 14,
    borderRadius: 3,
    backgroundColor: LIGHT_PASTEL.yellow,
    opacity: 0.86,
    transform: [{ rotate: "2deg" }],
  },
  date: { color: DESIGN.colors.textDim, fontSize: 12, fontWeight: "500" },
  title: {
    marginTop: 10,
    color: DESIGN.colors.text,
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: -0.7,
  },
  summary: {
    marginTop: 14,
    color: DESIGN.colors.textDim,
    fontSize: 16,
    lineHeight: 24,
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 18 },
  metaChip: {
    borderRadius: DESIGN.radius.pill,
    backgroundColor: "rgba(116,217,159,0.14)",
    color: DESIGN.colors.success,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lightMoodChip: {
    backgroundColor: LIGHT_PASTEL.pink,
    color: "#9C5E5A",
  },
  tagChip: {
    borderRadius: DESIGN.radius.pill,
    backgroundColor: "rgba(116,217,159,0.14)",
    color: DESIGN.colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lightTagChip: {
    backgroundColor: LIGHT_PASTEL.blue,
    color: "#557C91",
  },
  goalsCard: { marginBottom: 16, padding: 20 },
  lightGoalsCard: {
    borderRadius: 28,
    backgroundColor: LIGHT_PASTEL.mint,
  },
  cardTitle: {
    color: DESIGN.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  goalSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  goalSummary: {
    color: DESIGN.colors.success,
    fontSize: 12,
    fontWeight: "600",
  },
  goalGroup: {
    marginTop: 18,
  },
  goalGroupTitle: {
    marginBottom: 4,
    color: DESIGN.colors.textDim,
    fontSize: 12,
    fontWeight: "600",
  },
  goalRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  goalTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  goalText: {
    color: DESIGN.colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  goalTextPending: {
    color: DESIGN.colors.textDim,
  },
  goalType: {
    marginTop: 2,
    color: DESIGN.colors.textDim,
    fontSize: 11,
  },
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.card,
    backgroundColor: DESIGN.colors.surface,
    padding: 20,
  },
  lightPaperCard: {
    borderWidth: 2,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  sectionLabel: {
    marginBottom: 10,
    color: DESIGN.colors.textDim,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionText: { color: DESIGN.colors.text, fontSize: 15, lineHeight: 24 },
});
