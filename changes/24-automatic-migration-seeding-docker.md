# Automatic Migration and Seeding in Docker

## Summary

Implemented intelligent automatic database migration and seeding capabilities in Docker Compose with conditional logic to avoid unnecessary operations and data duplication. The system now automatically handles database initialization on container startup while providing fine-grained control over when migrations and seeding should occur.

## Files Created

### Initialization Scripts

- `scripts/docker-init.sh` - Main initialization script with conditional migration and seeding logic
- `scripts/docker-run.sh` - Advanced Docker runner with parameter control

### Configuration Updates

- `Dockerfile` - Updated to include PostgreSQL client and initialization script
- `docker/docker-compose.yml` - Added migration and seeding control environment variables
- `docker/docker-compose.prod.yml` - Added production environment controls
- `package.json` - Added new npm scripts for advanced Docker operations
- `docker/README.md` - Updated documentation with new features

## What Was Implemented

### 1. Intelligent Database Initialization

**Conditional Migration Logic:**

- **Auto Mode (default)**: Runs migrations only if:
  - Core tables (users, categories, posts) are missing
  - Migrations table doesn't exist
  - Database appears uninitialized
- **Force Mode**: Always runs migrations regardless of database state
- **Disabled Mode**: Never runs migrations

**Conditional Seeding Logic:**

- **Auto Mode (default)**: Runs seeding only if:
  - Database tables exist but contain no data
  - All key tables are empty
- **Force Mode**: Always runs seeding (may create duplicates)
- **Disabled Mode**: Never runs seeding

**Database Health Checks:**

- Waits for PostgreSQL to be ready before proceeding
- Validates table existence and structure
- Checks for existing data to prevent duplication
- Provides detailed status reporting

### 2. Advanced Docker Runner Script

**Command-Line Interface:**

```bash
./scripts/docker-run.sh [OPTIONS]

Options:
  -e, --env ENVIRONMENT     Environment (dev/prod)
  -m, --migrate MODE        Migration mode (auto/true/false)
  -s, --seed MODE           Seeding mode (auto/true/false)
  -d, --detached            Run in detached mode
  -r, --rebuild             Force rebuild of images
  -h, --help                Show help message
```

**Usage Examples:**

- `./scripts/docker-run.sh` - Start with auto initialization
- `./scripts/docker-run.sh -m true -s false` - Force migrate, no seeding
- `./scripts/docker-run.sh -e prod` - Start production environment
- `./scripts/docker-run.sh -d -r` - Rebuild and run in background

### 3. Enhanced Dockerfile Configuration

**Development Stage Updates:**

- Added PostgreSQL client tools for database operations
- Integrated initialization script execution
- Maintained hot-reload capabilities
- Added script permissions management

**Production Stage Updates:**

- Included PostgreSQL client for production operations
- Implemented non-root user security with proper permissions
- Added initialization script with proper ownership
- Maintained security hardening

### 4. Environment Variable Controls

**Migration Control:**

- `RUN_MIGRATIONS=auto` (default) - Intelligent migration detection
- `RUN_MIGRATIONS=true` - Always run migrations
- `RUN_MIGRATIONS=false` - Never run migrations

**Seeding Control:**

- `RUN_SEEDING=auto` (default) - Smart seeding based on data presence
- `RUN_SEEDING=true` - Always run seeding
- `RUN_SEEDING=false` - Never run seeding

**Environment-Specific Behavior:**

- Development: Continues on migration/seeding failures
- Production: Exits on migration failures, continues on seeding failures

### 5. NPM Script Integration

**New Scripts Added:**

- `npm run docker:run` - Start with intelligent initialization
- `npm run docker:run:help` - Show all available options
- `npm run docker:run:fresh` - Force rebuild with full initialization
- `npm run docker:run:no-init` - Start without any database operations
- `npm run docker:run:prod` - Start production environment

**Backward Compatibility:**

- Existing `npm run docker:dev` and `npm run docker:prod` still work
- Old workflows continue to function as expected
- New features are opt-in

### 6. Database State Detection

**Table Existence Checking:**

```sql
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'categories', 'posts');
```

**Data Presence Detection:**

```sql
SELECT COUNT(*) FROM (
    SELECT 1 FROM users LIMIT 1
    UNION ALL
    SELECT 1 FROM categories LIMIT 1
    UNION ALL
    SELECT 1 FROM posts LIMIT 1
) as combined_count;
```

**Migration State Verification:**

```sql
SELECT 1 FROM information_schema.tables
WHERE table_name='migrations';
```

## Technical Implementation Details

### Initialization Flow

1. **Database Wait**: Wait for PostgreSQL to be ready (max 60 seconds)
2. **State Detection**: Check table existence and data presence
3. **Migration Decision**: Apply conditional logic for migrations
4. **Migration Execution**: Run migrations if conditions are met
5. **Seeding Decision**: Apply conditional logic for seeding
6. **Seeding Execution**: Run seeding if conditions are met
7. **Final Verification**: Confirm database state
8. **Application Start**: Launch Node.js application

### Error Handling Strategy

- **Development Mode**: Non-fatal errors allow container to start
- **Production Mode**: Migration failures cause container exit
- **Detailed Logging**: Color-coded status messages and progress indicators
- **Graceful Degradation**: Continue with warnings when appropriate

### Performance Optimizations

- **Skip Unnecessary Operations**: Avoid redundant migrations and seeding
- **Fast State Detection**: Efficient database queries for state checking
- **Parallel Readiness**: Database and application startup coordination
- **Minimal Overhead**: Lightweight checks with maximum information

## Usage Instructions

### Basic Usage (Recommended)

```bash
# Start development environment with auto initialization
npm run docker:run

# Access application: http://localhost:8001
# Database will be automatically migrated and seeded if needed
```

### Advanced Usage

```bash
# Fresh start with forced initialization
npm run docker:run:fresh

# Start without any database operations
npm run docker:run:no-init

# Production environment
npm run docker:run:prod

# Custom configuration
./scripts/docker-run.sh --env dev --migrate true --seed false --detached
```

### Environment Variable Control

```bash
# Force migration and seeding
RUN_MIGRATIONS=true RUN_SEEDING=true npm run docker:run

# Only migrations, no seeding
RUN_MIGRATIONS=true RUN_SEEDING=false npm run docker:run

# No database initialization
RUN_MIGRATIONS=false RUN_SEEDING=false npm run docker:run
```

### Development Workflow

1. **First Run**: `npm run docker:run` - Full initialization
2. **Subsequent Runs**: `npm run docker:run` - Smart initialization
3. **Clean Start**: `npm run docker:run:fresh` - Force everything
4. **Testing**: `npm run docker:run:no-init` - Skip DB operations

## Benefits Achieved

1. **Intelligent Automation**: Automatic database setup without manual intervention
2. **No Data Duplication**: Smart detection prevents duplicate seeding
3. **Conditional Operations**: Run only necessary migrations and seeding
4. **Developer Experience**: One command to start everything
5. **Production Ready**: Safe initialization for production environments
6. **Flexible Control**: Fine-grained control over initialization behavior
7. **Backward Compatibility**: Existing workflows continue to work
8. **Error Resilience**: Graceful handling of various failure scenarios

## Migration Detection Logic

### When Migrations Run Automatically:

- Database is completely empty
- Core tables are missing
- Migration tracking table doesn't exist
- Force flag is set (`RUN_MIGRATIONS=true`)

### When Migrations Are Skipped:

- All core tables exist
- Migration tracking table exists
- Auto mode with existing database structure

### When Seeding Runs Automatically:

- Core tables exist but are empty
- No existing data detected in key tables
- Force flag is set (`RUN_SEEDING=true`)

### When Seeding Is Skipped:

- Existing data found in database
- Core tables don't exist (migration needed first)
- Seeding disabled (`RUN_SEEDING=false`)

## Git Commit Message

```
feat(docker): implement automatic migration and seeding with conditional logic

• add intelligent database initialization script (docker-init.sh)
• create advanced Docker runner with parameter control
• implement conditional migration logic (auto/true/false modes)
• add smart seeding detection to prevent data duplication
• integrate PostgreSQL client tools in Docker images
• add environment variable controls for initialization
• create new npm scripts for advanced Docker operations
• update documentation with new features and usage examples
• maintain backward compatibility with existing workflows
• implement error handling for development and production modes
```
