# Project Memory - Grow Day

Last updated: 2026-06-10
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
