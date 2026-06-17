import { Migration } from "./types";

export const addAppSettingsMigration: Migration = {
  id: 4,
  name: "add_app_settings",
  up: (db) => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  },
};
