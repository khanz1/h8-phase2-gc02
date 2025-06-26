# Docker Setup Guide

This guide explains how to run the Phase2 Graded Challenge application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Development Environment

1. **Start all services (automatic migration and seeding):**

   ```bash
   npm run docker:run
   # or
   npm run docker:dev
   ```

2. **Advanced startup options:**

   ```bash
   # Start with fresh database (force migration and seeding)
   npm run docker:run:fresh

   # Start without any database initialization
   npm run docker:run:no-init

   # View all available options
   npm run docker:run:help
   ```

3. **Access the application:**

   - API: http://localhost:8001
   - Health Check: http://localhost:8001/health

4. **Stop all services:**
   ```bash
   docker-compose -f docker/docker-compose.yml down
   ```

### Production Environment

1. **Create production environment file:**

   ```bash
   cp .env.example .env.prod
   # Edit .env.prod with your production values
   ```

2. **Start production services:**

   ```bash
   npm run docker:run:prod
   # or
   npm run docker:prod
   ```

3. **Access through Nginx:**
   - Application: http://localhost
   - Health Check: http://localhost/health

## Docker Services

### Development (docker-compose.yml)

- **postgres**: PostgreSQL 15 database

  - Port: 5432
  - Database: phase2_challenge
  - Username: postgres
  - Password: password

- **app**: Node.js application in development mode
  - Port: 8001
  - Hot reload enabled
  - Volume mounted for live code changes

### Production (docker-compose.prod.yml)

- **postgres**: PostgreSQL 15 database
- **app**: Node.js application in production mode
- **nginx**: Reverse proxy with SSL termination

## Database Operations

### Automatic Database Initialization

The application now automatically handles database migrations and seeding on startup:

- **Migrations**: Run automatically if tables are missing or if forced
- **Seeding**: Run automatically if database is empty or if forced

### Manual Database Operations

```bash
# Force migration and seeding on next startup
RUN_MIGRATIONS=true RUN_SEEDING=true npm run docker:run

# Run migrations only (no seeding)
RUN_MIGRATIONS=true RUN_SEEDING=false npm run docker:run

# Skip all database initialization
RUN_MIGRATIONS=false RUN_SEEDING=false npm run docker:run
```

### Manual Database Commands (if needed)

```bash
# Inside the running app container
docker exec -it phase2-app-dev npm run db:migrate
docker exec -it phase2-app-dev npm run db:seed

# Database shell access
docker exec -it phase2-postgres-dev psql -U postgres -d phase2_challenge
```

## Useful Commands

### View Logs

```bash
# All services
docker-compose -f docker/docker-compose.yml logs -f

# Specific service
docker-compose -f docker/docker-compose.yml logs -f app
docker-compose -f docker/docker-compose.yml logs -f postgres
```

### Container Management

```bash
# List running containers
docker-compose -f docker/docker-compose.yml ps

# Restart a service
docker-compose -f docker/docker-compose.yml restart app

# Execute commands in container
docker exec -it phase2-app-dev sh
docker exec -it phase2-postgres-dev sh
```

### Cleanup

```bash
# Stop and remove containers
docker-compose -f docker/docker-compose.yml down

# Remove volumes (⚠️ This will delete database data)
docker-compose -f docker/docker-compose.yml down -v

# Remove all unused Docker resources
docker system prune -a
```

## Environment Variables

The application uses the following environment variables in Docker:

### Required

- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: JWT refresh token secret
- `CLOUDINARY_*`: Cloudinary configuration for file uploads

### Optional

- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 8001)
- `LOG_LEVEL`: Logging level (debug/info/warn/error)
- `CORS_ORIGIN`: Allowed CORS origins

## Development Workflow

1. **Make code changes**: Files are live-reloaded in development mode
2. **Database changes**: Run migrations inside the container
3. **Dependencies**: Rebuild the image if you add new dependencies:
   ```bash
   docker-compose -f docker/docker-compose.yml up --build
   ```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify network connectivity: `docker network ls`

### Application Issues

- Check application logs: `docker-compose logs app`
- Verify environment variables: `docker exec -it phase2-app-dev env`
- Restart the application: `docker-compose restart app`

### Port Conflicts

- Change host ports in docker-compose.yml if needed
- Ensure no other services are using ports 8001 or 5432

## SSL Configuration (Production)

To enable SSL in production:

1. Place SSL certificates in `docker/nginx/ssl/`
2. Update `docker/nginx/default.conf` SSL configuration
3. Uncomment SSL-related lines in the Nginx config
