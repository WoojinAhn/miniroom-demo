# 🛠️ Miniroom Project Development Guidelines

This document outlines the critical rules and conventions established for the Miniroom Demo project. Please adhere to these guidelines for all future development.

## 1. Version Control & Changelog
- **File**: `src/config/appVersion.ts`
- **Rule**: Every significant change or feature addition **MUST** result in a version bump.
- **Protocol**:
  1. Increment `APP_VERSION`.
  2. Add a new entry to the `CHANGELOG` array with the date and list of features/fixes.

## 2. Resource Management
- **Directory Structure**:
  - `public/items/`: General inventory items (furniture, decorations, electronics).
  - `public/characters/`: Character assets only.
- **Naming Convention**:
  - Use snake_case for filenames (e.g., `rug_striped.png`, `cha01.png`).
- **Data Registration**:
  - Register all new assets in `src/data/mockMiniroom.ts`.
  - Use `126x126` dimensions for standard inventory items unless specified otherwise.
  - Use `60x120` dimensions for characters.

## 3. Character Logic
- **Type**: Characters must have `type: 'character'` in their `Item` definition.
- **Persistence**: Characters are **NOT** selectable from the inventory (they are hidden from the list).
- **Deletion Protection**: Characters **cannot be deleted** via double-click. This logic is enforced in `useMiniroom.ts`.
- **Default Placement**: The main character (`cha01`) is placed in the room center by default in `INITIAL_ROOM`.

## 4. Development Workflow
- **Port Management**: The dev server tends to lock port 3000.
  - **Command**: Always kill the existing process before starting:
    ```bash
    lsof -ti :3000 | xargs kill -9; npm run dev
    ```
- **Testing**:
  - Verify `npm run build` passes before committing.
  - Check browser console for unique key errors or hydration mismatches.

## 5. Commit Convention (AI IDE Tracking)
- Commits made by AI IDEs **MUST** include the IDE name as a prefix.
- **Format**: `[IDE_NAME] type: description`
- **Examples**:
  - `[Cursor] feat: add new inventory item`
  - `[Antigravity] fix: resolve drag issue`
- **Note**: For manual (human) commits, use standard commit messages without prefix.
