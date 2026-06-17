import * as SQLite from "expo-sqlite";
import { initialSchemaMigration } from "./001_initialSchema";
import { addLogMetadataFieldsMigration } from "./002_addLogMetadataFields";
import { addTodayOnlyGoalFieldsMigration } from "./003_addTodayOnlyGoalFields";
import { addAppSettingsMigration } from "./004_addAppSettings";
import { Migration } from "./types";

interface ExecutedMigration {
  id: number;
}

const migrations: Migration[] = [
  initialSchemaMigration,
  addLogMetadataFieldsMigration,
  addTodayOnlyGoalFieldsMigration,
  addAppSettingsMigration,
];

const createMigrationsTable = (db: SQLite.SQLiteDatabase) => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      executed_at TEXT NOT NULL
    );
  `);
};

export const runMigrations = (db: SQLite.SQLiteDatabase) => {
  let activeMigration: Migration | null = null;

  try {
    createMigrationsTable(db);

    const executedIds = new Set(
      db
        .getAllSync<ExecutedMigration>("SELECT id FROM schema_migrations")
        .map((migration) => migration.id),
    );

    for (const migration of migrations) {
      if (executedIds.has(migration.id)) continue;

      activeMigration = migration;
      db.withTransactionSync(() => {
        migration.up(db);
        db.runSync(
          "INSERT INTO schema_migrations (id, name, executed_at) VALUES (?, ?, ?)",
          migration.id,
          migration.name,
          new Date().toISOString(),
        );
      });
      activeMigration = null;
    }
  } catch (error) {
    if (activeMigration) {
      console.error(
        `[database] Migration ${activeMigration.id} (${activeMigration.name}) failed`,
        error,
      );
    } else {
      console.error("[database] Migration runner failed", error);
    }
  }
};
