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

const MOOD_MAP: any = {
  best: "최고",
  good: "좋음",
  normal: "보통",
  hard: "힘듦",
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };
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

  const InsightSection = ({
    label,
    content,
  }: {
    label: string;
    content: string;
  }) => {
    if (!content || content.trim() === "") return null;
    return (
      <RetroCard accent="cyan" style={styles.section}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionText}>{content}</Text>
      </RetroCard>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <AppHeader
        title="기록 상세"
        onBack={() => navigation.goBack()}
        accent={DESIGN.colors.yellow}
        right={
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Write", { log })}
            >
              <Text style={styles.actionText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteText}>삭제</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
      >
        <RetroCard accent="pink" style={styles.heroCard}>
          <Text style={styles.dateText}>{log.date.replace(/-/g, ".")}</Text>
          <Text style={styles.heroTitle}>{log.title}</Text>
          {log.daily_summary && (
            <Text style={styles.mantraText}>"{log.daily_summary}"</Text>
          )}
          <View style={styles.metaRow}>
            {log.mood && (
              <Text style={styles.metaBadge}>{MOOD_MAP[log.mood]}</Text>
            )}
            {log.tags?.split(",").map((tag) => (
              <Text key={tag} style={styles.tagText}>
                #{tag}
              </Text>
            ))}
          </View>
        </RetroCard>

        {dailyGoals.length > 0 && (
          <RetroCard accent="green" style={styles.section}>
            <Text style={styles.sectionLabel}>오늘 목표</Text>
            {dailyGoals.map((goal) => (
              <Text
                key={goal.goal_id}
                style={[
                  styles.goalText,
                  goal.is_done === 1 && styles.goalTextDone,
                ]}
              >
                {goal.is_done === 1 ? "■" : "□"} {goal.title}
              </Text>
            ))}
          </RetroCard>
        )}

        <InsightSection label="상세 내용" content={log.content} />
        <InsightSection label="배운 점" content={log.learned} />
        <InsightSection label="막힌 점" content={log.issue} />
        <InsightSection label="해결 방법" content={log.solution} />
        <InsightSection label="메모" content={log.memo} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  headerActions: {
    flexDirection: "row",
    gap: 14,
  },
  actionText: {
    fontFamily: "monospace",
    color: DESIGN.colors.mint,
    fontWeight: "900",
  },
  deleteText: {
    fontFamily: "monospace",
    color: DESIGN.colors.error,
    fontWeight: "900",
  },
  content: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
    paddingHorizontal: 24,
  },
  heroCard: {
    padding: 18,
    marginTop: 24,
    marginBottom: 22,
  },
  dateText: {
    fontFamily: "monospace",
    color: DESIGN.colors.yellow,
    fontWeight: "900",
    marginBottom: 8,
  },
  heroTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.text,
    marginBottom: 12,
  },
  mantraText: {
    color: DESIGN.colors.primary,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 26,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaBadge: {
    fontFamily: "monospace",
    color: DESIGN.colors.mint,
    fontWeight: "900",
    marginRight: 12,
  },
  tagText: {
    fontFamily: "monospace",
    color: DESIGN.colors.textDim,
    fontWeight: "900",
    marginRight: 10,
  },
  section: {
    padding: 16,
    marginBottom: 18,
  },
  sectionLabel: {
    fontFamily: "monospace",
    color: DESIGN.colors.primaryLight,
    fontWeight: "900",
    marginBottom: 10,
  },
  sectionText: {
    color: DESIGN.colors.text,
    fontSize: 16,
    lineHeight: 25,
  },
  goalText: {
    color: DESIGN.colors.text,
    fontSize: 16,
    marginBottom: 8,
  },
  goalTextDone: {
    color: DESIGN.colors.mint,
  },
});
