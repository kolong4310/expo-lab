import { Migration } from "./types";
import { hasColumn } from "./utils";

export const addLogMetadataFieldsMigration: Migration = {
  id: 2,
  name: "add_log_metadata_fields",
  up: (db) => {
    if (!hasColumn(db, "logs", "mood")) {
      db.execSync("ALTER TABLE logs ADD COLUMN mood TEXT;");
    }
    if (!hasColumn(db, "logs", "daily_summary")) {
      db.execSync("ALTER TABLE logs ADD COLUMN daily_summary TEXT;");
    }
    if (!hasColumn(db, "logs", "tags")) {
      db.execSync("ALTER TABLE logs ADD COLUMN tags TEXT;");
    }
  },
};
