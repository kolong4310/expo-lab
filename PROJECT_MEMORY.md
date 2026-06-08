# Project Memory - Grow Day / Growth Quest

Last updated: 2026-06-08  
Branch: `dev`  
Repository: `https://github.com/kolong4310/expo-lab`

## Current Product Direction

This Expo app should feel like a "growth RPG" rather than a productivity app or diary app.

The intended UX:

- User opens the app and sees today's growth quest.
- Daily and one-off goals are missions.
- Completing goals gives a sense of progress.
- Writing a daily log feels like recording a cleared quest.
- Archive/search/system screens should feel like 80s/90s arcade or Nintendo RPG menu screens.

Reference mood:

- 80s/90s arcade game menu UI.
- Bubble Bobble / Snow Bros / Rainbow Islands / Puzzle Bobble only as mood references.
- Do not copy characters, logos, dinosaurs, or copyrighted game assets.
- Use game UI language such as `MISSION STATUS`, `TODAY MISSION`, `COMPLETE`, `NEW LOG`, `ARCHIVE`.

## Important Constraints

- Do not change feature logic unless explicitly requested.
- Do not change SQLite schema unless explicitly requested.
- Do not remove existing local DB migrations.
- Do not add copyrighted characters, logos, or game art.
- Keep working on `dev`.
- Use `node push.js "Meaningful commit message"` for auto-push.
- Run `npx tsc --noEmit` before pushing.

## Tech Stack

- Expo SDK 54.
- React Native 0.81.5.
- React 19.1.0.
- TypeScript.
- React Navigation stack + bottom tabs.
- `expo-sqlite` local storage.

## Current Navigation Structure

Current bottom tabs:

- `TODAY` -> `HomeScreen`
- `ARCHIVE` -> `CalendarScreen`
- `SEARCH` -> `SearchScreen`

`GoalManageScreen` is intentionally not a bottom tab right now. It remains a Stack screen:

- `GoalManage` -> repeat mission management

This keeps it ready to be nested into a future `SYSTEM` tab if requested.

## Current Screen Roles

### TODAY / HomeScreen

Purpose: today's RPG mission dashboard.

Current layout:

- `GROWTH QUEST`
- subtitle: `성장 로그 RPG`
- small `STREAK` / `STATE` cards
- large `MISSION STATUS` score card
- block-style pixel progress bar
- percent and complete count
- `TODAY MISSION` card containing mission rows only
- separate `ADD MISSION` card for one-off goals
- fixed bottom CTA: `+ 오늘 기록하기`

Important detail:

- The CTA is outside the ScrollView and fixed to the bottom using SafeArea inset.
- ScrollView uses large bottom padding to avoid overlap.

### WRITE / WriteScreen

Purpose: quest-clear log entry screen.

Current layout:

1. 오늘의 한 줄
2. `QUEST TITLE`
3. `MOOD`
4. `TAG`
5. 상세 내용
6. 획득한 경험치
7. 장애물 / 해결
8. 메모

Important detail:

- `저장하기` / `수정 완료` button must stay outside the ScrollView as a fixed bottom CTA.
- Keep large ScrollView `paddingBottom` so fields do not sit behind the CTA.

### ARCHIVE / CalendarScreen

Purpose: record browsing only.

Current layout:

- `ARCHIVE`
- calendar inside `RetroCard`
- selected date panel
- completed mission marks
- selected date log list

Important detail:

- Records are opened by tapping log slots.
- Calendar day markers should feel like pixel badges, not default app dots.

### SEARCH / SearchScreen

Purpose: search logs and tags.

Current layout:

- `SEARCH`
- retro search input
- recommended tags
- search results as archive log slots

Text should be Korean or game-style Korean, not mixed or mojibake text.

### GoalManageScreen

Purpose: repeat mission setup.

Current layout:

- `ROUTINE SETUP`
- new repeat mission form
- category chips
- add button
- repeat mission list
- ON/OFF toggle boxes

This screen should keep using Retro UI, but it is a separate Stack screen for now.

## SQLite / Data Model Notes

The database file is `src/database/db.ts`.

Existing main tables:

- `logs`
- `goals`
- `goal_checks`
- `today_only_goals`

Recent addition:

- `today_only_goals` supports one-off missions for the selected day.

Migration note:

- A migration was added because older local DBs could have `today_only_goals` without `goal_date`.
- Keep this migration unless there is a deliberate DB reset plan.

Stats:

- `getGrowthStats(date)` includes both repeat goals and today-only goals.

## UI System

Primary UI components now live under:

- `src/components/ui/RetroCard.tsx`
- `src/components/ui/RetroButton.tsx`
- `src/components/ui/RetroInput.tsx`
- `src/components/ui/PixelProgressBar.tsx`
- `src/components/ui/PixelSectionTitle.tsx`
- `src/components/ui/PixelTabIcon.tsx`

Compatibility re-export files remain in `src/components/` for older imports.

### Design Tokens

Main files:

- `src/theme/theme.ts`
- `src/theme/design.ts`

Current palette:

- `bg`: `#050505`
- `surface`: `#151922`
- `pink`: `#FF4DB8`
- `cyan`: `#00E5FF`
- `yellow`: `#FFE45C`
- `green`: `#6DFF8F`
- `purple`: `#A855F7`
- `text`: `#FFFFFF`
- `textDim`: `#9AA3B2`

Color roles:

- Pink: main action, TODAY, important emphasis
- Cyan: borders, inputs, secondary button frame
- Yellow: score numbers, progress score, bottom shadow
- Green: complete/success/check state
- Purple: search/tags/system-like functions
- White: primary text
- Gray: descriptions and disabled text

### Font Notes

No real pixel font file is bundled yet.

Current safe fallback:

- `monospace`

Font folder:

- `assets/fonts/README.md`

Recommended future fonts:

- `Galmuri11`
- `NeoDunggeunmo`
- `DungGeunMo`
- `PressStart2P` for English title/score if available

Do not reference font family names in styles unless the font is actually loaded through `expo-font`.

## Recent Commits Of Interest

- `165647f Refine RPG menu layout and HUD components`
- `47dcd06 Polish growth RPG UI structure`
- `c4fee20 Redesign app as growth RPG UI`
- `aa82075 Strengthen retro pixel UI theme`
- `b4a4435 Apply retro bubble pixel theme`
- `c429e0d Remove black screen transition flash`
- `3848f2a Add today goal database migration`
- `bd7484e Clarify home goal sections`
- `dfc26ab Allow custom auto-push commit messages`

## Known Follow-Up Ideas

- Add and load a real Korean pixel font using `expo-font`.
- Build a real `SYSTEM` tab if requested, then move goal management under it.
- Add a stats panel with level/EXP based on logs and completions.
- Improve Calendar day rendering further if `react-native-calendars` custom marking is not pixel enough.
- Add visual QA screenshots on device or emulator after major UI changes.

## How To Continue Next Session

1. Read this file first.
2. Check `git status --short --branch`.
3. Run `npx tsc --noEmit` before any push.
4. If auto-pushing, use:

```powershell
node push.js "Short meaningful commit message"
```

5. Keep the product direction: not productivity app, not diary app, but growth RPG menu.
