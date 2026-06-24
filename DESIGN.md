# Tiny Growth Design System

Tiny Growth 1.0.0 is a light pastel growth and productivity journal. The
interface combines a warm garden / note tone with clear information hierarchy,
comfortable writing flow, and repeat use.

## Release Baseline

- Expo SDK 54 is the project baseline; `package.json` is the version source of
  truth.
- `app.json` fixes the native interface style to `light`.
- `src/theme/theme.ts` sets `RELEASE_THEME_MODE` and `DEFAULT_THEME_MODE` to
  `light`.
- `ThemeProvider` normalizes stored theme values to `light`.
- `SettingsScreen` does not expose appearance controls in Tiny Growth 1.0.0.
- Dark theme tokens and `ThemeOptionList` remain only for compatibility and
  possible future reuse. They are not part of the current shipped UI.

## Principles

- Use light, warm surfaces and strong readable typography.
- Keep decoration restrained and use one clear accent per interaction.
- Use generous spacing with compact information grouping.
- Preserve an adult, calm tone; avoid arcade, game-like, or toy-like visuals.
- Keep existing SQLite behavior independent from visual components.

## Colors

The 1.0.0 release palette is centralized in `src/theme/lightPastel.ts`.

- Background: `#F7F3E9`
- Paper: `#FFFDF8`
- Warm paper: `#FFF8EE`
- Mint: `#DDF2D2`
- Primary green: `#62AA78`
- Strong green: `#397D54`
- Green text: `#2D6F4D`
- Soft green: `#E4F3DD`
- Yellow accent: `#FFE6B8`
- Blue accent: `#DCE9F7`
- Peach accent: `#F7DDBF`
- Pink accent: `#F5D9D5`
- Line: `#E8DFC9`

Use `LIGHT_PASTEL` for the current release-specific surfaces and accents. Use
semantic theme values from `src/theme/theme.ts` where components already depend
on the theme interface. Do not add scattered hard-coded colors when an existing
token fits; add a centralized token when a new reusable color is necessary.

## Tiny Growth Visual Tone

- Keep the base light, warm, quiet, and note-like.
- Use mint, green, and seed-yellow as the primary growth accents.
- Use blue, peach, and pink as restrained supporting surface colors.
- Use seed/sprout motifs as small supporting details, not mascots or characters.
- Prefer code-drawn `View` shapes such as `TinySprout` over image assets.
- Primary actions should feel like leaving a small growth note rather than
  completing a heavy task.
- Empty states should imply that records will grow over time, not that something
  is missing or wrong.
- Cards can be softly rounded and spacious, but avoid loud colors and decorative
  clutter.
- Do not use external copyrighted assets, Lottie, GIFs, character images, or
  branded visual references.

## Theme / Appearance

- Tiny Growth 1.0.0 ships in light mode only.
- `selectedThemeMode` remains in SQLite `app_settings` for compatibility, but
  the current `ThemeProvider` always normalizes it to `light`.
- `darkTheme`, `getThemeByMode()`, and `ThemeOptionList` are retained code, not
  evidence that dark mode is exposed in the current product.
- A future theme-mode release must be treated as a separate feature change and
  revalidate contrast, Settings UX, persistence, navigation, and store assets.
- Do not add external theme libraries.

## Layout

- Screen horizontal padding: `20`
- Card gap: `16`
- Card padding: `20-24`
- Card radius: `26`
- Button height: `56`
- Button radius: `20`

## Motion / Micro-interaction

- Buttons and selectable rows use a subtle press scale around `0.97-0.99`.
- Card entrance motion should stay short: `250-400ms` fade with a small vertical
  slide.
- Save completion feedback uses `GrowthFeedbackModal` for one lightweight
  success moment.
- Avoid repeating animation unless it directly supports feedback.
- Motion must preserve the calm light pastel tone and must not become game-like.
- Do not use external copyrighted animation assets, GIFs, Lottie files, or
  character images.

## Component Structure

- `src/theme/theme.ts`: theme interface, compatibility palettes, spacing, and
  radius tokens
- `src/theme/lightPastel.ts`: Tiny Growth 1.0.0 light pastel palette and card
  shadow
- `src/theme/design.ts`: application-facing compatibility aliases and typography
- `src/theme/ThemeProvider.tsx`: release theme enforcement and theme context
- `src/components/ui/RetroCard.tsx`: compatibility card using the current surface
  style
- `src/components/ui/RetroButton.tsx`: compatibility button using the current CTA
  style
- `src/components/ui/RetroInput.tsx`: compatibility input using the current field
  style
- `src/components/AppHeader.tsx`: screen and navigation headers
- `src/components/TinySprout.tsx`: small code-drawn seed/sprout motif
- `src/components/TodoItem.tsx`: daily goal checklist row
- `src/components/LogCard.tsx`: reusable work-log result card

The `Pixel*` and `Retro*` filenames remain to avoid unnecessary import churn.
They are compatibility names only: their presence does not authorize pixel,
arcade, retro, neon, or game-like visual styling.
