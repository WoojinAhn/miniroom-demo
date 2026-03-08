# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Miniroom Maker — a drag-and-drop room decorator app built with Next.js 16, TypeScript, and Tailwind CSS v4. Users place, rotate, flip, scale, and layer pixel-art items on a responsive canvas. Deployed on Vercel.

## Commands

```bash
# Dev server (scan-items runs automatically before next dev)
npm run dev

# Production build (also runs scan-items first)
npm run build

# Lint
npm run lint

# E2E tests (Playwright, Chromium only — starts dev server automatically)
npm run test:e2e

# E2E tests with UI mode
npm run test:e2e:ui
```

Verify `npm run build` passes before committing. E2E tests are in `e2e/` using Playwright (port 3001).

### Writing E2E Tests

- Canvas items have `pointerEvents: "none"` on `<img>` — use `force: true` when clicking/double-clicking items by their img selector (e.g., `.click({ force: true })`)
- Canvas inner container: `page.locator("main").locator("[style*='background']").first()`
- Inventory items: use `page.getByRole("button", { name: "Item Name" })` — button text includes both img alt and label
- Item count in canvas: `canvasInner.locator("> div").count()`

## Architecture

### Data Flow

`scan-items.js` → `generated-inventory.json` → `mockMiniroom.ts` → `useMiniroom` hook → React components

1. **Build-time asset scanning**: `scripts/scan-items.js` scans `public/items/` for images, reads dimensions and transparency padding via `pngjs`/`image-size`, and writes `src/data/generated-inventory.json` (gitignored).
2. **Data layer** (`src/data/`): `mockMiniroom.ts` merges generated inventory with hardcoded special/character items and defines `INITIAL_ROOM`. `backgrounds.ts` defines available backgrounds with canvas dimensions.
3. **State management**: `useMiniroom` hook owns all room state (`Room` with `PlacedItem[]`). Array order = z-index (last element renders on top).
4. **Rendering**: `RoomCanvas` uses `ResizeObserver` to compute `globalScale = containerWidth / canvasWidth`, applying CSS transforms. Each `DraggableItem` has a two-layer transform: outer (position, rotation, scale with `transformOrigin: center bottom`) and inner (horizontal flip via `scaleX`).

### Key Files

- `src/app/miniroom/hooks/useMiniroom.ts` — core state and all item manipulation actions
- `src/app/miniroom/hooks/usePointerDrag.tsx` — pointer event-based drag handling
- `src/app/miniroom/hooks/useItemPinchScale.ts` — mobile pinch-to-scale
- `src/app/miniroom/components/RoomCanvas.tsx` — responsive canvas with global scaling
- `src/app/miniroom/components/DraggableItem.tsx` — item rendering, selection UI, toolbar
- `src/app/miniroom/components/Inventory.tsx` — item picker (special + general sections)
- `src/app/miniroom/components/MobileControlPanel.tsx` — touch controls (visible when `width < 768px`)
- `src/types/miniroom.ts` — `Item`, `PlacedItem`, `Room` interfaces
- `src/config/appVersion.ts` — `APP_VERSION` and `CHANGELOG` array

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Development Rules

### Version & Changelog

Every significant change requires a version bump in `src/config/appVersion.ts`. Follow semver. Add a `CHANGELOG` entry with date and description.

### Asset Conventions

- `public/items/` — general items (126×126 default)
- `public/characters/` — characters (60×120)
- `public/special/` — special items
- Filenames: `snake_case`
- New assets are auto-registered by `scan-items.js`; special/character items must be manually added in `mockMiniroom.ts`

### Character Rules

- Must have `type: 'character'` — hidden from inventory, cannot be deleted via double-click
- Default character (`cha01`) is placed in room center in `INITIAL_ROOM`

### Pre-close Verification

Before closing an issue, run verification based on the change scope:
- **UI/interaction/logic changes**: run full E2E suite (`npm run test:e2e`)
- **Config, docs, assets, or styling-only changes**: run `npm run build` only

Every new feature or behavior change must include relevant E2E test cases in the same commit/PR. Bug fixes should add a test if the bug was reproducible via UI interaction.

### Commit Convention

AI IDE commits use prefix format: `[Claude] type: description` (e.g., `[Claude] feat: add new item`). Human commits use standard format without prefix.

### Branch Workflow

For feature work: create a GitHub Issue → branch `claude/issue-[number]-[description]` → PR → review → merge to `master`.
