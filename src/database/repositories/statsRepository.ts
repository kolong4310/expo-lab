import { queryAll, queryFirst } from "../db";
import {
  GrowthStats,
  MonthlyLogStat,
  MonthlyStats,
  MoodStat,
  ReportStats,
  TagStat,
} from "../types";
import { formatLocalDate } from "../../utils/date";
import { getDailyGoalsWithCheck, getTodayOnlyGoals } from "./goalsRepository";
import { getLogStreak } from "./logsRepository";

const formatMonth = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getLocalWeekStart = (date = new Date()): Date => {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  return weekStart;
};

export const getGrowthStats = (date: string): GrowthStats => {
  const dailyItems = getDailyGoalsWithCheck(date);
  const todayOnlyItems = getTodayOnlyGoals(date);
  const total = dailyItems.length + todayOnlyItems.length;
  if (total === 0) return { total: 0, completed: 0, rate: 0 };

  const completed =
    dailyItems.filter((item) => item.is_done === 1).length +
    todayOnlyItems.filter((item) => item.is_done === 1).length;
  return { total, completed, rate: Math.round((completed / total) * 100) };
};

export const getRecentGrowthRates = (days = 7) =>
  Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    const dateString = formatLocalDate(date);
    return { date: dateString, rate: getGrowthStats(dateString).rate };
  });

export const getRecentAverageGrowthRate = (days = 7): number => {
  const rates = getRecentGrowthRates(days).map((item) => item.rate);
  return rates.length
    ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length)
    : 0;
};

export const getMonthlyStats = (month: string): MonthlyStats => {
  const logStats = queryFirst<{ logCount: number; activeDays: number }>(
    `
        SELECT COUNT(*) AS logCount, COUNT(DISTINCT date) AS activeDays
        FROM logs
        WHERE date LIKE ?
      `,
    [`${month}%`],
  ) ?? { logCount: 0, activeDays: 0 };

  const today = new Date();
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay =
    year === today.getFullYear() && monthNumber === today.getMonth() + 1
      ? today.getDate()
      : new Date(year, monthNumber, 0).getDate();
  const rates = Array.from(
    { length: lastDay },
    (_, index) =>
      getGrowthStats(`${month}-${String(index + 1).padStart(2, "0")}`).rate,
  );

  return {
    month,
    logCount: logStats.logCount,
    activeDays: logStats.activeDays,
    averageGoalRate: rates.length
      ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length)
      : 0,
  };
};

export const getTagStats = (limit?: number): TagStat[] => {
  const rows = queryAll<{ tags: string | null }>(
    "SELECT tags FROM logs WHERE tags IS NOT NULL AND tags != ''",
  );
  const counts = new Map<string, number>();

  rows.forEach(({ tags }) => {
    tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
};

export const getLogCount = (): number =>
  queryFirst<{ count: number }>("SELECT COUNT(*) AS count FROM logs")?.count ??
  0;

export const getCurrentMonthLogCount = (): number =>
  queryFirst<{ count: number }>(
    "SELECT COUNT(*) AS count FROM logs WHERE date LIKE ?",
    [`${formatMonth(new Date())}%`],
  )?.count ?? 0;

export const getCurrentWeekLogCount = (): number => {
  const weekStart = getLocalWeekStart();

  return (
    queryFirst<{ count: number }>(
      "SELECT COUNT(*) AS count FROM logs WHERE date >= ? AND date <= ?",
      [formatLocalDate(weekStart), formatLocalDate()],
    )?.count ?? 0
  );
};

export const getRecentMonthlyLogStats = (months = 6): MonthlyLogStat[] => {
  const monthCount = Math.max(1, months);
  const monthKeys = Array.from({ length: monthCount }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (monthCount - index - 1));
    return formatMonth(date);
  });
  const counts = queryAll<{ month: string; count: number }>(
    `
      SELECT substr(date, 1, 7) AS month, COUNT(*) AS count
      FROM logs
      WHERE date >= ?
      GROUP BY substr(date, 1, 7)
      ORDER BY month ASC
    `,
    [`${monthKeys[0]}-01`],
  );
  const countByMonth = new Map(counts.map((item) => [item.month, item.count]));

  return monthKeys.map((month) => ({
    month,
    count: countByMonth.get(month) ?? 0,
  }));
};

export const getMoodStats = (): MoodStat[] =>
  queryAll<MoodStat>(
    `
      SELECT mood, COUNT(*) AS count
      FROM logs
      WHERE mood IS NOT NULL AND mood != ''
      GROUP BY mood
      ORDER BY count DESC, mood ASC
    `,
  );

export const getReportStats = (): ReportStats => {
  return {
    totalLogCount: getLogCount(),
    currentMonthLogCount: getCurrentMonthLogCount(),
    currentWeekLogCount: getCurrentWeekLogCount(),
    logStreak: getLogStreak(),
    recentAverageGrowthRate: getRecentAverageGrowthRate(),
    topTags: getTagStats(5),
    recentMonthlyLogs: getRecentMonthlyLogStats(),
    moodStats: getMoodStats(),
  };
};
