import * as SQLite from "expo-sqlite";

export type QueryParams = SQLite.SQLiteBindParams;

const db = SQLite.openDatabaseSync("work_logs.db");

export const queryAll = <T>(sql: string, params: QueryParams = []): T[] => {
  const statement = db.prepareSync(sql);
  try {
    return statement.executeSync<T>(params).getAllSync();
  } finally {
    statement.finalizeSync();
  }
};

export const queryFirst = <T>(
  sql: string,
  params: QueryParams = [],
): T | null => {
  const statement = db.prepareSync(sql);
  try {
    return statement.executeSync<T>(params).getFirstSync();
  } finally {
    statement.finalizeSync();
  }
};

export const execute = (sql: string, params: QueryParams = []) => {
  const statement = db.prepareSync(sql);
  try {
    return statement.executeSync(params);
  } finally {
    statement.finalizeSync();
  }
};

export const initDatabase = () => {
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

  db.execSync(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

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

  try {
    db.execSync("ALTER TABLE logs ADD COLUMN mood TEXT;");
  } catch {}
  try {
    db.execSync("ALTER TABLE logs ADD COLUMN daily_summary TEXT;");
  } catch {}
  try {
    db.execSync("ALTER TABLE logs ADD COLUMN tags TEXT;");
  } catch {}
  try {
    db.execSync("ALTER TABLE today_only_goals ADD COLUMN goal_date TEXT;");
  } catch {}
  try {
    db.execSync(
      "ALTER TABLE today_only_goals ADD COLUMN is_done INTEGER DEFAULT 0;",
    );
  } catch {}
  try {
    db.execSync("ALTER TABLE today_only_goals ADD COLUMN created_at TEXT;");
  } catch {}
  try {
    db.execSync(
      "UPDATE today_only_goals SET goal_date = date WHERE goal_date IS NULL;",
    );
  } catch {}
};

export default db;
