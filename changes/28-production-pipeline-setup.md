# 28 - Production Pipeline Setup Implementation

## Overview

Implemented a comprehensive production deployment pipeline leveraging the working `docker:run:fresh` approach for AWS EC2 deployment with GitHub Actions CI/CD.

## Files Created

### New Scripts

- `scripts/deploy-prod.sh` - Dedicated production deployment script with intelligent mode handling
- `docs/production-deployment.md` - Comprehensive production deployment documentation

## Files Updated

### Package Configuration

- `package.json` - Added production deployment scripts
  - `deploy:prod` - Main production deployment command
  - `deploy:prod:help` - Production deployment help

### Docker Configuration

- `scripts/docker-run.sh` - Enhanced with custom image support for production

  - Added `--image` parameter for custom Docker images
  - Added `CUSTOM_IMAGE` environment variable support
  - Updated help documentation

- `docker/docker-compose.prod.yml` - Enhanced for custom image deployment
  - Added `image` field with `CUSTOM_IMAGE` environment variable support
  - Added `SEED_MODE` environment variable for advanced seeding control
  - Maintains backward compatibility with build context

### CI/CD Pipeline

- `.github/workflows/deploy.yml` - Complete production pipeline overhaul
  - Renamed to "Production Deployment → AWS EC2"
  - Added workflow dispatch for manual deployment control
  - Split into separate `build` and `deploy` jobs for better parallelization
  - Added Docker build caching for improved performance
  - Integrated new `deploy-prod.sh` script
  - Added force rebuild option through workflow inputs
  - Enhanced health checks with retry logic
  - Improved error handling and logging

## Implementation Details

### Production Deployment Script (`deploy-prod.sh`)

**Features:**

- **Deployment Modes**: `auto`, `fresh`, `complete` with intelligent database handling
- **Image Management**: Custom Docker image support for registry deployment
- **Force Rebuild**: Option to force complete container rebuild
- **Health Checks**: Comprehensive application health verification with retries
- **Error Handling**: Robust error handling with detailed logging
- **Cleanup**: Automatic cleanup of old Docker images and containers

**Command Structure:**

```bash
./scripts/deploy-prod.sh -i user/app:latest -m auto      # Smart deployment
./scripts/deploy-prod.sh -i user/app:latest -m fresh     # Force fresh setup
./scripts/deploy-prod.sh -i user/app:latest -m complete  # Complete reset
./scripts/deploy-prod.sh -i user/app:latest -f           # Force rebuild
```

### Enhanced Docker Runner (`docker-run.sh`)

**New Features:**

- **Custom Image Support**: `--image` parameter for production deployments
- **Environment Export**: `CUSTOM_IMAGE` environment variable for compose files
- **Production Integration**: Seamless integration with production workflows

### CI/CD Pipeline Enhancements

**Build Job:**

- Node.js 22.x with npm caching for faster builds
- TypeScript type checking and ESLint validation
- Docker Hub authentication and multi-tag image building
- GitHub Actions caching for Docker build optimization

**Deploy Job:**

- Repository cloning/updating on EC2 instance
- Environment configuration management
- Production deployment using `deploy-prod.sh`
- Comprehensive health checking with retry logic
- Container status reporting and cleanup

### Deployment Modes

| Mode       | Migration Behavior | Data Handling          | Seeding Behavior       | Use Case          |
| ---------- | ------------------ | ---------------------- | ---------------------- | ----------------- |
| `auto`     | Run if needed      | Preserve existing      | Seed if database empty | Normal deployment |
| `fresh`    | Force run          | Preserve existing      | Always seed            | Force refresh     |
| `complete` | Force run          | Drop & recreate tables | Always seed            | Complete reset    |

## Production Architecture

### Container Setup

```
GitHub Actions → Docker Hub → EC2 Instance
     ↓              ↓             ↓
   Build Stage   Image Registry  Deploy Stage
     ↓              ↓             ↓
 Type Check +   Store Images   Pull & Deploy
 Lint + Test                      ↓
                               Health Check
```

### Container Network

```
Internet → Nginx Proxy → App Container → PostgreSQL Container
  (80/443)    (8001)         (5432)
```

## Security Enhancements

### GitHub Secrets Integration

- `DOCKERHUB_USERNAME` - Docker Hub authentication
- `DOCKERHUB_TOKEN` - Docker Hub access token
- `EC2_HOST` - EC2 instance connection details
- `EC2_USER` - EC2 username for SSH access
- `EC2_SSH_KEY` - Private SSH key for secure access
- `DB_PASSWORD` - PostgreSQL database password
- `PROD_ENV_FILE` - Complete production environment configuration

### Container Security

- Non-root user execution in containers
- Resource limits and health checks
- Automatic restart policies
- Network isolation between services

## Operational Features

### Deployment Options

**Automatic Deployment:**

- Triggered on push to `production` branch
- Manual trigger via GitHub Actions workflow dispatch
- Configurable force rebuild option

**Manual Deployment:**

- Direct EC2 execution via `deploy-prod.sh`
- Flexible mode selection for different scenarios
- Local development testing support

### Monitoring & Troubleshooting

**Health Checks:**

- Application health endpoint monitoring
- Database connectivity verification
- Container status tracking
- Automatic retry logic with failure reporting

**Logging:**

- Centralized application logs
- Container logs accessible via Docker commands
- Deployment process logging with color-coded output
- Error details with stack traces

### Maintenance Operations

**Database Management:**

- Automatic migration execution
- Intelligent seeding based on database state
- Manual database operation support
- Backup and restore procedures

**Container Management:**

- Graceful container stopping and starting
- Old image cleanup automation
- Resource monitoring and limits
- Volume persistence for data

## Usage Examples

### Development to Production Workflow

```bash
# 1. Develop and test locally
npm run docker:run:fresh

# 2. Commit and push to main
git add .
git commit -m "feat: new feature implementation"
git push origin main

# 3. Deploy to production
git checkout production
git merge main
git push origin production  # Triggers automatic deployment
```

### Manual Production Deployment

```bash
# SSH to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Deploy latest version
./scripts/deploy-prod.sh -i username/phase2-graded-challenge:latest -m auto

# Force fresh deployment
./scripts/deploy-prod.sh -i username/phase2-graded-challenge:latest -m fresh

# Complete database reset
./scripts/deploy-prod.sh -i username/phase2-graded-challenge:latest -m complete
```

### Troubleshooting Commands

```bash
# Check container status
docker ps --filter "name=phase2"

# View application logs
docker logs phase2-app-prod -f

# Access application shell
docker exec -it phase2-app-prod /bin/sh

# Check database connectivity
docker exec phase2-app-prod npm run db:check

# Manual health check
curl http://localhost:8001/health
```

## Performance Optimizations

### Build Performance

- Docker build caching in GitHub Actions
- Multi-stage Docker builds for smaller images
- npm package caching for faster installs
- Parallel job execution in CI/CD pipeline

### Runtime Performance

- Container resource limits and reservations
- Health check optimization
- Volume mounting for persistent data
- Network optimization for container communication

### Deployment Performance

- Intelligent migration and seeding logic
- Graceful container stop/start procedures
- Old image cleanup automation
- Minimal downtime deployment strategy

## Technical Specifications

### Environment Requirements

- **Node.js**: 18+ (Alpine Linux base)
- **PostgreSQL**: 15 Alpine
- **Docker**: Latest stable version
- **Nginx**: Alpine (optional reverse proxy)

### Resource Allocation

- **Application Container**: 1GB memory limit, 512MB reserved
- **Database Container**: 512MB memory limit, 256MB reserved
- **Network**: Bridge network for container communication

### Storage Configuration

- **Database**: Persistent volume for PostgreSQL data
- **Application Logs**: Volume mount to host filesystem
- **Uploads**: Volume mount for file storage persistence

## Git Commit Message

```
feat(deploy): implement comprehensive production pipeline

• create deploy-prod.sh with intelligent deployment modes
• enhance docker-run.sh with custom image support
• upgrade CI/CD pipeline with parallel build/deploy jobs
• add production deployment documentation
• implement health checks with retry logic
• add workflow dispatch for manual deployment control
• optimize Docker build caching and performance
• enhance security with proper secrets management
```

## Next Steps

1. **Configure GitHub Secrets** - Set up all required secrets in repository settings
2. **EC2 Instance Setup** - Prepare EC2 instance with Docker and necessary permissions
3. **Domain Configuration** - Set up domain and SSL certificates for production
4. **Monitoring Setup** - Implement application and infrastructure monitoring
5. **Backup Strategy** - Set up automated database and file backups
6. **Testing** - Verify deployment pipeline with test deployments
