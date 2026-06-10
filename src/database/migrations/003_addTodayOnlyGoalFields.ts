import { Migration } from "./types";
import { hasColumn } from "./utils";

export const addTodayOnlyGoalFieldsMigration: Migration = {
  id: 3,
  name: "add_today_only_goal_fields",
  up: (db) => {
    if (!hasColumn(db, "today_only_goals", "goal_date")) {
      db.execSync("ALTER TABLE today_only_goals ADD COLUMN goal_date TEXT;");
    }
    if (!hasColumn(db, "today_only_goals", "is_done")) {
      db.execSync(
        "ALTER TABLE today_only_goals ADD COLUMN is_done INTEGER DEFAULT 0;",
      );
    }
    if (!hasColumn(db, "today_only_goals", "created_at")) {
      db.execSync("ALTER TABLE today_only_goals ADD COLUMN created_at TEXT;");
    }

    if (hasColumn(db, "today_only_goals", "date")) {
      db.execSync(
        "UPDATE today_only_goals SET goal_date = date WHERE goal_date IS NULL;",
      );
    }
  },
};
