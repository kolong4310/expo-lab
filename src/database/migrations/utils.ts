import * as SQLite from "expo-sqlite";

interface TableColumn {
  name: string;
}

export const hasColumn = (
  db: SQLite.SQLiteDatabase,
  table: string,
  column: string,
): boolean =>
  db
    .getAllSync<TableColumn>(`PRAGMA table_info(${table})`)
    .some((item) => item.name === column);
