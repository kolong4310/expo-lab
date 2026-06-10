import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { deleteLog, getDailyGoalsWithCheck, WorkLog } from "../database/db";
import { DESIGN } from "../theme/design";

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
  if (!content?.trim()) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionText}>{content}</Text>
    </View>
  );
}

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { log } = useRoute().params as { log: WorkLog };
  const dailyGoals = getDailyGoalsWithCheck(log.date);

  const handleDelete = () => {
    Alert.alert("기록 삭제", "이 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (log.id) {
            deleteLog(log.id);
            navigation.goBack();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <AppHeader
        title="기록 상세"
        onBack={() => navigation.goBack()}
        right={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Write", { log })}
              style={styles.iconButton}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={DESIGN.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
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
        <View style={styles.hero}>
          <Text style={styles.date}>{log.date.replace(/-/g, ".")}</Text>
          <Text style={styles.title}>{log.title}</Text>
          {log.daily_summary && (
            <Text style={styles.summary}>{log.daily_summary}</Text>
          )}
          <View style={styles.metaRow}>
            {log.mood && (
              <Text style={styles.metaChip}>{MOOD_MAP[log.mood]}</Text>
            )}
            {log.tags
              ?.split(",")
              .filter(Boolean)
              .map((tag) => (
                <Text key={tag} style={styles.tagChip}>
                  #{tag}
                </Text>
              ))}
          </View>
        </View>

        {dailyGoals.length > 0 && (
          <RetroCard style={styles.goalsCard}>
            <Text style={styles.cardTitle}>오늘 목표</Text>
            {dailyGoals.map((goal) => (
              <View key={goal.goal_id} style={styles.goalRow}>
                <Ionicons
                  name={
                    goal.is_done === 1 ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={19}
                  color={
                    goal.is_done === 1
                      ? DESIGN.colors.success
                      : DESIGN.colors.textDim
                  }
                />
                <Text style={styles.goalText}>{goal.title}</Text>
              </View>
            ))}
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
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, paddingHorizontal: 20 },
  hero: { paddingTop: 22, paddingBottom: 28 },
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
    backgroundColor: "rgba(34,197,94,0.14)",
    color: DESIGN.colors.success,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagChip: {
    borderRadius: DESIGN.radius.pill,
    backgroundColor: "rgba(108,99,255,0.14)",
    color: DESIGN.colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  goalsCard: { marginBottom: 16, padding: 20 },
  cardTitle: {
    marginBottom: 14,
    color: DESIGN.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  goalRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  goalText: {
    marginLeft: 10,
    color: DESIGN.colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.card,
    backgroundColor: DESIGN.colors.surface,
    padding: 20,
  },
  sectionLabel: {
    marginBottom: 10,
    color: DESIGN.colors.textDim,
    fontSize: 12,
    fontWeight: "600",
  },
  sectionText: { color: DESIGN.colors.text, fontSize: 15, lineHeight: 24 },
});
