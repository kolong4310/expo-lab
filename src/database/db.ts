import * as SQLite from 'expo-sqlite';

/**
 * 로그 데이터 타입 정의
 */
export interface WorkLog {
  id?: number;
  title: string;      // 오늘 한 일 요약
  daily_summary?: string; // 오늘을 한 문장으로
  tags?: string;      // 태그 (콤마 구분)
  content: string;    // 상세 내용
  learned: string;    // 배운 것
  issue: string;      // 이슈
  solution: string;   // 해결 방법
  memo: string;       // 메모
  mood?: string;      // 오늘의 기분 (emoji)
  date: string;       // 작성 날짜 (YYYY-MM-DD)
}

/**
 * 할 일 데이터 타입 정의
 */
export interface Todo {
  id?: number;
  task: string;
  is_completed: number; // 0 or 1
  date: string;
}

/**
 * 목표 템플릿 (반복 루틴)
 */
export interface GoalTemplate {
  id?: number;
  title: string;
  category: string;
  is_active: number; // 0 or 1
  created_at: string;
}

/**
 * 일일 목표 달성 여부 (루틴 체크)
 */
export interface DailyGoalCheck {
  id?: number;
  goal_id: number;
  date: string;
  is_done: number; // 0 or 1
}

/**
 * 오늘만 할 일
 */
export interface TodayOnlyGoal {
  id?: number;
  title: string;
  date: string;
  is_done: number; // 0 or 1
}

const db = SQLite.openDatabaseSync('work_logs.db');

/**
 * 데이터베이스 초기화 (테이블 생성 및 마이그레이션)
 */
export const initDatabase = () => {
  // 기존 로그 테이블
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

  // 할 일 테이블 (Legacy 유지)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      date TEXT NOT NULL
    );
  `);

  // 1. Goal Templates 테이블 추가
  db.execSync(`
    CREATE TABLE IF NOT EXISTS goal_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // 2. Daily Goal Checks 테이블 추가
  db.execSync(`
    CREATE TABLE IF NOT EXISTS daily_goal_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      is_done INTEGER DEFAULT 0,
      UNIQUE(goal_id, date)
    );
  `);

  // 3. Today Only Goals 테이블 추가
  db.execSync(`
    CREATE TABLE IF NOT EXISTS today_only_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      is_done INTEGER DEFAULT 0
    );
  `);

  // 기존 마이그레이션 로직들...
  // (생략 가능하나 안전을 위해 유지)
  try { db.execSync('ALTER TABLE logs ADD COLUMN mood TEXT;'); } catch(e) {}
  try { db.execSync('ALTER TABLE logs ADD COLUMN daily_summary TEXT;'); } catch(e) {}
  try { db.execSync('ALTER TABLE logs ADD COLUMN tags TEXT;'); } catch(e) {}

  console.log('Database initialized with Growth Routine tables! ✅');
};

/**
 * Goal Template CRUD
 */
export const getGoalTemplates = (): GoalTemplate[] => {
  return db.getAllSync<GoalTemplate>('SELECT * FROM goal_templates ORDER BY id DESC');
};

export const addGoalTemplate = (title: string, category: string) => {
  const statement = db.prepareSync('INSERT INTO goal_templates (title, category, created_at) VALUES (?, ?, ?)');
  try {
    statement.executeSync([title, category, new Date().toISOString()]);
  } finally {
    statement.finalizeSync();
  }
};

export const updateGoalTemplate = (id: number, title: string, category: string, isActive: number) => {
  const statement = db.prepareSync('UPDATE goal_templates SET title = ?, category = ?, is_active = ? WHERE id = ?');
  try {
    statement.executeSync([title, category, isActive, id]);
  } finally {
    statement.finalizeSync();
  }
};

export const deleteGoalTemplate = (id: number) => {
  db.execSync(`DELETE FROM goal_templates WHERE id = ${id}`);
  db.execSync(`DELETE FROM daily_goal_checks WHERE goal_id = ${id}`);
};

/**
 * Daily Routine Checks
 */
export const getDailyRoutinesByDate = (date: string) => {
  // 활성화된 템플릿과 해당 날짜의 체크 상태를 조인해서 가져옴
  const query = `
    SELECT 
      t.id as goal_id, 
      t.title, 
      t.category, 
      COALESCE(c.is_done, 0) as is_done,
      c.id as check_id
    FROM goal_templates t
    LEFT JOIN daily_goal_checks c ON t.id = c.goal_id AND c.date = ?
    WHERE t.is_active = 1
  `;
  const statement = db.prepareSync(query);
  try {
    const result = statement.executeSync<any>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

export const toggleRoutineCheck = (goalId: number, date: string, isDone: number) => {
  // INSERT OR REPLACE 사용
  const statement = db.prepareSync(`
    INSERT INTO daily_goal_checks (goal_id, date, is_done) 
    VALUES (?, ?, ?)
    ON CONFLICT(goal_id, date) DO UPDATE SET is_done = excluded.is_done
  `);
  try {
    statement.executeSync([goalId, date, isDone]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * Today Only Goals CRUD
 */
export const getTodayOnlyGoals = (date: string): TodayOnlyGoal[] => {
  const statement = db.prepareSync('SELECT * FROM today_only_goals WHERE date = ?');
  try {
    const result = statement.executeSync<TodayOnlyGoal>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

export const addTodayOnlyGoal = (title: string, date: string) => {
  const statement = db.prepareSync('INSERT INTO today_only_goals (title, date) VALUES (?, ?)');
  try {
    statement.executeSync([title, date]);
  } finally {
    statement.finalizeSync();
  }
};

export const toggleTodayOnlyGoal = (id: number, isDone: number) => {
  db.execSync(`UPDATE today_only_goals SET is_done = ${isDone} WHERE id = ${id}`);
};

export const deleteTodayOnlyGoal = (id: number) => {
  db.execSync(`DELETE FROM today_only_goals WHERE id = ${id}`);
};

/**
 * 통합 달성률 계산 (Routines + TodayOnly)
 */
export const getGrowthStats = (date: string) => {
  const routines = getDailyRoutinesByDate(date);
  const todayOnly = getTodayOnlyGoals(date);
  
  const total = routines.length + todayOnly.length;
  if (total === 0) return { total: 0, completed: 0, rate: 0 };
  
  const completed = routines.filter(r => r.is_done === 1).length + 
                    todayOnly.filter(g => g.is_done === 1).length;
                    
  return {
    total,
    completed,
    rate: Math.round((completed / total) * 100)
  };
};

/**
 * 월간 달성률 (이전 함수와 호환성 유지하면서 로직 변경 가능하나 일단은 오늘 날짜 중심)
 */
export const getMonthlyGrowthRate = (monthStr: string) => {
  // 간단하게 해당 월의 모든 체크 수 / 전체 가능 수 계산
  // (실제로는 매일의 루틴 개수가 다를 수 있으나 MVP 수준에서 구현)
  const routineChecks = db.getAllSync<{is_done: number}>(`SELECT is_done FROM daily_goal_checks WHERE date LIKE '${monthStr}%'`);
  const todayOnlyChecks = db.getAllSync<{is_done: number}>(`SELECT is_done FROM today_only_goals WHERE date LIKE '${monthStr}%'`);
  
  const total = routineChecks.length + todayOnlyChecks.length;
  if (total === 0) return 0;
  
  const completed = routineChecks.filter(c => c.is_done === 1).length + 
                    todayOnlyChecks.filter(c => c.is_done === 1).length;
                    
  return Math.round((completed / total) * 100);
};

/**
 * 특정 날짜의 할 일 가져오기
 */
export const getTodosByDate = (date: string): Todo[] => {
  const statement = db.prepareSync('SELECT * FROM todos WHERE date = ?');
  try {
    const result = statement.executeSync<Todo>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 할 일 추가하기
 */
export const addTodo = (task: string, date: string) => {
  const statement = db.prepareSync('INSERT INTO todos (task, is_completed, date) VALUES (?, 0, ?)');
  try {
    statement.executeSync([task, date]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 할 일 완료 상태 토글
 */
export const toggleTodo = (id: number, isCompleted: number) => {
  const statement = db.prepareSync('UPDATE todos SET is_completed = ? WHERE id = ?');
  try {
    statement.executeSync([isCompleted, id]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 할 일 삭제하기
 */
export const deleteTodo = (id: number) => {
  const statement = db.prepareSync('DELETE FROM todos WHERE id = ?');
  try {
    statement.executeSync([id]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 모든 로그 가져오기
 */
export const getAllLogs = (): WorkLog[] => {
  return db.getAllSync<WorkLog>('SELECT * FROM logs ORDER BY date DESC');
};

/**
 * 새 로그 추가하기
 */
export const addLog = (log: WorkLog) => {
  const statement = db.prepareSync(
    'INSERT INTO logs (title, daily_summary, tags, content, learned, issue, solution, memo, mood, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
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
      log.date
    ]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 로그 수정하기
 */
export const updateLog = (log: WorkLog) => {
  const statement = db.prepareSync(
    'UPDATE logs SET title = ?, daily_summary = ?, tags = ?, content = ?, learned = ?, issue = ?, solution = ?, memo = ?, mood = ? WHERE id = ?'
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
      log.id!
    ]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 로그 삭제하기
 */
export const deleteLog = (id: number) => {
  const statement = db.prepareSync('DELETE FROM logs WHERE id = ?');
  try {
    statement.executeSync([id]);
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 특정 날짜의 로그 가져오기
 */
export const getLogsByDate = (date: string): WorkLog[] => {
  const statement = db.prepareSync('SELECT * FROM logs WHERE date = ? ORDER BY id DESC');
  try {
    const result = statement.executeSync<WorkLog>([date]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 기록이 있는 모든 날짜 가져오기 (중복 제거)
 */
export const getLoggedDates = (): string[] => {
  const rows = db.getAllSync<{ date: string }>('SELECT DISTINCT date FROM logs ORDER BY date DESC');
  return rows.map(row => row.date);
};

/**
 * 키워드로 로그 검색하기
 */
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
    const result = statement.executeSync<WorkLog>([pattern, pattern, pattern, pattern, pattern, pattern, pattern, pattern]);
    return result.getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

/**
 * 연속 기록 일수(Streak) 계산하기
 */
export const getCurrentStreak = (): number => {
  const dates = getLoggedDates();
  if (dates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // 오늘 기록이 있는지 확인
  const todayStr = currentDate.toISOString().split('T')[0];
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0; // 오늘이나 어제 기록이 없으면 스트릭 끊김
  }

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
};

/**
 * 월간 할 일 완료 통계 가져오기
 */
export const getMonthlyStats = (monthStr: string) => {
  // monthStr: "YYYY-MM"
  const rows = db.getAllSync<{ is_completed: number }>(
    `SELECT is_completed FROM todos WHERE date LIKE '${monthStr}%'`
  );
  
  if (rows.length === 0) return { total: 0, completed: 0, rate: 0 };
  
  const completed = rows.filter(r => r.is_completed === 1).length;
  return {
    total: rows.length,
    completed: completed,
    rate: Math.round((completed / rows.length) * 100)
  };
};

export default db;
