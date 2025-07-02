# Database Migration & Seeding Workflow Implementation

## Changes Made

### 1. Enhanced Dockerfile with Multi-Stage Migration Support

**Files Modified:**

- `Dockerfile`

**Changes:**

- Added new `migration` stage for dedicated database operations
- Enhanced `development` stage with automatic database setup options
- Enhanced `production` stage with conditional migration support
- Added wait mechanisms for database readiness
- Created shell scripts for database operations management

**Key Features:**

- **Migration Stage**: Dedicated container for running migrations and seeding
- **Development Auto-Setup**: Configurable automatic database setup on startup
- **Production Safety**: Migrations handled by CI/CD, not application startup
- **Database Wait Logic**: Ensures database is ready before operations

### 2. Enhanced GitHub Actions CI/CD Pipeline

**Files Modified:**

- `.github/workflows/deploy.yml`

**Changes:**

- Added separate build and push for migration container
- Implemented proper migration sequence in production deployment
- Added seeding control via environment variables
- Enhanced deployment workflow with database operations

**Deployment Sequence:**

1. Build and push migration + production images
2. Start PostgreSQL container
3. Run database migrations using migration container
4. Optionally run seeding (controlled by `ENABLE_SEEDING` environment variable)
5. Start main application container

### 3. Updated Docker Compose Files

**Files Modified:**

- `docker-compose.yml` (development)
- `docker-compose.prod.yml` (production)

**Changes:**

- Standardized environment variable usage
- Added migration service for development
- Updated network configuration for better container communication
- Added environment-based database setup control
- Simplified production configuration with `.env` file support

## Pros and Cons

### Pros ✅

1. **Separation of Concerns**

   - Database operations separated from application startup
   - Dedicated migration container prevents application container bloat
   - Clear distinction between development and production workflows

2. **Production Safety**

   - Migrations run before application deployment
   - Prevents application startup with outdated database schema
   - Rollback capabilities with proper error handling

3. **Development Flexibility**

   - Automatic database setup in development environment
   - Manual migration control when needed
   - Easy switching between migration-only and full setup

4. **CI/CD Integration**

   - Proper migration sequence in deployment pipeline
   - Environment-based seeding control
   - Docker image versioning for migrations

5. **Error Handling**
   - Database readiness checks
   - Transaction support in migration scripts
   - Proper error reporting and logging

### Cons ⚠️

1. **Complexity Increase**

   - More Docker stages and containers to manage
   - Additional CI/CD steps and potential failure points
   - Environment variable configuration complexity

2. **Build Time**

   - Multiple Docker images need to be built and pushed
   - Longer CI/CD pipeline execution time
   - Additional Docker Hub storage usage

3. **Debugging Challenges**
   - Migration failures require container log analysis
   - Network connectivity issues between containers
   - Environment variable configuration errors

## Usage Instructions

### Development Environment

#### Automatic Setup (Default)

```bash
# Start with automatic database setup
docker-compose up --build

# Or explicitly enable setup
RUN_DB_SETUP=true docker-compose up --build
```

#### Migration Only

```bash
# Run migrations only, no seeding
RUN_DB_SETUP=false RUN_DB_MIGRATE=true docker-compose up --build
```

#### Manual Database Operations

```bash
# Start migration service for manual operations
docker-compose --profile tools up migration

# Run specific migration commands
docker-compose run --rm migration migrate
docker-compose run --rm migration seed
docker-compose run --rm migration setup
```

#### Skip All Database Operations

```bash
# Start without any database setup
RUN_DB_SETUP=false RUN_DB_MIGRATE=false docker-compose up --build
```

### Production Environment

#### Environment Variables Setup

Add to your production `.env` file:

```bash
# Required database configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=h8_phase2_gc02
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Optional: Enable seeding in production
ENABLE_SEEDING=false  # Set to true to enable seeding
```

#### Manual Migration Commands

```bash
# Run migrations manually in production
docker run --rm \
  --network app_default \
  --env-file .env \
  your-dockerhub-username/h8-phase2-gc02:migration-latest migrate

# Run seeding manually in production
docker run --rm \
  --network app_default \
  --env-file .env \
  your-dockerhub-username/h8-phase2-gc02:migration-latest seed
```

### NPM Scripts Available

```bash
# Migration operations
npm run db:migrate          # Run migrations
npm run db:migrate:undo     # Rollback migrations
npm run db:seed             # Run seeding with clear
npm run db:seed:undo        # Undo seeding
npm run db:setup            # Run migrate + seed
npm run db:sync             # Alias for migrate
```

## Workflow Architecture

```
Development:
PostgreSQL Container → Migration Check → Auto Setup (Optional) → App Container

Production CI/CD:
Build Migration Image → Build App Image → Deploy PostgreSQL → Run Migrations → Run Seeding (Optional) → Deploy App
```

## Environment Variables Reference

### Development

- `RUN_DB_SETUP`: Enable automatic migration + seeding (default: true)
- `RUN_DB_MIGRATE`: Enable migration only (default: false)
- `NODE_ENV`: Development environment (default: development)

### Production

- `ENABLE_SEEDING`: Enable seeding in production (default: false)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`: Database configuration
- All other app configuration via `.env` file

## Troubleshooting Guide

### Common Issues

1. **Database Connection Failed**

   ```bash
   # Check database container status
   docker-compose ps postgres

   # Check database logs
   docker-compose logs postgres

   # Test connection manually
   docker-compose run --rm migration check
   ```

2. **Migration Failures**

   ```bash
   # Check migration container logs
   docker logs h8-phase2-gc02-migration-dev

   # Run migration with verbose output
   docker-compose run --rm migration migrate
   ```

3. **Network Issues**

   ```bash
   # Check network configuration
   docker network ls
   docker network inspect app_default

   # Recreate networks
   docker-compose down
   docker-compose up --build
   ```

4. **Environment Variable Issues**

   ```bash
   # Verify environment variables
   docker-compose config

   # Check container environment
   docker-compose exec app env
   ```

### Performance Optimization

1. **Build Cache**: Use Docker BuildKit for faster builds
2. **Image Layers**: Optimize Dockerfile layer caching
3. **Network**: Use host networking for local development if needed
4. **Volumes**: Use named volumes for better performance

## Security Considerations

1. **Database Credentials**: Use secure passwords and environment variables
2. **Network Isolation**: Keep database internal in production
3. **Image Security**: Regularly update base images
4. **Access Control**: Limit migration container privileges

---

## Git Commit Message

```
feat(database): implement comprehensive migration and seeding workflow

- Add dedicated migration Docker stage for database operations
- Enhance development workflow with configurable auto-setup
- Implement production-safe migration sequence in CI/CD
- Update docker-compose files for better environment management
- Add comprehensive documentation and troubleshooting guide

BREAKING CHANGE: Development containers now auto-run migrations by default.
Set RUN_DB_SETUP=false to disable automatic database setup.
```
