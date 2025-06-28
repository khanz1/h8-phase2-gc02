# 30 - Docker Postgres Configuration Update

## What have been changed, fixed or added

### 🐳 Docker Postgres Configuration Updated

**Files Updated:**

- `docker/docker-compose.yml` - Development configuration
- `docker/docker-compose.prod.yml` - Production configuration
- `env.example` - Environment template
- `.github/workflows/deploy.yml` - CI/CD deployment script

**Database Settings Changed:**

- **Database Name**: `phase2_challenge` → `h8_phase2_gc02`
- **Password**: `password` → `postgres` (for consistency)
- **Username**: `postgres` (unchanged)
- **Port**: `5432` (unchanged)

### 🎯 Configuration Details

**Development (docker-compose.yml):**

```yaml
postgres:
  environment:
    POSTGRES_DB: h8_phase2_gc02
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  ports:
    - "5432:5432" # Available on localhost:5432
```

**Production (docker-compose.prod.yml):**

```yaml
postgres:
  environment:
    POSTGRES_DB: ${DB_NAME:-h8_phase2_gc02}
    POSTGRES_USER: ${DB_USERNAME:-postgres}
    POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
  ports:
    - "5432:5432"
```

## Setup Instructions

### 🚀 Quick Start

1. **Create your environment file:**

```bash
cp env.example .env
```

2. **Start development environment:**

```bash
npm run docker:dev
```

3. **Setup database (manual):**

```bash
# Sync schema with models
npm run db:sync

# Add seed data (optional)
npm run db:seed
```

### 📊 Connection Details

**From Host Machine (localhost):**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=h8_phase2_gc02
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

**From Docker Container:**

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=h8_phase2_gc02
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### 🔧 Available Commands

```bash
# Docker Operations
npm run docker:dev              # Start development containers
npm run docker:dev:detached     # Start in background
npm run docker:dev:down         # Stop containers
npm run docker:dev:logs         # View logs

# Database Operations (manual)
npm run db:sync                 # Sync schema (non-destructive)
npm run db:migrate              # Run new migrations
npm run db:seed                 # Add seed data
npm run db:setup                # Full setup (migrate + seed)

# Production
npm run docker:prod             # Start production containers
```

## Pros and Cons

### ✅ Pros

- **Consistent naming**: Database name matches project structure
- **Standard credentials**: Using common postgres/postgres for development
- **Host accessibility**: Database available on localhost:5432
- **Environment flexibility**: Production uses environment variables
- **Manual control**: All database operations remain manual for safety

### ⚠️ Cons

- **Simple credentials**: Development uses basic postgres/postgres
- **Manual setup**: Database initialization requires manual steps

## Database Access

### 🔗 Connection Options

**Option 1: Direct psql (from host):**

```bash
psql -h localhost -p 5432 -U postgres -d h8_phase2_gc02
```

**Option 2: Docker exec:**

```bash
docker exec -it app-postgres-dev psql -U postgres -d h8_phase2_gc02
```

**Option 3: Database GUI:**

- Host: `localhost`
- Port: `5432`
- Database: `h8_phase2_gc02`
- Username: `postgres`
- Password: `postgres`

### 🗄️ Data Persistence

- **Development**: Data persists in Docker volume `postgres_data`
- **Production**: Data persists in Docker volume `postgres_data`
- **Reset data**: `docker-compose down -v` (removes volumes)

## Production Deployment

### 🌐 Environment Variables

For production, set these in your deployment environment:

```env
DB_NAME=h8_phase2_gc02
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password-here
```

The deployment will use your secure password while falling back to defaults for development.

## Complete Git Commit Message

```
feat: update docker postgres configuration to match project settings

• change database name from phase2_challenge to h8_phase2_gc02
• standardize development password to postgres for consistency
• update docker-compose.yml for development environment
• update docker-compose.prod.yml for production environment
• update env.example with new database settings
• update GitHub Actions deployment script
• maintain manual database control philosophy
• ensure database accessible on localhost:5432 from host

This aligns the Docker postgres configuration with the desired project database settings
while maintaining the manual, non-destructive database operation approach.
```
