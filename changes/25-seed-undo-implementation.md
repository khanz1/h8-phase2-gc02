# 25 - Seed Undo Implementation

## Overview

Implemented comprehensive seed undo functionality with advanced options including `restartIdentity`, `truncate`, and `cascade` for all database tables in the seeder system.

## Files Created/Updated

### Updated Files:

- `scripts/seeder.ts` - Added advanced undo functionality with three methods
- `scripts/migrations.sql` - Added `IF NOT EXISTS` to all CREATE TABLE and CREATE INDEX statements
- `package.json` - Added new npm scripts for undo operations
- `scripts/docker-init.sh` - Enhanced reset mode to use new truncate functionality
- `docker/docker-compose.yml` - Removed PostgreSQL auto-migration to prevent conflicts
- `docker/docker-compose.prod.yml` - Removed PostgreSQL auto-migration to prevent conflicts

### Deleted Files:

- `docker/start.sh` - Removed unused startup script to prevent confusion

## Technical Implementation

### 1. Enhanced Migration Script (`scripts/migrations.sql`)

```sql
-- Updated all CREATE statements to use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS "Users" (...)
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "Users"("email");
```

**Changes:**

- Added `IF NOT EXISTS` to all 17 CREATE TABLE statements
- Added `IF NOT EXISTS` to all 32 CREATE INDEX statements
- Makes migrations idempotent and prevents duplicate table/index errors

### 2. Advanced Undo Functionality (`scripts/seeder.ts`)

#### Three New Methods Added:

**Method 1: `undoSeeds(options)`** - Advanced undo with options

- Supports `restartIdentity`, `truncate`, and `cascade` options
- Uses either truncate or destroy based on options
- Full transaction support

**Method 2: `truncateAllTables(transaction, options)`** - Raw SQL truncate

- Direct PostgreSQL TRUNCATE commands with options
- Handles individual table truncation and cascade fallback
- Proper dependency order handling

**Method 3: `quickTruncate(options)`** - Sequelize built-in truncate

- Uses Sequelize's built-in truncate method
- Model-based approach with error handling
- Supports all truncate options

#### Options Support:

```typescript
interface UndoOptions {
  restartIdentity?: boolean; // Reset auto-increment sequences
  truncate?: boolean; // Use TRUNCATE instead of DELETE
  cascade?: boolean; // Handle foreign key constraints
}
```

### 3. Enhanced CLI Commands

```bash
# Basic undo (uses DELETE)
npx ts-node scripts/seeder.ts undo

# Truncate without options
npx ts-node scripts/seeder.ts undo --truncate

# Full reset with all options
npx ts-node scripts/seeder.ts undo --truncate --restart-identity --cascade

# Quick Sequelize truncate
npx ts-node scripts/seeder.ts truncate --restart-identity
```

### 4. New NPM Scripts (`package.json`)

```json
{
  "db:seed:undo": "ts-node -r tsconfig-paths/register scripts/seeder.ts undo",
  "db:seed:undo:truncate": "ts-node -r tsconfig-paths/register scripts/seeder.ts undo --truncate",
  "db:seed:undo:full": "ts-node -r tsconfig-paths/register scripts/seeder.ts undo --truncate --restart-identity --cascade",
  "db:seed:truncate": "ts-node -r tsconfig-paths/register scripts/seeder.ts truncate --restart-identity"
}
```

### 5. Docker Integration (`scripts/docker-init.sh`)

Enhanced reset mode to use advanced truncate:

```bash
if [ "${SEED_MODE:-normal}" = "reset" ]; then
    print_info "Advanced reset: Truncating with restart identity and cascade..."
    if npm run db:seed:undo:full; then
        print_info "Database cleared successfully, now seeding fresh data..."
        if npm run db:seed; then
            print_status 0 "Database reset and seeding completed successfully!"
        fi
    fi
fi
```

## Usage Examples

### Command Line Usage:

```bash
# Basic undo (preserves sequences)
npm run db:seed:undo

# Truncate with restart sequences
npm run db:seed:undo:truncate

# Full reset (truncate + restart + cascade)
npm run db:seed:undo:full

# Quick Sequelize truncate
npm run db:seed:truncate
```

### Docker Usage:

```bash
# Use enhanced reset mode
npm run docker:run:reset
# or
./scripts/docker-run.sh --migrate true --seed reset
```

### Programmatic Usage:

```typescript
const seeder = new SeedRunner();

// Basic undo
await seeder.undoSeeds();

// Advanced undo with all options
await seeder.undoSeeds({
  restartIdentity: true,
  truncate: true,
  cascade: true,
});

// Quick truncate
await seeder.quickTruncate({
  restartIdentity: true,
  cascade: true,
});
```

## Key Features

### 1. Multiple Undo Strategies:

- **DELETE**: Soft removal preserving sequences
- **TRUNCATE**: Fast table clearing with optional sequence reset
- **CASCADE**: Handle foreign key constraints automatically

### 2. Robust Error Handling:

- Transaction rollback on failures
- Individual table fallback for cascade failures
- Detailed logging with duration tracking

### 3. Table Dependency Management:

- Proper reverse dependency order for safe deletion
- All 17 tables handled correctly:
  - `Restaurant_Cuisines` → `Restaurant_Categories`
  - `Career_Jobs` → `Career_Companies`
  - `News_Articles` → `News_Categories`
  - `Room_Lodgings` → `Room_Types`
  - `Rental_Transportations` → `Rental_Types`
  - `Movie_Movies` → `Movie_Genres`
  - `Branded_Products` → `Branded_Categories`
  - `Blog_Posts` → `Blog_Categories`
  - `Users` (base dependency)

### 4. Performance Options:

- **TRUNCATE**: Much faster than DELETE for large tables
- **RESTART IDENTITY**: Resets auto-increment sequences to 1
- **CASCADE**: Automatically handles foreign key dependencies

## Benefits

1. **Idempotent Migrations**: IF NOT EXISTS prevents duplicate errors
2. **Flexible Undo Options**: Choose strategy based on needs
3. **Better Performance**: TRUNCATE is significantly faster than DELETE
4. **Sequence Management**: Restart identity ensures clean test data
5. **Foreign Key Safety**: CASCADE option handles constraints automatically
6. **Docker Integration**: Enhanced reset mode for containerized environments

## Git Commit Message

```
feat(seeder): implement advanced undo functionality with truncate options

• add undoSeeds method with restartIdentity, truncate, cascade options
• implement truncateAllTables with raw SQL TRUNCATE commands
• add quickTruncate using Sequelize built-in truncate method
• update migrations.sql with IF NOT EXISTS for idempotent operations
• enhance docker-init.sh reset mode to use new truncate functionality
• add comprehensive npm scripts for different undo strategies
• support all 17 database tables with proper dependency order
• provide transaction safety and detailed error handling
```
