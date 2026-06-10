import { Migration } from "./types";

export const initialSchemaMigration: Migration = {
  id: 1,
  name: "initial_schema",
  up: (db) => {
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

      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS goal_checks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goal_id INTEGER NOT NULL,
        check_date TEXT NOT NULL,
        is_done INTEGER DEFAULT 0,
        created_at TEXT,
        UNIQUE(goal_id, check_date)
      );

      CREATE TABLE IF NOT EXISTS today_only_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        goal_date TEXT NOT NULL,
        is_done INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);
  },
};
