# Tiny Growth Design System

Tiny Growth is a premium dark productivity app for daily developer work logs.
The interface prioritizes information hierarchy, writing flow, and repeat use.

## Principles

- Minimal decoration and strong typography
- Low-contrast surfaces instead of colorful borders
- One primary accent per interaction
- Generous spacing with compact information grouping
- Existing SQLite behavior remains independent from visual components

## Colors

- Background: `#0B1010`
- Card: `#151C1A`
- Elevated surface: `#1D2723`
- Primary: `#74D99F`
- Secondary: `#8AD7C1`
- Success: `#5FD38D`
- Warm seed accent: `#E6B86A`
- Text: `#F7FBF7`
- Subtext: `#9BAEA4`
- Border: `rgba(247,251,247,0.055)`

## Tiny Growth Visual Tone

- Keep the base dark, quiet, and minimal, then add soft growth warmth through
  mint, sage, and seed-yellow accents.
- Use seed/sprout motifs as small supporting details, not mascots or characters.
- Prefer code-drawn `View` shapes such as `TinySprout` over image assets.
- Primary actions should feel like leaving a small growth note rather than
  completing a heavy task.
- Empty states should imply that records will grow over time, not that something
  is missing or wrong.
- Cards can be softly rounded and spacious, but avoid toy-like proportions,
  loud colors, and decorative clutter.
- Do not use external copyrighted assets, Lottie, GIFs, character images, or
  branded visual references.

## Theme / Appearance

- Dark mode is the default Tiny Growth tone: dark garden background, soft mint
  primary actions, sage secondary accents, and warm seed-yellow highlights.
- Light mode uses a soft garden tone: pale green-white background, white cards,
  deep green-black text, muted sage secondary text, mint actions, and warm seed
  accents.
- Both modes must preserve the same information hierarchy and spacing.
- Check contrast whenever text, chips, chart bars, or buttons move between modes.
- Theme colors should come from `src/theme/theme.ts`; avoid adding new
  hard-coded colors unless they are mode-specific overlays.
- Do not add external theme libraries. Theme state is managed by
  `ThemeProvider` and persisted in SQLite `app_settings`.

## Layout

- Screen horizontal padding: `20`
- Card gap: `16`
- Card padding: `20-24`
- Card radius: `26`
- Button height: `56`
- Button radius: `20`

## Motion / Micro-interaction

- Buttons and selectable rows use a subtle press scale around `0.97-0.99`.
- Card entrance motion should stay short: `250-400ms` fade with a small vertical slide.
- Save completion feedback uses `GrowthFeedbackModal` for a single lightweight success moment.
- Repeating animation should be avoided unless it directly supports feedback.
- Motion should keep the dark minimal tone and must not become game-like.
- Do not use external copyrighted animation assets, GIFs, Lottie files, or character images.

## Component Structure

- `src/theme/theme.ts`: base color, spacing, and radius tokens
- `src/theme/design.ts`: application-facing design aliases and typography
- `src/components/ui/RetroCard.tsx`: compatibility card using the modern surface style
- `src/components/ui/RetroButton.tsx`: compatibility button using the modern CTA style
- `src/components/ui/RetroInput.tsx`: compatibility input using the modern field style
- `src/components/AppHeader.tsx`: screen and navigation headers
- `src/components/TinySprout.tsx`: small code-drawn seed/sprout motif
- `src/components/TodoItem.tsx`: daily goal checklist row
- `src/components/LogCard.tsx`: reusable work-log result card

The `Retro*` filenames remain temporarily to avoid unnecessary import churn. Their
visual implementation is no longer retro.
