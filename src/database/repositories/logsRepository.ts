import { execute, queryAll } from "../db";
import { WorkLog } from "../types";
import { formatLocalDate } from "../../utils/date";

export const getAllLogs = (): WorkLog[] =>
  queryAll<WorkLog>("SELECT * FROM logs ORDER BY date DESC");

export const getLogsByDate = (date: string): WorkLog[] =>
  queryAll<WorkLog>("SELECT * FROM logs WHERE date = ? ORDER BY id DESC", [
    date,
  ]);

export const addLog = (log: WorkLog) => {
  execute(
    "INSERT INTO logs (title, daily_summary, tags, content, learned, issue, solution, memo, mood, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      log.title,
      log.daily_summary || null,
      log.tags || null,
      log.content,
      log.learned,
      log.issue,
      log.solution,
      log.memo,
      log.mood || null,
      log.date,
    ],
  );
};

export const updateLog = (log: WorkLog) => {
  execute(
    "UPDATE logs SET title = ?, daily_summary = ?, tags = ?, content = ?, learned = ?, issue = ?, solution = ?, memo = ?, mood = ? WHERE id = ?",
    [
      log.title,
      log.daily_summary || null,
      log.tags || null,
      log.content,
      log.learned,
      log.issue,
      log.solution,
      log.memo,
      log.mood || null,
      log.id!,
    ],
  );
};

export const deleteLog = (id: number) => {
  execute("DELETE FROM logs WHERE id = ?", [id]);
};

export const getLoggedDates = (): string[] =>
  queryAll<{ date: string }>(
    "SELECT DISTINCT date FROM logs ORDER BY date DESC",
  ).map((row) => row.date);

export const searchLogs = (keyword: string): WorkLog[] => {
  const pattern = `%${keyword}%`;
  return queryAll<WorkLog>(
    `
      SELECT * FROM logs
      WHERE title LIKE ?
      OR daily_summary LIKE ?
      OR tags LIKE ?
      OR content LIKE ?
      OR learned LIKE ?
      OR issue LIKE ?
      OR solution LIKE ?
      OR memo LIKE ?
      ORDER BY date DESC
    `,
    Array(8).fill(pattern),
  );
};

export const getLogStreak = (): number => {
  const dates = getLoggedDates();
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
