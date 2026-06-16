import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import PrimaryButton from "../components/PrimaryButton";
import StatCard from "../components/StatCard";
import RetroCard from "../components/ui/RetroCard";
import { getReportStats } from "../database/repositories/statsRepository";
import {
  MonthlyLogStat,
  MoodStat,
  ReportStats,
  TagStat,
} from "../database/types";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";

const EMPTY_REPORT: ReportStats = {
  totalLogCount: 0,
  currentMonthLogCount: 0,
  currentWeekLogCount: 0,
  logStreak: 0,
  recentAverageGrowthRate: 0,
  topTags: [],
  recentMonthlyLogs: [],
  moodStats: [],
};

const MOOD_LABELS: Record<string, string> = {
  best: "최고",
  good: "좋음",
  normal: "보통",
  hard: "힘듦",
};

type ReportInsight = {
  id: string;
  text: string;
};

const getMoodLabel = (mood: string): string => MOOD_LABELS[mood] ?? mood;

const buildReportSubtitle = (report: ReportStats): string => {
  if (report.totalLogCount === 0) {
    return "기록이 쌓이면 성장 흐름을 보여드릴게요.";
  }

  if (report.logStreak >= 2) {
    return `${report.logStreak}일째 기록 흐름을 이어가고 있어요.`;
  }

  if (report.currentMonthLogCount > 0) {
    return `이번 달 ${report.currentMonthLogCount}개의 기록이 쌓였어요.`;
  }

  return "최근 기록을 바탕으로 성장 흐름을 정리했어요.";
};

const buildReportInsights = (report: ReportStats): ReportInsight[] => {
  if (report.totalLogCount === 0) return [];

  const insights: ReportInsight[] = [];
  const topTag = report.topTags[0];
  const topMood = report.moodStats[0];

  if (report.currentMonthLogCount > 0) {
    insights.push({
      id: "month-log-count",
      text:
        report.currentMonthLogCount === 1
          ? "이번 달 첫 기록을 남겼어요."
          : `이번 달 ${report.currentMonthLogCount}개의 기록을 남겼어요.`,
    });
  }

  if (report.logStreak >= 2) {
    insights.push({
      id: "streak",
      text: `${report.logStreak}일 연속 기록 중이에요. 차분히 이어가고 있어요.`,
    });
  }

  if (report.recentAverageGrowthRate >= 50) {
    insights.push({
      id: "goal-rate-good",
      text: `최근 7일 목표 흐름이 좋아요. 평균 완료율은 ${report.recentAverageGrowthRate}%예요.`,
    });
  } else if (report.recentAverageGrowthRate > 0) {
    insights.push({
      id: "goal-rate-started",
      text: `최근 7일 목표 완료율은 ${report.recentAverageGrowthRate}%예요. 기록이 쌓이면 흐름이 더 선명해져요.`,
    });
  }

  if (topTag) {
    insights.push({
      id: "top-tag",
      text: `요즘 가장 자주 남긴 태그는 '${topTag.tag}'예요.`,
    });
  }

  if (topMood) {
    insights.push({
      id: "top-mood",
      text: `최근 기록에서 가장 많이 나타난 기분은 '${getMoodLabel(
        topMood.mood,
      )}'이에요.`,
    });
  }

  if (insights.length === 1 && report.totalLogCount === 1) {
    insights.push({
      id: "first-baseline",
      text: "이 기록이 앞으로의 성장 변화를 비교할 기준점이 될 거예요.",
    });
  }

  return insights.slice(0, 4);
};

export default function ReportScreen({
  navigation,
}: BottomTabScreenProps<"Report">) {
  const insets = useSafeAreaInsets();
  const [report, setReport] = useState<ReportStats>(EMPTY_REPORT);
  const reportSnapshotRef = useRef(JSON.stringify(EMPTY_REPORT));

  const reloadReport = useCallback(() => {
    const nextReport = getReportStats();
    const nextSnapshot = JSON.stringify(nextReport);

    if (reportSnapshotRef.current !== nextSnapshot) {
      reportSnapshotRef.current = nextSnapshot;
      setReport(nextReport);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadReport();
    }, [reloadReport]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 116 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="성장 리포트"
          subtitle={buildReportSubtitle(report)}
          compact
        />

        {report.totalLogCount === 0 ? (
          <EmptyReportState onWrite={() => navigation.navigate("Write")} />
        ) : (
          <ReportContent report={report} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ReportContent({ report }: { report: ReportStats }) {
  return (
    <>
      <SummaryGrid report={report} />
      <InsightSection insights={buildReportInsights(report)} />
      <TagStats tags={report.topTags} />
      <MonthlyLogChart months={report.recentMonthlyLogs} />
      <MoodStats moods={report.moodStats} />
    </>
  );
}

function SummaryGrid({ report }: { report: ReportStats }) {
  const stats = [
    {
      label: "이번 달 기록",
      value: `${report.currentMonthLogCount}개`,
    },
    {
      label: "이번 주 기록",
      value: `${report.currentWeekLogCount}개`,
    },
    {
      label: "연속 기록",
      value: `${report.logStreak}일`,
    },
    {
      label: "7일 평균 완료율",
      value: `${report.recentAverageGrowthRate}%`,
    },
  ];

  return (
    <View style={styles.summaryGrid}>
      {stats.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          style={styles.summaryCard}
        />
      ))}
    </View>
  );
}

function InsightSection({ insights }: { insights: ReportInsight[] }) {
  if (insights.length === 0) return null;

  return (
    <ReportSection title="이번 달 인사이트">
      <RetroCard style={styles.insightCard}>
        {insights.map((insight, index) => (
          <View
            key={insight.id}
            style={[
              styles.insightRow,
              index < insights.length - 1 && styles.insightBorder,
            ]}
          >
            <View style={styles.insightDot} />
            <Text style={styles.insightText}>{insight.text}</Text>
          </View>
        ))}
      </RetroCard>
    </ReportSection>
  );
}

function TagStats({ tags }: { tags: TagStat[] }) {
  return (
    <ReportSection title="자주 쓴 태그 TOP 5">
      <RetroCard style={styles.listCard}>
        {tags.length > 0 ? (
          tags.map((item, index) => (
            <StatRow
              key={item.tag}
              label={`#${item.tag}`}
              value={`${item.count}회`}
              highlighted
              showBorder={index < tags.length - 1}
            />
          ))
        ) : (
          <SectionEmptyText text="태그를 남기면 자주 다룬 주제가 여기에 정리돼요." />
        )}
      </RetroCard>
    </ReportSection>
  );
}

function MonthlyLogChart({ months }: { months: MonthlyLogStat[] }) {
  const maxMonthlyCount = Math.max(1, ...months.map((item) => item.count));

  return (
    <ReportSection title="최근 6개월 기록">
      <RetroCard style={styles.chartCard}>
        <View style={styles.chart}>
          {months.map((item) => (
            <View key={item.month} style={styles.chartColumn}>
              <Text style={styles.chartCount}>{item.count}</Text>
              <View style={styles.chartTrack}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height:
                        item.count === 0
                          ? 4
                          : Math.max(14, (item.count / maxMonthlyCount) * 108),
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>
                {Number(item.month.slice(5))}월
              </Text>
            </View>
          ))}
        </View>
      </RetroCard>
    </ReportSection>
  );
}

function MoodStats({ moods }: { moods: MoodStat[] }) {
  return (
    <ReportSection title="기분별 기록">
      <RetroCard style={styles.listCard}>
        {moods.length > 0 ? (
          moods.map((item, index) => (
            <StatRow
              key={item.mood}
              label={getMoodLabel(item.mood)}
              value={`${item.count}개`}
              showBorder={index < moods.length - 1}
            />
          ))
        ) : (
          <SectionEmptyText text="오늘 상태를 선택한 기록이 쌓이면 여기에 정리돼요." />
        )}
      </RetroCard>
    </ReportSection>
  );
}

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatRow({
  label,
  value,
  highlighted = false,
  showBorder,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
  showBorder: boolean;
}) {
  return (
    <View style={[styles.listRow, showBorder && styles.rowBorder]}>
      <Text
        style={[styles.rowLabel, highlighted && styles.highlightedLabel]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text style={styles.countText}>{value}</Text>
    </View>
  );
}

function SectionEmptyText({ text }: { text: string }) {
  return <Text style={styles.sectionEmpty}>{text}</Text>;
}

function EmptyReportState({ onWrite }: { onWrite: () => void }) {
  return (
    <RetroCard style={styles.emptyCard}>
      <Text style={styles.emptyTitle}>아직 리포트를 만들 기록이 부족해요.</Text>
      <Text style={styles.emptyText}>오늘 첫 기록을 남겨보세요.</Text>
      <PrimaryButton
        label="오늘 기록하기"
        style={styles.emptyButton}
        onPress={onWrite}
      />
    </RetroCard>
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    minWidth: 136,
    flexBasis: "47%",
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    marginBottom: 12,
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  insightCard: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
  },
  insightBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  insightDot: {
    width: 6,
    height: 6,
    marginTop: 7,
    borderRadius: 3,
    backgroundColor: DESIGN.colors.secondary,
  },
  insightText: {
    flex: 1,
    color: DESIGN.colors.text,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
  listCard: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  listRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  rowLabel: {
    flex: 1,
    color: DESIGN.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  highlightedLabel: {
    color: DESIGN.colors.primaryLight,
  },
  countText: {
    color: DESIGN.colors.textDim,
    fontSize: 13,
    fontWeight: "600",
  },
  sectionEmpty: {
    paddingVertical: 20,
    color: DESIGN.colors.textDim,
    fontSize: 13,
    lineHeight: 20,
  },
  chartCard: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
  },
  chart: {
    height: 168,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
    minWidth: 32,
  },
  chartCount: {
    marginBottom: 7,
    color: DESIGN.colors.textDim,
    fontSize: 11,
    fontWeight: "600",
  },
  chartTrack: {
    width: "100%",
    height: 112,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: DESIGN.colors.bgSecondary,
  },
  chartBar: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: DESIGN.colors.secondary,
  },
  chartLabel: {
    marginTop: 8,
    color: DESIGN.colors.textDim,
    fontSize: 11,
  },
  emptyCard: {
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 8,
    color: DESIGN.colors.textDim,
    fontSize: 14,
    textAlign: "center",
  },
  emptyButton: {
    alignSelf: "stretch",
    marginTop: 24,
  },
});
