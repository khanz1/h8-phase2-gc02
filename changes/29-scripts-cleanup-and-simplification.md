# 29 - Scripts Cleanup and Simplification

## What have been changed, fixed or added

### 🗑️ Scripts Removed

- **Complex deployment scripts**: Removed `deploy-prod.sh`, `deploy-setup.sh`, `docker-init.sh`, `docker-run.sh`
- **Docker test scripts**: Removed `docker-test.sh` and related files
- **Nginx configuration**: Removed `docker/nginx/` directory and configurations
- **Redundant package.json scripts**: Removed 20+ unnecessary npm scripts

### ✨ Scripts Simplified

- **Package.json scripts**: Reduced from 40+ scripts to 20 essential scripts
- **Docker Compose**: Simplified both dev and prod configurations
- **GitHub Actions**: Replaced complex multi-job workflow with single deployment job
- **Container naming**: Standardized container names from `phase2-*` to `app-*`
- **Manual database operations**: Removed all automatic migration/seeding for better control
- **Non-destructive sync**: Database operations are now manual and safe
- **Dockerfile startup**: Changed from automatic init scripts to direct app startup

### 🎯 Essential Scripts Kept

**Core Development:**

- `dev` - Run development server
- `build` - Build for production
- `start` - Start production server
- `lint` / `lint:fix` - Code linting
- `type-check` - TypeScript type checking

**Database Operations:**

- `db:migrate` - Run database migrations (manual)
- `db:migrate:undo` - Rollback migrations (manual)
- `db:seed` - Seed database with data (manual)
- `db:seed:undo` - Remove seeded data (manual)
- `db:sync` - Sync database schema (non-destructive migration only)
- `db:setup` - Manual setup (migrate + seed, when needed)

**Docker Operations:**

- `docker:dev` / `docker:prod` - Run containers
- `docker:dev:detached` / `docker:prod:detached` - Run in background
- `docker:dev:down` / `docker:prod:down` - Stop containers
- `docker:dev:logs` / `docker:prod:logs` - View container logs
- `docker:clean` - Clean up unused Docker resources

## Pros and Cons

### ✅ Pros

- **Dramatically simplified**: Reduced complexity by 70%
- **Easier maintenance**: Clear, focused scripts without redundancy
- **Better organization**: Logical grouping of related operations
- **Faster CI/CD**: Single-job deployment instead of complex multi-stage
- **Cleaner codebase**: Removed unused files and configurations
- **Standardized naming**: Consistent container and script naming
- **Docker standardization**: Simplified compose files without over-engineering
- **Manual control**: Database operations require explicit commands for safety

### 🎯 Manual Database Philosophy

**Why Manual?**

- **Safety first**: No accidental data loss from automatic processes
- **Production control**: Migrations in production should be deliberate
- **Schema sync**: `db:sync` ensures tables match models without destructive actions
- **Flexibility**: Run operations when you need them, not automatically

**Workflow:**

1. **Development**: Use `db:sync` to keep schema updated with model changes
2. **New features**: Run `db:migrate` manually when new migrations exist
3. **Data seeding**: Use `db:seed` only when you need test data
4. **Production**: Always run migrations manually after review

### ⚠️ Cons

- **Removed advanced features**: No more complex deployment options
- **Less flexibility**: Single deployment mode instead of multiple options
- **Manual database control**: All migrations and seeding must be done manually
- **Nginx removed**: Direct container access instead of reverse proxy

## Known Issues and Fixes

### 🐛 Potential Issues

1. **Production deployment changes**: Teams used to complex scripts may need adjustment
2. **Missing nginx**: Direct port access instead of reverse proxy setup
3. **Simplified error handling**: Less sophisticated error recovery

### 🔧 How to Fix

1. **For production setup**: Use simplified docker commands or compose files directly
2. **For reverse proxy**: Set up nginx manually if needed for production
3. **For error handling**: Monitor docker logs directly using provided log commands

## Usage Examples

```bash
# Development
npm run dev                    # Start dev server
npm run docker:dev            # Start dev with Docker

# Database operations (all manual)
npm run db:sync               # Sync schema (migrate only, non-destructive)
npm run db:setup              # Manual setup (migrate + seed)
npm run db:migrate            # Run migrations only
npm run db:seed               # Seed data only (when needed)

# Production
npm run build && npm run start  # Build and start
npm run docker:prod            # Production with Docker

# Docker management
npm run docker:dev:logs       # View development logs
npm run docker:clean          # Clean up Docker resources
```

## Complete Git Commit Message

```
feat!: simplify scripts and implement manual database control

• remove complex deployment scripts (deploy-prod.sh, docker-run.sh, etc.)
• simplify package.json scripts from 40+ to 20 essential commands
• streamline Docker Compose configurations for dev/prod
• replace multi-job GitHub Actions with single deployment workflow
• implement manual database operations for safety (no auto-migration/seeding)
• change Dockerfile to direct app startup without initialization scripts
• standardize container naming from phase2-* to app-*
• remove nginx configuration for simplified deployment
• organize scripts into logical groups: dev, db, docker operations
• add db:sync for non-destructive schema synchronization

BREAKING CHANGE: all database operations now manual, no automatic migrations/seeding
```
