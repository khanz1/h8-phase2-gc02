# Seed API Implementation

## What Changed

- Migrated all logic from `scripts/seeder.ts` to `src/shared/services/seed.service.ts` using proper TypeScript imports
- Removed all `require` usage in favor of ES module imports
- Moved the `data/` directory into `src/data/` for better project structure
- Deleted the obsolete `scripts/seeder.ts` and root-level `data/` directory
- Fixed `.env` to ensure `SEED_CODE` is properly set and loaded
- Confirmed the `/api/seed` endpoint works as expected with the new structure

## Implementation Details

### Migration

- All seeding, truncation, and undo logic is now in `SeedService` with clean TypeScript code
- Models are imported at the top, not dynamically required
- Data directory is referenced as `src/data` in the service

### API

- `/api/seed?code=anggaganteng&type=seed` now works and is browser-accessible
- Supports `type=seed`, `type=re-seed`, and `type=empty` as before

### Files Created/Updated/Deleted

- **Created/Updated**: `src/shared/services/seed.service.ts` (full seeder logic)
- **Moved**: `data/` → `src/data/`
- **Deleted**: `scripts/seeder.ts`, root `data/`
- **Updated**: `.env` (fixed SEED_CODE)

## Pros and Cons

**Pros:**

- Cleaner, maintainable, and testable code
- No more require hacks; all TypeScript imports
- Data is now properly colocated with source
- No more duplicate/legacy seeder files

**Cons:**

- None significant; all functionality preserved

## Bugs/Guides

- If you get `Seed functionality is not configured`, check `.env` for a correct `SEED_CODE` line (no typos, not merged with other lines)
- Always restart the server after changing `.env`

## Commit Message

```
refactor(seed): migrate seeder.ts to TypeScript service, move data to src, cleanup legacy files

- Move all seeder logic to src/shared/services/seed.service.ts with proper imports
- Move data/ to src/data/
- Remove scripts/seeder.ts and root data/
- Fix .env SEED_CODE loading and document restart requirement
```
