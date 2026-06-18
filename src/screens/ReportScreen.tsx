import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import FadeInView from "../components/FadeInView";
import PrimaryButton from "../components/PrimaryButton";
import StatCard from "../components/StatCard";
import TinySprout from "../components/TinySprout";
import RetroCard from "../components/ui/RetroCard";
import { getReportStats } from "../database/repositories/statsRepository";
import {
  MonthlyLogStat,
  MoodStat,
  ReportStats,
  TagStat,
} from "../database/types";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";

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
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const [report, setReport] = useState<ReportStats>(EMPTY_REPORT);
  const reportSnapshotRef = useRef(JSON.stringify(EMPTY_REPORT));
  const reportSubtitle =
    report.totalLogCount === 0
      ? t("report.emptySubtitle")
      : report.logStreak >= 2
        ? t("report.streakSubtitle", { count: report.logStreak })
        : report.currentMonthLogCount > 0
          ? t("report.monthSubtitle", { count: report.currentMonthLogCount })
          : t("report.defaultSubtitle");

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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 116 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title={t("report.title")}
          subtitle={reportSubtitle}
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
  const { t } = useTranslation();
  const stats = [
    {
      label: t("report.monthlyLogs"),
      value: `${report.currentMonthLogCount}${t("report.countUnit")}`,
    },
    {
      label: t("report.weeklyLogs"),
      value: `${report.currentWeekLogCount}${t("report.countUnit")}`,
    },
    {
      label: t("report.logStreak"),
      value: `${report.logStreak}${t("report.dayUnit")}`,
    },
    {
      label: t("report.sevenDayAverage"),
      value: `${report.recentAverageGrowthRate}%`,
    },
  ];

  return (
    <View style={styles.summaryGrid}>
      {stats.map((item, index) => (
        <FadeInView
          key={item.label}
          delay={index * 45}
          style={styles.summaryItem}
        >
          <StatCard
            label={item.label}
            value={item.value}
            style={styles.summaryCard}
          />
        </FadeInView>
      ))}
    </View>
  );
}

function InsightSection({ insights }: { insights: ReportInsight[] }) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  if (insights.length === 0) return null;

  return (
    <ReportSection title={t("report.insightsTitle")}>
      <FadeInView delay={120}>
        <RetroCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <TinySprout size={34} />
            <Text
              style={[styles.insightHeaderText, { color: theme.colors.muted }]}
            >
              {t("report.defaultSubtitle")}
            </Text>
          </View>
          {insights.map((insight, index) => (
            <View
              key={insight.id}
              style={[
                styles.insightRow,
                index < insights.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.insightDot,
                  { backgroundColor: theme.colors.secondary },
                ]}
              />
              <Text style={[styles.insightText, { color: theme.colors.text }]}>
                {insight.text}
              </Text>
            </View>
          ))}
        </RetroCard>
      </FadeInView>
    </ReportSection>
  );
}

function TagStats({ tags }: { tags: TagStat[] }) {
  const { t } = useTranslation();
  return (
    <ReportSection title={t("report.topTagsTitle")}>
      <RetroCard style={styles.listCard}>
        {tags.length > 0 ? (
          tags.map((item, index) => (
            <StatRow
              key={item.tag}
              label={`#${item.tag}`}
              value={`${item.count}${t("report.countUnit")}`}
              highlighted
              showBorder={index < tags.length - 1}
            />
          ))
        ) : (
          <SectionEmptyText text={t("report.topTagsEmpty")} />
        )}
      </RetroCard>
    </ReportSection>
  );
}

function MonthlyLogChart({ months }: { months: MonthlyLogStat[] }) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const maxMonthlyCount = Math.max(1, ...months.map((item) => item.count));

  return (
    <ReportSection title={t("report.recentMonthsTitle")}>
      <RetroCard style={styles.chartCard}>
        <View style={styles.chart}>
          {months.map((item, index) => (
            <View key={item.month} style={styles.chartColumn}>
              <Text style={[styles.chartCount, { color: theme.colors.muted }]}>
                {item.count}
              </Text>
              <View
                style={[
                  styles.chartTrack,
                  { backgroundColor: `${theme.colors.primary}14` },
                ]}
              >
                <AnimatedMonthlyBar
                  count={item.count}
                  maxCount={maxMonthlyCount}
                  delay={index * 35}
                />
              </View>
              <Text style={[styles.chartLabel, { color: theme.colors.muted }]}>
                {Number(item.month.slice(5))}월
              </Text>
            </View>
          ))}
        </View>
      </RetroCard>
    </ReportSection>
  );
}

function AnimatedMonthlyBar({
  count,
  delay,
  maxCount,
}: {
  count: number;
  delay: number;
  maxCount: number;
}) {
  const { theme } = useAppTheme();
  const progress = useRef(new Animated.Value(0)).current;
  const targetHeight = count === 0 ? 4 : Math.max(14, (count / maxCount) * 108);

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      delay,
      useNativeDriver: false,
    }).start();
  }, [delay, progress, targetHeight]);

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [4, targetHeight],
  });

  return (
    <Animated.View
      style={[
        styles.chartBar,
        { height, backgroundColor: theme.colors.primary },
      ]}
    />
  );
}

function MoodStats({ moods }: { moods: MoodStat[] }) {
  const { t } = useTranslation();
  return (
    <ReportSection title={t("report.moodStatsTitle")}>
      <RetroCard style={styles.listCard}>
        {moods.length > 0 ? (
          moods.map((item, index) => (
            <StatRow
              key={item.mood}
              label={getMoodLabel(item.mood)}
              value={`${item.count}${t("report.countUnit")}`}
              showBorder={index < moods.length - 1}
            />
          ))
        ) : (
          <SectionEmptyText text={t("report.moodEmpty")} />
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
  const { theme } = useAppTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
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
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.listRow,
        showBorder && {
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.rowLabel,
          { color: highlighted ? theme.colors.secondary : theme.colors.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text style={[styles.countText, { color: theme.colors.muted }]}>
        {value}
      </Text>
    </View>
  );
}

function SectionEmptyText({ text }: { text: string }) {
  const { theme } = useAppTheme();

  return (
    <Text style={[styles.sectionEmpty, { color: theme.colors.muted }]}>
      {text}
    </Text>
  );
}

function EmptyReportState({ onWrite }: { onWrite: () => void }) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <FadeInView>
      <RetroCard style={styles.emptyCard}>
        <TinySprout size={58} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          {t("report.emptyTitle")}
        </Text>
        <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
          {t("report.emptyText")}
        </Text>
        <PrimaryButton
          label={t("report.writeToday")}
          style={styles.emptyButton}
          onPress={onWrite}
        />
      </RetroCard>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  summaryItem: {
    minWidth: 136,
    flexBasis: "47%",
  },
  summaryCard: {
    flex: 1,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 17,
    fontWeight: "700",
  },
  insightCard: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  insightHeaderText: {
    flex: 1,
    color: DESIGN.colors.textDim,
    fontSize: 13,
    lineHeight: 19,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
  },
  insightDot: {
    width: 6,
    height: 6,
    marginTop: 7,
    borderRadius: 3,
  },
  insightText: {
    flex: 1,
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
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
  },
  sectionEmpty: {
    paddingVertical: 20,
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
    fontSize: 11,
    fontWeight: "600",
  },
  chartTrack: {
    width: "100%",
    height: 112,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 10,
  },
  chartBar: {
    width: "100%",
    borderRadius: 10,
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 11,
  },
  emptyCard: {
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  emptyButton: {
    alignSelf: "stretch",
    marginTop: 24,
  },
});
