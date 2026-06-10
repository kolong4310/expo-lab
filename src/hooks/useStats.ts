import { useCallback, useState } from "react";
import {
  getGrowthStats,
  getRecentAverageGrowthRate,
  getRecentGrowthRates,
} from "../database/repositories/statsRepository";
import { getLogStreak } from "../database/repositories/logsRepository";

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
    setStreak(getLogStreak());
    setStats(getGrowthStats(date));
    const rates = getRecentGrowthRates().map((item) => item.rate);
    setRecentRates(rates);
    setWeeklyRate(getRecentAverageGrowthRate());
  }, [date]);

  return {
    streak,
    stats,
    recentRates,
    weeklyRate,
    refreshStats,
  };
};
