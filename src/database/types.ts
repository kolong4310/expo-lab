export interface WorkLog {
  id?: number;
  title: string;
  daily_summary?: string;
  tags?: string;
  content: string;
  learned: string;
  issue: string;
  solution: string;
  memo: string;
  mood?: string;
  date: string;
}

export interface Goal {
  id?: number;
  title: string;
  category: string;
  is_active: number;
  created_at: string;
}

export interface GoalCheck {
  id?: number;
  goal_id: number;
  check_date: string;
  is_done: number;
}

export interface TodayOnlyGoal {
  id?: number;
  title: string;
  goal_date: string;
  is_done: number;
  created_at: string;
}

export interface DailyGoalWithCheck {
  goal_id: number;
  title: string;
  category: string;
  is_done: number;
}

export interface DailyGoalWithStats extends DailyGoalWithCheck {
  streak: number;
}

export interface GrowthStats {
  total: number;
  completed: number;
  rate: number;
}

export interface MonthlyStats {
  month: string;
  logCount: number;
  activeDays: number;
  averageGoalRate: number;
}

export interface TagStat {
  tag: string;
  count: number;
}

export interface MonthlyLogStat {
  month: string;
  count: number;
}

export interface MoodStat {
  mood: string;
  count: number;
}

export interface ReportStats {
  totalLogCount: number;
  currentMonthLogCount: number;
  currentWeekLogCount: number;
  logStreak: number;
  recentAverageGrowthRate: number;
  topTags: TagStat[];
  recentMonthlyLogs: MonthlyLogStat[];
  moodStats: MoodStat[];
}
