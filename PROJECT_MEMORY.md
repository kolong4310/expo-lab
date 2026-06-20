# Project Memory - Tiny Growth

Last updated: 2026-06-20
Branch: `dev`
Repository: `https://github.com/kolong4310/expo-lab`

## Product Direction

Tiny Growth 1.0.0 is a light pastel productivity app with a warm garden / note
tone. It should feel closer to a cozy growth journal than a dark developer
tool or game.

Do not reintroduce:

- Pixel or arcade UI
- Neon or multi-color borders
- Heavy shadows or decorative corner elements
- Complex color combinations
- Overly childish or game-like UI

Reference image: `docs/c1.png`

## Technical Constraints

- Keep Expo SDK 54.
- Keep the existing SQLite schema and migrations.
- Preserve log create, update, delete, search, calendar, and goal behavior.
- Work on `dev`.
- Run `npm run typecheck` and `npm run format:check` before pushing.
- After completing requested code or documentation changes, commit and push to
  `origin/dev` automatically unless the user explicitly says not to push.
- Prefer `node push.js "Meaningful commit message"` only when all modified files
  should be included. If unrelated local changes exist, stage the intended files
  explicitly, then `git commit` and `git push origin dev`.

## Current Navigation

- Today: productivity dashboard and daily goals
- Archive: calendar and date-based logs
- Report: growth statistics and insights
- Search: recent searches, tags, and results
- Settings: language selection after onboarding
- Write: create or update a work log
- Detail: read, edit, or delete a log
- GoalManage: configure repeat goals
- LanguageSelect: first-run language choice when no selected language is saved

## Design System

Primary files:

- `src/theme/theme.ts`
- `src/theme/design.ts`
- `DESIGN.md`

Core palette:

- Background `#0B1010`
- Card `#151C1A`
- Elevated surface `#1D2723`
- Primary `#74D99F`
- Secondary `#8AD7C1`
- Success `#5FD38D`
- Warm seed accent `#E6B86A`
- Text `#F7FBF7`
- Subtext `#9BAEA4`
- Border `rgba(247,251,247,0.055)`

Compatibility component filenames such as `RetroCard` remain, but their visual
implementation is modern and minimal.

## Current Code Structure

- Navigation is typed in `src/navigation/types.ts`.
- Bottom tabs are `Today`, `Archive`, `Report`, `Search`, and `Settings`.
- Root stack screens are `Main`, `Write`, `Detail`, and `GoalManage`.
- Navigation helpers live in `src/navigation/homeNavigation.ts`.
- SQLite access is split into repositories under `src/database/repositories/`.
- SQLite schema setup and migration runner live in `src/database/db.ts` and
  `src/database/migrations/`.
- i18n files live in `src/i18n/`.
- First-run language selection is `src/screens/LanguageSelectScreen.tsx`.
- Post-onboarding language changes are handled in `src/screens/SettingsScreen.tsx`.
- Shared language option UI is `src/components/LanguageOptionList.tsx`.
- Save-complete feedback UI is `src/components/GrowthFeedbackModal.tsx`.
- Shared press micro-interactions live in `src/components/AnimatedPressable.tsx`.
- Shared entrance motion lives in `src/components/FadeInView.tsx`.
- Shared code-drawn seed/sprout motif lives in `src/components/TinySprout.tsx`.
- App appearance state lives in `src/theme/ThemeProvider.tsx` and
  `src/theme/useAppTheme.ts`.
- Theme mode is stored in SQLite `app_settings` with key `selectedThemeMode`.

## Database Structure

- `001_initialSchema.ts` creates the existing `logs`, `goals`,
  `goal_checks`, and `today_only_goals` tables with `IF NOT EXISTS`.
- `002_addLogMetadataFields.ts` and `003_addTodayOnlyGoalFields.ts` handle
  compatibility columns safely.
- `004_addAppSettings.ts` creates `app_settings` with `IF NOT EXISTS`.
- `settingsRepository.ts` stores `selectedLanguage` in `app_settings`.
- `schema_migrations` records executed migrations.
- No destructive SQL has been added.

## Localization

- Supported languages are `ko`, `en`, `ja`, and `zh`.
- `AppLanguage = "ko" | "en" | "ja" | "zh"`.
- `translations.ts` uses flat translation keys.
- `TranslationKey` is derived from the Korean translation map.
- `translations: Record<AppLanguage, TranslationMap>` keeps language key sets
  aligned at typecheck time.
- `I18nProvider` loads `selectedLanguage` from SQLite after database
  initialization and exposes `language`, `selectedLanguage`, `setLanguage`,
  and `t`.
- If `selectedLanguage` is missing, `LanguageSelectScreen` is shown.
- Selecting a language stores it in SQLite and immediately switches to `Main`.
- Settings language changes reuse the same `setLanguage()` path, update SQLite,
  and immediately refresh app text.
- No external i18n or storage library has been added.

## Recent Work Completed

- Added type-safe navigation params and removed `any` from screen navigation
  props.
- Added a `Report` tab and `ReportScreen` for growth statistics.
- Added repository helpers for log counts, weekly counts, monthly counts,
  top tags, and mood aggregation.
- Added `getLogById()` to support ID-based editing and detail flows.
- Split SQLite initialization SQL into migration files and a migration runner.
- Kept the existing design system and database schema intact.
- Expanded the UI into a warm light pastel system:
  - HomeScreen, CalendarScreen, ReportScreen, SearchScreen
  - WriteScreen, DetailScreen, GoalManageScreen, SettingsScreen,
    LanguageSelectScreen
  - shared light pastel tokens, `LogCard`, `StatCard`, and bottom tab styling
- Added the light pastel affordance pass so inputs, chips, check rows, and
  buttons read more clearly as interactive controls.
- Locked 1.0.0 release theme to light mode:
  - `app.json` now uses `userInterfaceStyle: "light"`
  - `ThemeProvider` normalizes any stored dark selection back to light
  - Settings theme UI is hidden/retained in code for future reuse
- Confirmed the release policy is light-mode-first and dark mode is not exposed
  in the shipped 1.0.0 flow.
- Verified the release build path with Android Expo export and local QA checks.

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

## Work Completed on 2026-06-17

- Added first-run language selection for `ko`, `en`, `ja`, and `zh`.
- Added internal i18n structure without external libraries:
  - `src/i18n/languages.ts`
  - `src/i18n/translations.ts`
  - `src/i18n/I18nProvider.tsx`
  - `src/i18n/useTranslation.ts`
- Added SQLite `app_settings` table through safe migration `004_addAppSettings`.
- Added `settingsRepository.ts` for `selectedLanguage`.
- Added `LanguageSelectScreen` for first launch when no language is saved.
- Added `Settings` bottom tab and `SettingsScreen` for changing language after
  onboarding.
- Added `LanguageOptionList` shared component for language buttons.
- Updated bottom tabs to `Today / Archive / Report / Search / Settings`.
- Connected key app text to translation keys for tabs, LanguageSelect, Today,
  Write, Report, Archive, Search, and Settings.
- Renamed app display name from Grow Day to Tiny Growth.
- Updated `app.json` display name to `Tiny Growth`.
- Kept `android.package` as `com.kolong4310.growday`.
- Kept `slug` as `grow-day` to avoid EAS/project-link risk.
- Kept `extra.eas.projectId` unchanged.
- Updated store/release/privacy/data safety/screenshot/design documents for
  Tiny Growth.
- Added release checklist notes for Play Console and Notion manual name changes.
- QA checked Tiny Growth naming, Settings UX, 5-tab layout, i18n key coverage,
  language persistence flow, and existing navigation flow.

## Work Completed on 2026-06-18

- Added save-complete growth feedback after Write save/update:
  - `buildGrowthFeedback()` chooses short feedback from edit, tag, mood, goal,
    or default state.
  - Reused i18n keys for `ko`, `en`, `ja`, and `zh`.
  - Preserved existing save failure Alert behavior.
- Replaced the save-success Alert with `GrowthFeedbackModal`:
  - Uses only React Native `Animated`, `View`, and `Text`.
  - Shows a dark overlay, minimal card, code-drawn sprout, subtle sparkles, and
    confirm CTA.
  - Confirm closes the modal and then uses the existing `goHome(navigation)`
    Today return flow.
- Added app-wide micro-interaction primitives:
  - `AnimatedPressable` for subtle `0.97-0.99` press scale.
  - `FadeInView` for short fade/slide card entrance motion.
- Applied micro-interactions conservatively:
  - `PrimaryButton`/`RetroButton` CTAs.
  - Today key cards, goal manage action, today-only add button, and goal toggle
    rows.
  - Report summary/insight/empty cards and animated monthly bars.
  - Settings and first-run language selection cards.
  - Language option rows while preserving selected/check states.
  - Search recent and tag chips only; bulk result lists were left unanimated.
- Updated `DESIGN.md` with Motion / Micro-interaction guidance.
- Updated release and screenshot docs for GrowthFeedbackModal QA.
- Verified:
  - `npm.cmd run typecheck`
  - `npm.cmd run format:check`
  - `git diff --check`
  - `npx.cmd expo export --platform android --output-dir .expo-export-check`
- Cleaned `.expo-export-check` after export verification.

## Visual Polish on 2026-06-18

- Refined Tiny Growth from a plain dark productivity tone toward a soft growth
  tone while keeping the app dark, minimal, and adult-friendly.
- Updated theme tokens from purple/cyan accents to mint, sage, and warm seed
  yellow accents.
- Added `TinySprout`, a code-drawn `View`-based sprout/seed motif with no image
  assets or external libraries.
- Reused `TinySprout` only in key moments:
  - Today hero card.
  - Report insight/empty state.
  - GrowthFeedbackModal.
- Improved Today first impression:
  - Added `today.heroTitle` and `today.heroSubtitle`.
  - Reframed the streak card as "today's tiny growth".
  - Changed the primary CTA to a small-growth note action.
- Improved Write tone:
  - Softer placeholders.
  - Added a short gentle writing hint.
  - Updated save/update button wording.
- Improved Report tone:
  - Warmer empty state and insight copy.
  - Softer chart colors while preserving existing report behavior.
- Improved empty-state wording across Today, Archive, Report, and Search to
  emphasize records growing over time instead of missing data.
- Updated `DESIGN.md` with Tiny Growth Visual Tone rules and refreshed colors.
- Updated `SCREENSHOT_GUIDE.md` with store screenshot tone guidance.
- No DB, migration, navigation, external asset, Lottie/GIF, or library changes.

## Appearance Work on 2026-06-18

- Added app theme mode support:
  - `AppThemeMode = "dark" | "light"`.
  - `darkTheme`, `lightTheme`, and `getThemeByMode()` in `src/theme/theme.ts`.
  - `ThemeProvider` and `useAppTheme()` for current theme state.
- Reused the existing SQLite `app_settings` table; no migration was added.
- Added `selectedThemeMode` storage helpers to `settingsRepository.ts`.
- Added Settings appearance controls:
  - `ThemeOptionList` with dark/light options.
  - Current appearance card.
  - AnimatedPressable press feedback and selected check state.
- Added i18n keys for Settings appearance copy in `ko`, `en`, `ja`, and `zh`.
- Wired NavigationContainer, bottom tabs, status bars, and key common components
  to the active theme.
- Applied theme colors to major surfaces and components including Today, Write,
  Report, Search, Archive, Settings, LanguageSelect, GrowthFeedbackModal,
  LogCard, LanguageOptionList, RetroCard, RetroButton, and RetroInput.
- Dark mode remains the default and preserves the existing Tiny Growth visual
  tone. Light mode uses a soft garden palette with dark readable text.
- Updated `DESIGN.md`, `RELEASE_CHECKLIST.md`, and `SCREENSHOT_GUIDE.md` for
  appearance mode behavior and QA.

## Important Bug Fixes

- Fixed the report screen focus-update loop by only updating state when the
  report snapshot changes.
- Fixed the write screen edit-mode update loop by memoizing the queried log on
  `logId` instead of re-querying on every render.
- Fixed a stale Search result risk by refreshing current search results when
  the Search tab regains focus.

## Verified Commands

- `npm.cmd run typecheck`
- `npm.cmd run format:check`
- `git diff --check`
- `npx.cmd expo export --platform android`
- `npx expo export --platform android --output-dir .expo-export-check`
- `npx expo config --type public`
- `npx --yes eas-cli --version`

## Latest Commits

- `7d670be` Refine light pastel affordances
- `29293e6` Add dark and light appearance settings
- `00e03c7` Polish Tiny Growth visual tone
- `dc36d4a` Add subtle micro interactions
- `09adf67` Add animated growth feedback modal
- `4a992d9` Add growth feedback after saving logs
- `5d61498` Add settings language switcher
- `05931b7` Add first-run language selection
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
- Preserve the current bottom tab order:
  `Today / Archive / Report / Search / Settings`.
- If database work continues, add migrations rather than changing existing
  tables or deleting data.
- Do not delete or reset user SQLite data.
- Keep `004_addAppSettings` and `app_settings.selectedLanguage` intact.
- Do not add external i18n or storage libraries.
- If a maximum update depth error appears again, check for `useEffect` or
  `useFocusEffect` callbacks that re-query SQLite objects on every render.
- Do not remove `extra.eas.projectId` from `app.json`; it links the project to
  EAS.
- Do not change `android.package` unless a deliberate Play Console migration is
  planned.
- Keep `slug` as `grow-day` unless EAS/Play Console implications are reviewed.
- `PROJECT_MEMORY.md` is user/project memory. Commit it only when the user asks
  to update memory.
- The user asked on 2026-06-18 to keep `PROJECT_MEMORY.md` updated with the
  rule that future completed work should be committed and pushed automatically.
- When pushing with local unrelated changes present, do not use broad staging;
  stage the intended files explicitly and leave unrelated changes alone.
- Before Play Store submission:
  - Confirm the Privacy Policy URL opens in a private/incognito browser.
  - Update Play Console app name to Tiny Growth.
  - Update the Notion Privacy Policy page title/body to Tiny Growth.
  - Enter the Privacy Policy URL in Play Console.
  - Complete Play Console Data safety answers from `DATA_SAFETY_DRAFT.md`.
  - Capture store screenshots using `SCREENSHOT_GUIDE.md`.
  - Include Settings/language screenshots if useful.
  - Increase `android.versionCode` before the next production release if needed.
