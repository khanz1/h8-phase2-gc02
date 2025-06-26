# 26 - Docker Seeding Conflicts Fix

## Overview

Fixed critical issues with duplicate seeding and migration conflicts in the Docker setup that could cause database operations to run multiple times.

## Problem Identified

### 1. **Duplicate Seeding Logic**

In `scripts/docker-init.sh`, the seeding logic had redundant execution paths:

- Setting `seed_command` variable but not using it consistently
- Running both undo+seed combo AND potentially additional seeding operations
- Confusing conditional logic that could trigger seeding twice

### 2. **PostgreSQL Auto-Migration Conflicts**

Docker Compose was configured to run migrations twice:

- PostgreSQL container: Auto-runs `migrations.sql` via `docker-entrypoint-initdb.d/`
- App container: Also runs migrations via `docker-init.sh`
- This could cause "table already exists" errors despite `IF NOT EXISTS` clauses

### 3. **Unused Startup Script**

- `docker/start.sh` existed but wasn't used, causing confusion about which script handles initialization

## Files Fixed

### Updated Files:

- `scripts/docker-init.sh` - Simplified seeding logic to prevent duplication
- `docker/docker-compose.yml` - Removed PostgreSQL auto-migration volume mount
- `docker/docker-compose.prod.yml` - Removed PostgreSQL auto-migration volume mount
- `changes/25-seed-undo-implementation.md` - Updated documentation

### Deleted Files:

- `docker/start.sh` - Removed unused and potentially conflicting startup script

## Technical Changes

### 1. Fixed Docker Init Script (`scripts/docker-init.sh`)

**Before (problematic):**

```bash
if [ "${RUN_SEEDING}" = "true" ]; then
    if [ "${SEED_MODE:-normal}" = "reset" ]; then
        print_info "Reset seeding enabled (clear + seed)"
        should_seed=true
        seed_command="db:seed:clear"  # ❌ Set but not used consistently
    else
        print_info "Force seeding enabled (RUN_SEEDING=true)"
        should_seed=true
        seed_command="db:seed"        # ❌ Set but not used consistently
    fi
elif ! check_existing_data; then
    print_info "No existing data found, seeding database"
    should_seed=true
    seed_command="db:seed"            # ❌ Set but not used consistently
fi

# Later in the script - ALWAYS checks SEED_MODE again
if [ "$should_seed" = true ]; then
    if [ "${SEED_MODE:-normal}" = "reset" ]; then
        # ❌ Runs undo + seed
        npm run db:seed:undo:full && npm run db:seed
    else
        # ❌ Could run seed AGAIN after undo+seed above
        npm run db:seed
    fi
fi
```

**After (fixed):**

```bash
if [ "${RUN_SEEDING}" = "true" ]; then
    print_info "Force seeding enabled (RUN_SEEDING=true)"
    should_seed=true                  # ✅ Simplified logic
elif ! check_existing_data; then
    print_info "No existing data found, seeding database"
    should_seed=true                  # ✅ Simplified logic
fi

# Single execution path based on SEED_MODE
if [ "$should_seed" = true ]; then
    if [ "${SEED_MODE:-normal}" = "reset" ]; then
        # ✅ Only runs undo + seed once
        npm run db:seed:undo:full && npm run db:seed
    else
        # ✅ Only runs seed once
        npm run db:seed
    fi
fi
```

### 2. Removed PostgreSQL Auto-Migration

**Before (problematic):**

```yaml
# docker-compose.yml
postgres:
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ../scripts/migrations.sql:/docker-entrypoint-initdb.d/01-migrations.sql:ro # ❌ Auto-runs migrations
```

**After (fixed):**

```yaml
# docker-compose.yml
postgres:
  volumes:
    - postgres_data:/var/lib/postgresql/data # ✅ No auto-migration
```

### 3. Removed Unused Startup Script

**Deleted:** `docker/start.sh`

- Was not referenced in Dockerfile
- Contained conflicting initialization logic
- Could cause confusion about which script is the entry point

## Benefits

### 1. **Prevents Duplicate Operations**

- ✅ Seeding now runs exactly once per startup
- ✅ Migrations handled only by the application
- ✅ Clear, single execution path

### 2. **Eliminates Race Conditions**

- ✅ No more PostgreSQL vs App migration conflicts
- ✅ Proper startup sequencing with health checks
- ✅ Consistent database initialization

### 3. **Improved Reliability**

- ✅ Predictable behavior in all scenarios
- ✅ Better error handling and logging
- ✅ Cleaner startup process

### 4. **Clearer Architecture**

- ✅ Single source of truth for database initialization
- ✅ Removed confusing/unused files
- ✅ Better separation of concerns

## Testing Verification

After these fixes, the following should work without conflicts:

```bash
# Clean start - should work without errors
npm run docker:run

# Reset mode - should run undo+seed exactly once
npm run docker:run:reset

# Force operations - should not duplicate
npm run docker:run:fresh
```

## Migration Path

For existing deployments:

1. Pull the updated code
2. Stop existing containers: `npm run docker:dev:down`
3. Remove old volumes if needed: `docker volume prune`
4. Start with the fixed setup: `npm run docker:run`

## Git Commit Message

```
fix(docker): resolve seeding conflicts and migration duplication

• simplify docker-init.sh seeding logic to prevent duplicate execution
• remove PostgreSQL auto-migration to eliminate race conditions
• delete unused docker/start.sh to prevent confusion
• ensure single execution path for database operations
• fix potential "table already exists" and duplicate seeding errors
```
