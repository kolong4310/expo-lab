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
import { TranslationKey } from "../i18n/translations";
import { useTranslation } from "../i18n/useTranslation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
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

type Translate = ReturnType<typeof useTranslation>["t"];

const MOOD_LABEL_KEYS: Record<string, TranslationKey> = {
  best: "mood.best",
  good: "mood.good",
  normal: "mood.normal",
  hard: "mood.hard",
};

type ReportInsight = {
  id: string;
  text: string;
};

const getMoodLabel = (mood: string, t: Translate): string => {
  const key = MOOD_LABEL_KEYS[mood];
  return key ? t(key) : mood;
};

const buildReportSubtitle = (report: ReportStats, t: Translate): string => {
  if (report.totalLogCount === 0) {
    return t("report.emptySubtitle");
  }

  if (report.logStreak >= 2) {
    return t("report.streakSubtitle", { count: report.logStreak });
  }

  if (report.currentMonthLogCount > 0) {
    return t("report.monthSubtitle", { count: report.currentMonthLogCount });
  }

  return t("report.defaultSubtitle");
};

const buildReportInsights = (
  report: ReportStats,
  t: Translate,
): ReportInsight[] => {
  if (report.totalLogCount === 0) return [];

  const insights: ReportInsight[] = [];
  const topTag = report.topTags[0];
  const topMood = report.moodStats[0];

  if (report.currentMonthLogCount > 0) {
    insights.push({
      id: "month-log-count",
      text:
        report.currentMonthLogCount === 1
          ? t("report.insight.monthFirst")
          : t("report.insight.monthCount", {
              count: report.currentMonthLogCount,
            }),
    });
  }

  if (report.logStreak >= 2) {
    insights.push({
      id: "streak",
      text: t("report.insight.streak", { count: report.logStreak }),
    });
  }

  if (report.recentAverageGrowthRate >= 50) {
    insights.push({
      id: "goal-rate-good",
      text: t("report.insight.goalRateGood", {
        rate: report.recentAverageGrowthRate,
      }),
    });
  } else if (report.recentAverageGrowthRate > 0) {
    insights.push({
      id: "goal-rate-started",
      text: t("report.insight.goalRateStarted", {
        rate: report.recentAverageGrowthRate,
      }),
    });
  }

  if (topTag) {
    insights.push({
      id: "top-tag",
      text: t("report.insight.topTagOverall", { tag: topTag.tag }),
    });
  }

  if (topMood) {
    insights.push({
      id: "top-mood",
      text: t("report.insight.topMoodOverall", {
        mood: getMoodLabel(topMood.mood, t),
      }),
    });
  }

  if (insights.length === 1 && report.totalLogCount === 1) {
    insights.push({
      id: "first-baseline",
      text: t("report.insight.firstBaseline"),
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
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
  const [report, setReport] = useState<ReportStats>(EMPTY_REPORT);
  const reportSnapshotRef = useRef(JSON.stringify(EMPTY_REPORT));
  const reportSubtitle = buildReportSubtitle(report, t);

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
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.backgroundBlob, styles.backgroundBlobBlue]} />
        <View style={[styles.backgroundBlob, styles.backgroundBlobMint]} />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
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
  const { t } = useTranslation();

  return (
    <>
      <SummaryGrid report={report} />
      <InsightSection insights={buildReportInsights(report, t)} />
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
            accent={(["green", "yellow", "cyan", "pink"] as const)[index]}
            style={[
              styles.summaryCard,
              index % 2 === 0
                ? styles.summaryCardLeft
                : styles.summaryCardRight,
            ]}
          />
        </FadeInView>
      ))}
    </View>
  );
}

function InsightSection({ insights }: { insights: ReportInsight[] }) {
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();
  if (insights.length === 0) return null;

  return (
    <ReportSection title={t("report.insightsTitle")}>
      <FadeInView delay={120}>
        <RetroCard
          style={[
            styles.insightCard,
            mode === "light" && styles.lightInsightCard,
          ]}
        >
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
  const { mode } = useAppTheme();
  return (
    <ReportSection title={t("report.topTagsTitle")}>
      <RetroCard
        style={[styles.listCard, mode === "light" && styles.lightListCard]}
      >
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
  const { mode, theme } = useAppTheme();
  const maxMonthlyCount = Math.max(1, ...months.map((item) => item.count));

  return (
    <ReportSection title={t("report.recentMonthsTitle")}>
      <RetroCard
        style={[styles.chartCard, mode === "light" && styles.lightChartCard]}
      >
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
                {t("report.monthLabel", {
                  month: Number(item.month.slice(5)),
                })}
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
  const { mode, theme } = useAppTheme();
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
        {
          height,
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.green : theme.colors.primary,
        },
      ]}
    />
  );
}

function MoodStats({ moods }: { moods: MoodStat[] }) {
  const { t } = useTranslation();
  const { mode } = useAppTheme();
  return (
    <ReportSection title={t("report.moodStatsTitle")}>
      <RetroCard
        style={[styles.listCard, mode === "light" && styles.lightListCard]}
      >
        {moods.length > 0 ? (
          moods.map((item, index) => (
            <StatRow
              key={item.mood}
              label={getMoodLabel(item.mood, t)}
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
  const { mode, theme } = useAppTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View
          style={[
            styles.sectionDot,
            {
              backgroundColor:
                mode === "light" ? LIGHT_PASTEL.green : theme.colors.secondary,
            },
          ]}
        />
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
      </View>
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
  const { mode, theme } = useAppTheme();

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
          {
            color: highlighted
              ? mode === "light"
                ? LIGHT_PASTEL.greenText
                : theme.colors.secondary
              : theme.colors.text,
          },
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
  const { mode, theme } = useAppTheme();

  return (
    <FadeInView>
      <RetroCard
        style={[styles.emptyCard, mode === "light" && styles.lightEmptyCard]}
      >
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
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobBlue: {
    top: 70,
    right: -120,
    width: 270,
    height: 270,
    backgroundColor: "rgba(220,233,247,0.62)",
  },
  backgroundBlobMint: {
    top: 620,
    left: -140,
    width: 280,
    height: 280,
    backgroundColor: "rgba(221,242,210,0.5)",
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
    minWidth: 120,
    flexBasis: "46%",
  },
  summaryCard: {
    flex: 1,
  },
  summaryCardLeft: {
    transform: [{ rotate: "-1deg" }],
  },
  summaryCardRight: {
    transform: [{ rotate: "1deg" }],
  },
  section: {
    marginTop: 22,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionDot: {
    width: 10,
    height: 10,
    marginRight: 9,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  insightCard: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  lightInsightCard: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 28,
    backgroundColor: LIGHT_PASTEL.paperWarm,
    ...LIGHT_PASTEL_CARD_SHADOW,
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
  lightListCard: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 26,
    backgroundColor: LIGHT_PASTEL.paper,
    ...LIGHT_PASTEL_CARD_SHADOW,
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
  lightChartCard: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 28,
    backgroundColor: LIGHT_PASTEL.blue,
    ...LIGHT_PASTEL_CARD_SHADOW,
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
  lightEmptyCard: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 30,
    backgroundColor: LIGHT_PASTEL.paperWarm,
    ...LIGHT_PASTEL_CARD_SHADOW,
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
