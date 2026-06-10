import { execute, queryAll } from "../db";
import {
  DailyGoalWithCheck,
  DailyGoalWithStats,
  Goal,
  TodayOnlyGoal,
} from "../types";
import { formatLocalDate } from "../../utils/date";

export const getActiveGoals = (): Goal[] =>
  queryAll<Goal>("SELECT * FROM goals WHERE is_active = 1 ORDER BY id DESC");

export const getAllGoals = (): Goal[] =>
  queryAll<Goal>("SELECT * FROM goals ORDER BY id DESC");

export const addGoal = (title: string, category: string) => {
  execute(
    "INSERT INTO goals (title, category, is_active, created_at) VALUES (?, ?, 1, ?)",
    [title, category, new Date().toISOString()],
  );
};

export const updateGoal = (
  id: number,
  title: string,
  category: string,
  isActive: number,
) => {
  execute(
    "UPDATE goals SET title = ?, category = ?, is_active = ? WHERE id = ?",
    [title, category, isActive, id],
  );
};

export const getDailyGoalsWithCheck = (date: string): DailyGoalWithCheck[] =>
  queryAll<DailyGoalWithCheck>(
    `
      SELECT
        g.id as goal_id,
        g.title,
        g.category,
        COALESCE(c.is_done, 0) as is_done
      FROM goals g
      LEFT JOIN goal_checks c ON g.id = c.goal_id AND c.check_date = ?
      WHERE g.is_active = 1 OR (c.is_done = 1)
      ORDER BY g.id DESC
    `,
    [date],
  );

export const toggleGoalCheck = (
  goalId: number,
  date: string,
  isDone: number,
) => {
  execute(
    `
      INSERT INTO goal_checks (goal_id, check_date, is_done, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(goal_id, check_date) DO UPDATE SET is_done = excluded.is_done
    `,
    [goalId, date, isDone, new Date().toISOString()],
  );
};

export const getTodayOnlyGoals = (date: string): TodayOnlyGoal[] =>
  queryAll<TodayOnlyGoal>(
    "SELECT * FROM today_only_goals WHERE goal_date = ? ORDER BY id DESC",
    [date],
  );

export const addTodayOnlyGoal = (title: string, date: string) => {
  execute(
    "INSERT INTO today_only_goals (title, goal_date, is_done, created_at) VALUES (?, ?, 0, ?)",
    [title, date, new Date().toISOString()],
  );
};

export const toggleTodayOnlyGoal = (id: number, isDone: number) => {
  execute("UPDATE today_only_goals SET is_done = ? WHERE id = ?", [isDone, id]);
};

export const deleteTodayOnlyGoal = (id: number) => {
  execute("DELETE FROM today_only_goals WHERE id = ?", [id]);
};

export const getGoalStreak = (goalId: number): number => {
  const dates = queryAll<{ check_date: string }>(
    "SELECT check_date FROM goal_checks WHERE goal_id = ? AND is_done = 1 ORDER BY check_date DESC",
    [goalId],
  ).map((row) => row.check_date);
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    dates[0] !== formatLocalDate(today) &&
    dates[0] !== formatLocalDate(yesterday)
  ) {
    return 0;
  }

  let streak = 1;
  let previousDate = new Date(`${dates[0]}T00:00:00`);
  for (let index = 1; index < dates.length; index++) {
    const currentDate = new Date(`${dates[index]}T00:00:00`);
    const diffDays = Math.round(
      (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays !== 1) break;
    streak++;
    previousDate = currentDate;
  }
  return streak;
};

export const getDailyGoalsWithStats = (date: string): DailyGoalWithStats[] =>
  getDailyGoalsWithCheck(date).map((goal) => ({
    ...goal,
    streak: getGoalStreak(goal.goal_id),
  }));

export const getCurrentStreak = (): number => {
  const dates = queryAll<{ check_date: string }>(
    "SELECT DISTINCT check_date FROM goal_checks WHERE is_done = 1 ORDER BY check_date DESC",
  ).map((row) => row.check_date);
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    dates[0] !== formatLocalDate(today) &&
    dates[0] !== formatLocalDate(yesterday)
  ) {
    return 0;
  }

  let streak = 1;
  let previousDate = new Date(`${dates[0]}T00:00:00`);
  for (let index = 1; index < dates.length; index++) {
    const currentDate = new Date(`${dates[index]}T00:00:00`);
    const diffDays = Math.round(
      (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays !== 1) break;
    streak++;
    previousDate = currentDate;
  }
  return streak;
};
