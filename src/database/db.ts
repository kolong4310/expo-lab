import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

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
  runMigrations(db);
};

export default db;
