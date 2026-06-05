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

const db = SQLite.openDatabaseSync('work_logs.db');

/**
 * 데이터베이스 초기화 (테이블 생성)
 */
export const initDatabase = () => {
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
  console.log('Database initialized! ✅');
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
  const rows = db.getAllSync<{ date: string }>('SELECT DISTINCT date FROM logs');
  return rows.map(row => row.date);
};

export default db;
