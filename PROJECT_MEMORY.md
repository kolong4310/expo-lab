# Project Memory - Grow Day

Last updated: 2026-06-16
Branch: `dev`
Repository: `https://github.com/kolong4310/expo-lab`

## Product Direction

Grow Day is a premium dark productivity app for developers to manage daily goals
and write work logs. It should feel closer to Linear, Raycast, Notion Calendar,
and Apple productivity tools than a game.

Do not reintroduce:

- Pixel or arcade UI
- Neon or multi-color borders
- Game terminology
- Heavy shadows or decorative corner elements
- Complex color combinations

Reference image: `docs/c1.png`

## Technical Constraints

- Keep Expo SDK 54.
- Keep the existing SQLite schema and migrations.
- Preserve log create, update, delete, search, calendar, and goal behavior.
- Work on `dev`.
- Run `npm run typecheck` and `npm run format:check` before pushing.
- Push with `node push.js "Meaningful commit message"`.

## Current Navigation

- Today: productivity dashboard and daily goals
- Archive: calendar and date-based logs
- Search: recent searches, tags, and results
- Write: create or update a work log
- Detail: read, edit, or delete a log
- GoalManage: configure repeat goals

## Design System

Primary files:

- `src/theme/theme.ts`
- `src/theme/design.ts`
- `DESIGN.md`

Core palette:

- Background `#0B0F14`
- Card `#151B23`
- Primary `#6C63FF`
- Secondary `#4CC9F0`
- Success `#22C55E`
- Text `#FFFFFF`
- Subtext `#8B93A7`
- Border `rgba(255,255,255,0.06)`

Compatibility component filenames such as `RetroCard` remain, but their visual
implementation is modern and minimal.

## Current Code Structure

- Navigation is typed in `src/navigation/types.ts`.
- Bottom tabs are `Today`, `Archive`, `Report`, and `Search`.
- Root stack screens are `Main`, `Write`, `Detail`, and `GoalManage`.
- Navigation helpers live in `src/navigation/homeNavigation.ts`.
- SQLite access is split into repositories under `src/database/repositories/`.
- SQLite schema setup and migration runner live in `src/database/db.ts` and
  `src/database/migrations/`.

## Database Structure

- `001_initialSchema.ts` creates the existing `logs`, `goals`,
  `goal_checks`, and `today_only_goals` tables with `IF NOT EXISTS`.
- `002_addLogMetadataFields.ts` and `003_addTodayOnlyGoalFields.ts` handle
  compatibility columns safely.
- `schema_migrations` records executed migrations.
- No destructive SQL has been added.

## Recent Work Completed

- Added type-safe navigation params and removed `any` from screen navigation
  props.
- Added a `Report` tab and `ReportScreen` for growth statistics.
- Added repository helpers for log counts, weekly counts, monthly counts,
  top tags, and mood aggregation.
- Added `getLogById()` to support ID-based editing and detail flows.
- Split SQLite initialization SQL into migration files and a migration runner.
- Kept the existing design system and database schema intact.

## Work Completed on 2026-06-16

- Stabilized the existing `Report` tab UI without adding external chart
  libraries.
- Refactored `ReportScreen.tsx` into small internal components for summary
  cards, insights, tag stats, monthly chart, mood stats, and empty state.
- Added growth insight copy based on existing `ReportStats` data.
- Improved Report empty states and low-data wording so the screen feels natural
  with 0, 1, or many records.
- Confirmed Report uses `statsRepository` and does not call SQL directly.
- Improved `statsRepository` date helper structure and TOP 5 tag limiting.
- Confirmed bottom tab order remains `Today / Archive / Report / Search`.
- Added Android release basics in `app.json`:
  - `android.package`: `com.kolong4310.growday`
  - `android.versionCode`: `1`
  - `extra.eas.projectId`: `4d898034-dc24-437a-bc7d-eab7c39bbf86`
- Added EAS Android build profiles in `eas.json`:
  - `development`
  - `preview`
  - `production`
- Added npm scripts:
  - `build:android:preview`
  - `build:android:production`
- Added and expanded Play Store preparation documents:
  - `STORE_LISTING_DRAFT.md`
  - `PRIVACY_POLICY_DRAFT.md`
  - `DATA_SAFETY_DRAFT.md`
  - `SCREENSHOT_GUIDE.md`
  - `RELEASE_CHECKLIST.md`
- Added Privacy Policy URL to release documents:
  - `https://app.notion.com/p/3813fa1a756d8053bfaed38be72f1a2e?source=copy_link`
- Added privacy contact email:
  - `kolong4310@gmail.com`
- Added Search focus refresh so results update after returning from Detail
  edits/deletes.
- Added `keyboardShouldPersistTaps="handled"` to Write/Search scrolling areas
  for better Android keyboard interaction.
- Confirmed Android preview APK build and real-device install were completed by
  the user.

## Important Bug Fixes

- Fixed the report screen focus-update loop by only updating state when the
  report snapshot changes.
- Fixed the write screen edit-mode update loop by memoizing the queried log on
  `logId` instead of re-querying on every render.
- Fixed a stale Search result risk by refreshing current search results when
  the Search tab regains focus.

## Verified Commands

- `npm run typecheck`
- `npm run format:check`
- `npx expo export --platform android --output-dir .expo-export-check`
- `git diff --check`
- `npx expo config --type public`
- `npx --yes eas-cli --version`

## Latest Commits

- `f9daecb` Update Play Store privacy submission docs
- `3087e00` Expand Play Store submission docs
- `b02747e` Add Play Store release drafts
- `1f9d7d8` Polish Android QA flows
- `a5ac61f` Add EAS Android build profiles
- `732b597` Prepare Android app stability settings
- `9a75f77` Polish report tab UX flow
- `67ba59f` Add report growth insights
- `f249ade` Stabilize report tab UI
- `526cd84` Fix write screen edit update loop
- `e89788f` Prevent report focus update loop
- `37054d9` Add growth report tab
- `e903dfa` Separate SQLite migrations
- `ab80cbd` Add type-safe navigation routes

## Resume Notes

- If app navigation behavior is touched next, keep the `Main` tab nesting
  model intact and preserve typed route params.
- If database work continues, add migrations rather than changing existing
  tables or deleting data.
- If a maximum update depth error appears again, check for `useEffect` or
  `useFocusEffect` callbacks that re-query SQLite objects on every render.
- Do not remove `extra.eas.projectId` from `app.json`; it links the project to
  EAS.
- `PROJECT_MEMORY.md` is user/project memory. Commit it only when the user asks
  to update memory.
- Before Play Store submission:
  - Confirm the Privacy Policy URL opens in a private/incognito browser.
  - Enter the Privacy Policy URL in Play Console.
  - Complete Play Console Data safety answers from `DATA_SAFETY_DRAFT.md`.
  - Capture store screenshots using `SCREENSHOT_GUIDE.md`.
  - Increase `android.versionCode` before the next production release if needed.
