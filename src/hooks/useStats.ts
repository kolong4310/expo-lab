import { useCallback, useState } from "react";
import { getCurrentStreak, getGrowthStats } from "../database/db";

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

  const refreshStats = useCallback(() => {
    setStreak(getCurrentStreak());
    setStats(getGrowthStats(date));
  }, [date]);

  return {
    streak,
    stats,
    refreshStats,
  };
};
