import { useCallback, useState } from "react";
import {
  getCurrentStreak,
  getGrowthStats,
  getRecentGrowthRates,
} from "../database/db";

export interface GrowthStats {
  total: number;
  completed: number;
  rate: number;
}

const EMPTY_STATS: GrowthStats = {
  total: 0,
  completed: 0,
  rate: 0,
};

export const useStats = (date: string) => {
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<GrowthStats>(EMPTY_STATS);
  const [recentRates, setRecentRates] = useState<number[]>([]);
  const [weeklyRate, setWeeklyRate] = useState(0);

  const refreshStats = useCallback(() => {
    setStreak(getCurrentStreak());
    setStats(getGrowthStats(date));
    const rates = getRecentGrowthRates().map((item) => item.rate);
    setRecentRates(rates);
    setWeeklyRate(
      rates.length > 0
        ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length)
        : 0,
    );
  }, [date]);

  return {
    streak,
    stats,
    recentRates,
    weeklyRate,
    refreshStats,
  };
};
