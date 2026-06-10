# Grow Day Design System

Grow Day is a premium dark productivity app for daily developer work logs.
The interface prioritizes information hierarchy, writing flow, and repeat use.

## Principles

- Minimal decoration and strong typography
- Low-contrast surfaces instead of colorful borders
- One primary accent per interaction
- Generous spacing with compact information grouping
- Existing SQLite behavior remains independent from visual components

## Colors

- Background: `#0B0F14`
- Card: `#151B23`
- Elevated surface: `#1F2630`
- Primary: `#6C63FF`
- Secondary: `#4CC9F0`
- Success: `#22C55E`
- Text: `#FFFFFF`
- Subtext: `#8B93A7`
- Border: `rgba(255,255,255,0.06)`

## Layout

- Screen horizontal padding: `20`
- Card gap: `16`
- Card padding: `20-24`
- Card radius: `24`
- Button height: `56`
- Button radius: `18`

## Component Structure

- `src/theme/theme.ts`: base color, spacing, and radius tokens
- `src/theme/design.ts`: application-facing design aliases and typography
- `src/components/ui/RetroCard.tsx`: compatibility card using the modern surface style
- `src/components/ui/RetroButton.tsx`: compatibility button using the modern CTA style
- `src/components/ui/RetroInput.tsx`: compatibility input using the modern field style
- `src/components/AppHeader.tsx`: screen and navigation headers
- `src/components/TodoItem.tsx`: daily goal checklist row
- `src/components/LogCard.tsx`: reusable work-log result card

The `Retro*` filenames remain temporarily to avoid unnecessary import churn. Their
visual implementation is no longer retro.
