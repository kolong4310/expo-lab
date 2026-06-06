import * as SQLite from 'expo-sqlite';

/**
 * 로그 데이터 타입 정의
 */
export interface WorkLog {
  id?: number;
  title: string;      // 오늘 한 일 요약
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

const db = SQLite.openDatabaseSync('work_logs.db');

/**
 * 데이터베이스 초기화 (테이블 생성)
 */
export const initDatabase = () => {
  // 기존 로그 테이블
  db.execSync(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      learned TEXT,
      issue TEXT,
      solution TEXT,
      memo TEXT,
      mood TEXT,
      date TEXT NOT NULL
    );
  `);

  // 할 일 테이블 추가
  db.execSync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      date TEXT NOT NULL
    );
  `);

  // 기존 테이블에 mood 컬럼이 없는 경우를 위한 마이그레이션
  try {
    db.execSync('ALTER TABLE logs ADD COLUMN mood TEXT;');
    console.log('Migration: mood column added! 🚀');
  } catch (e) {
    console.log('Migration: mood column already exists or skipped.');
  }

  console.log('Database initialized! ✅');
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
    'INSERT INTO logs (title, content, learned, issue, solution, memo, mood, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  try {
    statement.executeSync([
      log.title,
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
    'UPDATE logs SET title = ?, content = ?, learned = ?, issue = ?, solution = ?, memo = ?, mood = ? WHERE id = ?'
  );
  try {
    statement.executeSync([
      log.title,
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
    OR content LIKE ? 
    OR learned LIKE ? 
    OR issue LIKE ? 
    OR solution LIKE ? 
    OR memo LIKE ? 
    ORDER BY date DESC
  `;
  const pattern = \`%\${keyword}%\`;
  const statement = db.prepareSync(query);
  try {
    const result = statement.executeSync<WorkLog>([pattern, pattern, pattern, pattern, pattern, pattern]);
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
