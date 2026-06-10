import * as SQLite from "expo-sqlite";
import { formatLocalDate } from "../utils/date";

/**
 * 로그 데이터 타입 정의 (Insight)
 */
export interface WorkLog {
  id?: number;
  title: string; // 오늘 한 일 요약
  daily_summary?: string; // 오늘을 한 문장으로
  tags?: string; // 태그 (콤마 구분)
  content: string; // 상세 내용
  learned: string; // 배운 것
  issue: string; // 이슈
  solution: string; // 해결 방법
  memo: string; // 메모
  mood?: string; // 오늘의 기분 (emoji)
  date: string; // 작성 날짜 (YYYY-MM-DD)
}

/**
 * 반복 목표 (Template)
 */
export interface Goal {
  id?: number;
  title: string;
  category: string;
  is_active: number; // 0 or 1
  created_at: string;
}

/**
 * 날짜별 목표 달성 기록
 */
export interface GoalCheck {
  id?: number;
  goal_id: number;
  check_date: string;
  is_done: number; // 0 or 1
}

export interface TodayOnlyGoal {
  id?: number;
  title: string;
  goal_date: string;
  is_done: number; // 0 or 1
  created_at: string;
}

const db = SQLite.openDatabaseSync("work_logs.db");

/**
 * 데이터베이스 초기화
 */
export const initDatabase = () => {
  // 1. 인사이트 로그 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      daily_summary TEXT,
      tags TEXT,
      content TEXT,
      learned TEXT,
      issue TEXT,
      solution TEXT,
      memo TEXT,
      mood TEXT,
      date TEXT NOT NULL
    );
  `);

  // 2. 반복 목표 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // 3. 목표 달성 체크 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS goal_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      check_date TEXT NOT NULL,
      is_done INTEGER DEFAULT 0,
      created_at TEXT,
      UNIQUE(goal_id, check_date)
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS today_only_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      goal_date TEXT NOT NULL,
      is_done INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Legacy 지원 (필요시)
  try {
    db.execSync("ALTER TABLE logs ADD COLUMN mood TEXT;");
  } catch (e) {}
  try {
    db.execSync("ALTER TABLE logs ADD COLUMN daily_summary TEXT;");
  } catch (e) {}
  try {
    db.execSync("ALTER TABLE logs ADD COLUMN tags TEXT;");
  } catch (e) {}
  try {
    db.execSync("ALTER TABLE today_only_goals ADD COLUMN goal_date TEXT;");
  } catch (e) {}
  try {
    db.execSync(
      "ALTER TABLE today_only_goals ADD COLUMN is_done INTEGER DEFAULT 0;",
    );
  } catch (e) {}
  try {
    db.execSync("ALTER TABLE today_only_goals ADD COLUMN created_at TEXT;");
  } catch (e) {}
  try {
    db.execSync(
      "UPDATE today_only_goals SET goal_date = date WHERE goal_date IS NULL;",
    );
  } catch (e) {}

  console.log("Database system initialized! ✅");
};

/**
 * Goal CRUD
 */
export const getActiveGoals = (): Goal[] => {
  return db.getAllSync<Goal>(
    "SELECT * FROM goals WHERE is_active = 1 ORDER BY id DESC",
  );
};

export const getAllGoals = (): Goal[] => {
  return db.getAllSync<Goal>("SELECT * FROM goals ORDER BY id DESC");
};

export const addGoal = (title: string, category: string) => {
  const now = new Date().toISOString();
  const statement = db.prepareSync(
    "INSERT INTO goals (title, category, is_active, created_at) VALUES (?, ?, 1, ?)",
  );
  try {
    statement.executeSync([title, category, now]);
  } finally {
    statement.finalizeSync();
  }
};

export const updateGoal = (
  id: number,
  title: string,
  category: string,
  isActive: number,
) => {
  const statement = db.prepareSync(
    "UPDATE goals SET title = ?, category = ?, is_active = ? WHERE id = ?",
  );
  try {
    statement.executeSync([title, category, isActive, id]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * Daily Goal Checks
 */
export const getDailyGoalsWithCheck = (date: string) => {
  const query = `
    SELECT
      g.id as goal_id,
      g.title,
      g.category,
      COALESCE(c.is_done, 0) as is_done
    FROM goals g
    LEFT JOIN goal_checks c ON g.id = c.goal_id AND c.check_date = ?
    WHERE g.is_active = 1 OR (c.is_done = 1)
    ORDER BY g.id DESC
  `;
  const statement = db.prepareSync(query);
  try {
    const result = statement.executeSync<any>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

export const toggleGoalCheck = (
  goalId: number,
  date: string,
  isDone: number,
) => {
  const statement = db.prepareSync(`
    INSERT INTO goal_checks (goal_id, check_date, is_done, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(goal_id, check_date) DO UPDATE SET is_done = excluded.is_done
  `);
  try {
    statement.executeSync([goalId, date, isDone, new Date().toISOString()]);
  } finally {
    statement.finalizeSync();
  }
};

export const getTodayOnlyGoals = (date: string): TodayOnlyGoal[] => {
  const statement = db.prepareSync(
    "SELECT * FROM today_only_goals WHERE goal_date = ? ORDER BY id DESC",
  );
  try {
    const result = statement.executeSync<TodayOnlyGoal>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

export const addTodayOnlyGoal = (title: string, date: string) => {
  const statement = db.prepareSync(
    "INSERT INTO today_only_goals (title, goal_date, is_done, created_at) VALUES (?, ?, 0, ?)",
  );
  try {
    statement.executeSync([title, date, new Date().toISOString()]);
  } finally {
    statement.finalizeSync();
  }
};

export const toggleTodayOnlyGoal = (id: number, isDone: number) => {
  const statement = db.prepareSync(
    "UPDATE today_only_goals SET is_done = ? WHERE id = ?",
  );
  try {
    statement.executeSync([isDone, id]);
  } finally {
    statement.finalizeSync();
  }
};

export const deleteTodayOnlyGoal = (id: number) => {
  const statement = db.prepareSync("DELETE FROM today_only_goals WHERE id = ?");
  try {
    statement.executeSync([id]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 개별 목표의 연속 달성 일수 계산
 */
export const getGoalStreak = (goalId: number): number => {
  const query = `
    SELECT check_date FROM goal_checks
    WHERE goal_id = ? AND is_done = 1
    ORDER BY check_date DESC
  `;
  const statement = db.prepareSync(query);
  try {
    const result = statement.executeSync<{ check_date: string }>([goalId]);
    const rows = result.getAllSync();
    if (rows.length === 0) return 0;

    const dates = rows.map((r) => r.check_date);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const todayStr = formatLocalDate(currentDate);
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatLocalDate(yesterday);

    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0;

    let checkDate = new Date(dates[0]);
    streak = 1;

    for (let i = 1; i < dates.length; i++) {
      const nextDate = new Date(dates[i]);
      const diffTime = Math.abs(checkDate.getTime() - nextDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        checkDate = nextDate;
      } else {
        break;
      }
    }
    return streak;
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 특정 날짜의 목표와 달성 상태, 그리고 현재 스트릭까지 가져오기
 */
export const getDailyGoalsWithStats = (date: string) => {
  const goals = getDailyGoalsWithCheck(date);
  return goals.map((g) => ({
    ...g,
    streak: getGoalStreak(g.goal_id),
  }));
};

/**
 * Insight Log CRUD
 */
export const getAllLogs = (): WorkLog[] => {
  return db.getAllSync<WorkLog>("SELECT * FROM logs ORDER BY date DESC");
};

export const getLogsByDate = (date: string): WorkLog[] => {
  const statement = db.prepareSync(
    "SELECT * FROM logs WHERE date = ? ORDER BY id DESC",
  );
  try {
    const result = statement.executeSync<WorkLog>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

export const addLog = (log: WorkLog) => {
  const statement = db.prepareSync(
    "INSERT INTO logs (title, daily_summary, tags, content, learned, issue, solution, memo, mood, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  try {
    statement.executeSync([
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
    ]);
  } finally {
    statement.finalizeSync();
  }
};

export const updateLog = (log: WorkLog) => {
  const statement = db.prepareSync(
    "UPDATE logs SET title = ?, daily_summary = ?, tags = ?, content = ?, learned = ?, issue = ?, solution = ?, memo = ?, mood = ? WHERE id = ?",
  );
  try {
    statement.executeSync([
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
    ]);
  } finally {
    statement.finalizeSync();
  }
};

export const deleteLog = (id: number) => {
  const statement = db.prepareSync("DELETE FROM logs WHERE id = ?");
  try {
    statement.executeSync([id]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * Search and Metadata
 */
export const getLoggedDates = (): string[] => {
  const rows = db.getAllSync<{ date: string }>(
    "SELECT DISTINCT date FROM logs ORDER BY date DESC",
  );
  return rows.map((row) => row.date);
};

export const searchLogs = (keyword: string): WorkLog[] => {
  const query = `
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
  `;
  const pattern = `%${keyword}%`;
  const statement = db.prepareSync(query);
  try {
    const result = statement.executeSync<WorkLog>([
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
    ]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

/**
 * Statistics (Streak & Rate)
 */
export const getCurrentStreak = (): number => {
  const rows = db.getAllSync<{ check_date: string }>(
    "SELECT DISTINCT check_date FROM goal_checks WHERE is_done = 1 ORDER BY check_date DESC",
  );
  if (rows.length === 0) return 0;

  const dates = rows.map((r) => r.check_date);
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const todayStr = formatLocalDate(currentDate);
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) return 0;

  let checkDate = new Date(dates[0]);
  streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const nextDate = new Date(dates[i]);
    const diffDays = Math.ceil(
      Math.abs(checkDate.getTime() - nextDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) {
      streak++;
      checkDate = nextDate;
    } else {
      break;
    }
  }
  return streak;
};

export const getGrowthStats = (date: string) => {
  const dailyItems = getDailyGoalsWithCheck(date);
  const todayOnlyItems = getTodayOnlyGoals(date);
  const total = dailyItems.length + todayOnlyItems.length;
  if (total === 0) return { total: 0, completed: 0, rate: 0 };
  const completed =
    dailyItems.filter((i) => i.is_done === 1).length +
    todayOnlyItems.filter((i) => i.is_done === 1).length;
  return { total, completed, rate: Math.round((completed / total) * 100) };
};

export default db;
