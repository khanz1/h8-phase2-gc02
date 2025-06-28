# Production Deployment Guide

This guide covers how to deploy the Phase2 Graded Challenge application to production using Docker containers and AWS EC2.

## Overview

The production deployment uses:

- **Docker Hub** for image registry
- **AWS EC2** for hosting
- **GitHub Actions** for CI/CD pipeline
- **PostgreSQL** database container
- **Nginx** reverse proxy (optional)

## Prerequisites

### GitHub Secrets Required

Configure the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

```bash
# Docker Hub Configuration
DOCKERHUB_USERNAME          # Your Docker Hub username
DOCKERHUB_TOKEN            # Docker Hub access token

# AWS EC2 Configuration
EC2_HOST                   # EC2 instance public IP or domain
EC2_USER                   # EC2 username (usually 'ubuntu' or 'ec2-user')
EC2_SSH_KEY               # Private SSH key for EC2 access

# Database Configuration
DB_PASSWORD               # PostgreSQL password

# Application Environment (PROD_ENV_FILE)
PROD_ENV_FILE            # Complete .env file content for production
```

### Example PROD_ENV_FILE Content

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=phase2_challenge
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_minimum_256_bits
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_minimum_256_bits
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=production
PORT=8001
LOG_LEVEL=info
LOG_FILE=true

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Deployment Methods

### 1. Automatic Deployment (GitHub Actions)

**Trigger**: Push to `production` branch

```bash
# Deploy latest changes
git checkout production
git merge main
git push origin production
```

**Manual Trigger**: Use GitHub's workflow dispatch

1. Go to `Actions` tab in GitHub
2. Select "Production Deployment → AWS EC2"
3. Click "Run workflow"
4. Choose deployment mode:
   - `false` - Standard deployment (auto mode)
   - `true` - Force complete rebuild

### 2. Manual Deployment (EC2 Server)

SSH into your EC2 instance and run:

```bash
# Clone or update repository
git clone -b production https://github.com/your-username/your-repo.git
cd your-repo

# Deploy with auto mode (recommended)
./scripts/deploy-prod.sh -i your-username/phase2-graded-challenge:latest

# Deploy with fresh mode (force rebuild)
./scripts/deploy-prod.sh -i your-username/phase2-graded-challenge:latest -m fresh

# Deploy with complete reset
./scripts/deploy-prod.sh -i your-username/phase2-graded-challenge:latest -m complete
```

## Deployment Modes

| Mode       | Migration | Data Handling     | Seeding           | Use Case          |
| ---------- | --------- | ----------------- | ----------------- | ----------------- |
| `auto`     | If needed | Preserve existing | If database empty | Normal deployment |
| `fresh`    | Force run | Preserve existing | Always run        | Force refresh     |
| `complete` | Force run | Drop & recreate   | Always run        | Complete reset    |

## Production Scripts

### `deploy-prod.sh`

Main production deployment script with intelligent database handling.

```bash
# Available options
./scripts/deploy-prod.sh --help

# Examples
./scripts/deploy-prod.sh -i user/app:latest              # Auto deployment
./scripts/deploy-prod.sh -i user/app:latest -m fresh     # Fresh deployment
./scripts/deploy-prod.sh -i user/app:latest -m complete  # Complete reset
./scripts/deploy-prod.sh -i user/app:latest -f           # Force rebuild
```

### `docker-run.sh` (Enhanced for Production)

Enhanced Docker runner that supports production environments.

```bash
# Production examples
./scripts/docker-run.sh --env prod --image user/app:latest
./scripts/docker-run.sh --env prod --migrate true --seed auto --image user/app:latest
./scripts/docker-run.sh --env prod --migrate false --seed false --image user/app:latest
```

## Container Architecture

### Production Containers

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  App Container  │    │ PostgreSQL DB   │
│  (port 80/443)  │───▶│   (port 8001)   │───▶│   (port 5432)   │
│ phase2-nginx-   │    │ phase2-app-prod │    │ phase2-postgres-│
│      prod       │    │                 │    │      prod       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Container Details

- **Application**: `phase2-app-prod`

  - Image: Custom built from Dockerfile
  - Port: 8001 (internal), exposed to host
  - Health check: `/health` endpoint
  - Auto-restart: `unless-stopped`

- **Database**: `phase2-postgres-prod`

  - Image: `postgres:15-alpine`
  - Port: 5432 (internal)
  - Persistent volume: `postgres_data`
  - Auto-restart: `always`

- **Proxy**: `phase2-nginx-prod` (optional)
  - Image: `nginx:alpine`
  - Ports: 80, 443
  - SSL termination support
  - Load balancing

## Database Management

### Initial Setup

The deployment automatically handles:

- Database creation
- Table schema migration
- Initial data seeding
- User setup

### Manual Database Operations

```bash
# Connect to database
docker exec -it phase2-postgres-prod psql -U postgres -d phase2_challenge

# Application shell
docker exec -it phase2-app-prod /bin/sh

# Run migrations manually
docker exec phase2-app-prod npm run db:migrate

# Run seeding manually
docker exec phase2-app-prod npm run db:seed

# Reset database
docker exec phase2-app-prod npm run db:reset:complete
```

## Monitoring & Troubleshooting

### Health Checks

- **Application**: `http://your-server:8001/health`
- **Database**: Automatic PostgreSQL health checks
- **Containers**: `docker ps --filter "name=phase2"`

### Log Access

```bash
# Application logs
docker logs phase2-app-prod -f

# Database logs
docker logs phase2-postgres-prod -f

# All containers
docker-compose -f docker/docker-compose.prod.yml logs -f
```

### Common Issues

1. **Container startup fails**

   ```bash
   docker logs phase2-app-prod --tail 50
   ```

2. **Database connection issues**

   ```bash
   docker exec phase2-app-prod npm run db:check
   ```

3. **Port conflicts**

   ```bash
   sudo lsof -i :8001
   ```

4. **Disk space issues**
   ```bash
   docker system prune -f
   docker volume prune -f
   ```

## Security Considerations

### Environment Variables

- Never commit production secrets to git
- Use GitHub Secrets for CI/CD
- Store sensitive data in EC2 environment files
- Use strong passwords and JWT secrets

### Network Security

- Configure EC2 security groups appropriately
- Use HTTPS in production (configure Nginx SSL)
- Implement proper CORS settings
- Enable rate limiting

### Container Security

- Containers run as non-root users
- Regular security updates via base image updates
- Minimal attack surface with Alpine Linux
- Resource limits configured

## Rollback Procedure

### Automatic Rollback

```bash
# Deploy previous version
./scripts/deploy-prod.sh -i your-username/phase2-graded-challenge:previous-sha

# Or rollback to specific git commit
git checkout <previous-commit>
./scripts/deploy-prod.sh -i your-username/phase2-graded-challenge:latest -m auto
```

### Manual Rollback

```bash
# Stop current containers
docker stop phase2-app-prod
docker rm phase2-app-prod

# Deploy previous image
docker run -d \
  --name phase2-app-prod \
  --restart unless-stopped \
  --env-file .env \
  --link phase2-postgres-prod:postgres \
  -p 8001:8001 \
  your-username/phase2-graded-challenge:previous-version
```

## Performance Optimization

### Resource Limits

Production containers have configured resource limits:

- **App**: 1GB memory limit, 512MB reserved
- **Database**: 512MB memory limit, 256MB reserved

### Image Optimization

- Multi-stage Docker builds reduce image size
- Alpine Linux base images for security and size
- Build cache optimization in CI/CD

### Database Performance

- Connection pooling configured in Sequelize
- Proper indexing in migrations
- Regular database maintenance

## Backup Strategy

### Database Backups

```bash
# Create backup
docker exec phase2-postgres-prod pg_dump -U postgres phase2_challenge > backup-$(date +%Y%m%d).sql

# Restore backup
cat backup-20240101.sql | docker exec -i phase2-postgres-prod psql -U postgres -d phase2_challenge
```

### Application Files

- Container volumes are persistent
- Uploaded files stored in `/app/uploads`
- Log files stored in `/app/logs`
- Consider S3 backup for important files
