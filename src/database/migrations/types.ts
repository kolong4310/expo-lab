import * as SQLite from "expo-sqlite";

export interface Migration {
  id: number;
  name: string;
  up: (db: SQLite.SQLiteDatabase) => void;
}
