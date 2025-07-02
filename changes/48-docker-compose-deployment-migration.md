# Docker-Compose Deployment Migration

## What Changed

### Modified Files

- `.github/workflows/deploy.yml` - Updated deployment workflow to use docker-compose
- `docker/docker-compose.prod.yml` - Fixed restart policies and image configuration

### Changes Made

**GitHub Actions Workflow (`deploy.yml`):**

- Added new step to copy `docker-compose.prod.yml` file to EC2 server using `appleboy/scp-action`
- Replaced manual `docker run` commands with `docker-compose` commands
- Updated container management to use `docker-compose down` and `docker-compose up -d`
- Added proper environment variable setting for Docker image reference
- Improved health check and logging using docker-compose logs

**Production Docker Compose (`docker-compose.prod.yml`):**

- Changed restart policy from `no` to `unless-stopped` for both services
- Removed build context from app service (now uses pre-built image from registry)
- Updated log volume path to use absolute path (`~/app/logs:/app/logs`)

## Pros and Cons

### Pros

- **Simplified Management**: Single command to manage all services (`docker-compose up/down`)
- **Better Service Dependencies**: Built-in dependency management between postgres and app
- **Network Isolation**: Services communicate through dedicated docker network
- **Consistent Configuration**: Same compose file can be used for different environments
- **Health Checks**: Automatic health checking for postgres service
- **Volume Management**: Proper persistent volume handling for postgres data
- **Easier Troubleshooting**: `docker-compose logs` provides centralized logging
- **Atomic Operations**: Services start/stop together as a unit

### Cons

- **Additional File Transfer**: Need to copy docker-compose.prod.yml to server
- **Environment Variable Complexity**: Need to set DOCKER_IMAGE environment variable
- **Learning Curve**: Team needs to understand docker-compose commands
- **Single Point of Failure**: If compose file is corrupted, entire deployment fails

## Potential Issues & Fix Guide

### Issue 1: SCP Action Permission Errors

**Problem**: `appleboy/scp-action` fails to copy files
**Fix**:

- Ensure EC2 SSH key has proper permissions
- Verify target directory exists on server
- Check SCP action version compatibility

### Issue 2: Environment Variable Not Set

**Problem**: `DOCKER_IMAGE` environment variable not recognized by docker-compose
**Fix**:

```bash
# Add before docker-compose up command
export DOCKER_IMAGE=${{ secrets.DOCKERHUB_USERNAME }}/h8-phase2-gc02:latest
```

### Issue 3: Volume Mount Path Issues

**Problem**: Log volume not mounting correctly
**Fix**:

- Ensure `~/app/logs` directory exists before running docker-compose
- Verify absolute paths in docker-compose.prod.yml

### Issue 4: Network Conflicts

**Problem**: Docker network conflicts with existing containers
**Fix**:

```bash
# Clean up networks before starting
docker network prune -f
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Issue 5: Service Dependencies Timeout

**Problem**: App service starts before postgres is ready
**Fix**:

- Postgres health check is already configured
- Increase `depends_on` wait time if needed
- Monitor postgres logs: `docker-compose logs postgres`

---

**Git Commit Message:**

```
feat(ci/cd): migrate deployment from manual docker to docker-compose

• replace individual docker run commands with docker-compose orchestration
• add SCP step to copy docker-compose.prod.yml to EC2 server
• update restart policies to unless-stopped for production reliability
• implement proper service dependency management with health checks
• simplify container management with atomic up/down operations
• improve logging and troubleshooting with centralized docker-compose logs

BREAKING CHANGE: deployment now requires docker-compose.prod.yml file on server
```
