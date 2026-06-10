import { queryAll, queryFirst } from "../db";
import { GrowthStats, MonthlyStats, TagStat } from "../types";
import { formatLocalDate } from "../../utils/date";
import { getDailyGoalsWithCheck, getTodayOnlyGoals } from "./goalsRepository";

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

export const getTagStats = (): TagStat[] => {
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
    .sort((a, b) => b.count - a.count);
};
