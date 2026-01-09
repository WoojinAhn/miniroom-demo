# 🛠️ Miniroom Project Development Guidelines

This document outlines the critical rules and conventions established for the Miniroom Demo project. Please adhere to these guidelines for all future development.

## 1. Version Control & Changelog
- **File**: `src/config/appVersion.ts`
- **Rule**: Every significant change or feature addition **MUST** result in a version bump.
- **Timing**: Review version update after issue is closed.
- **Version Types** (Semantic Versioning):
  | Type | When to Use | Example |
  |------|-------------|---------|
  | **Major** (vX.0.0) | Breaking changes, major overhaul | v2.0.0 |
  | **Minor** (v1.X.0) | New features added | v1.10.0 |
  | **Patch** (v1.9.X) | Bug fixes, minor adjustments | v1.9.1 |
- **Protocol**:
  1. Increment `APP_VERSION`.
  2. Add a new entry to the `CHANGELOG` array with the date and list of features/fixes.
- **Workflow**:
  ```
  Issue → Branch → Work → PR → Merge → Close Issue → Review Version Update
  ```

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
- **Port Management**: Each IDE uses a dedicated port to prevent conflicts.
  | IDE | Port |
  |-----|------|
  | Antigravity | 3000 |
  | **Cursor** | **3001** |
  
  - **Start dev server (Cursor)**:
    ```bash
    npm run dev -- -p 3001
    ```
  - **Kill existing process before starting** (if needed):
    ```bash
    lsof -ti :3001 | xargs kill -9; npm run dev -- -p 3001
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

## 6. Cursor Workflow (Conflict Prevention)
- **Applies to**: Cursor IDE only.
- **Pattern**: Issue → Branch → PR → Review → Merge
- **Steps**:
  1. Create or reference a GitHub Issue before starting work.
  2. Create a feature branch: `cursor/issue-[number]-[short-description]`
  3. Commit changes with `[Cursor]` prefix.
  4. Open a Pull Request and request review.
  5. Merge only after approval.
- **Rationale**: Prevents conflicts with Antigravity working on the same codebase.

## 7. Antigravity Workflow (Review & Merge)
- **Role**: Code Reviewer & Merger
- **Protocol**:
  1. Receive branch/PR for review.
  2. Verify requirements and run checks.
  3. **Reporting**:
     - If critical issues found: **Report to User** (to instruct Cursor to fix). Do **NOT** fix locally unless trivial.
     - If approved: Proceed to Merge.
  4. **Merge**:
     - Antigravity is the designated Merger for `master` branch.
     - Ensure all checks pass before merging.
