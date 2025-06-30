# Dockerfile Development Stage Restoration

## What Was Changed

Added the missing development stage to the Dockerfile that was causing docker-compose build failures. The docker-compose.yml was trying to use `target: development` but only `builder` and `production` stages existed.

### Changes Made:

- Added development stage between builder and production stages
- Configured development stage for nodemon-based development workflow
- Included all necessary dependencies and source code mounting
- Added proper health checks for development environment

## Technical Details

### Problem:

Docker-compose was failing with:

```
target: development
```

But the Dockerfile only had `builder` and `production` stages, causing build failures and container restart loops.

### Solution:

Added complete development stage with:

- Node.js 22 Alpine base image
- curl and postgresql-client installation for health checks
- All dependencies installation (including dev dependencies)
- Source code and scripts copying
- Nodemon startup for development hot reloading

### Files Updated:

- `Dockerfile` - Added development stage for docker-compose compatibility

## Pros and Cons

### Pros:

- ✅ Fixes docker-compose development build failures
- ✅ Enables proper development workflow with nodemon
- ✅ Maintains hot reloading for development
- ✅ Includes all necessary tools for development environment
- ✅ Proper health checks for container monitoring

### Cons:

- ⚠️ Larger development image size due to dev dependencies
- ⚠️ Additional build stage increases build time slightly

## Container Restart Issues

If containers are still restarting, check:

### 1. Production vs Development:

Ensure you're using the correct docker-compose file:

```bash
# For development
docker-compose -f docker/docker-compose.yml up --build

# For production
docker-compose -f docker/docker-compose.prod.yml up --build
```

### 2. Database Connection:

Verify postgres container environment variables match app configuration:

- `DB_HOST`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`

### 3. Environment Variables:

Ensure all required environment variables are set, especially:

- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- Database connection variables
- `NODE_ENV`

### 4. Container Logs:

Check detailed logs for both containers:

```bash
docker logs --tail 50 --follow <container-id>
```

## Testing Verification

To verify the fix works:

```bash
# Clean rebuild
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up --build

# Check container status
docker ps -a

# Check application health
curl http://localhost:8001/health
```

---

**Git Commit Message:**

```
fix(docker): restore missing development stage in dockerfile

- add development stage between builder and production stages
- configure nodemon-based development workflow
- include dev dependencies and source code mounting
- add health checks for development environment

Fixes docker-compose build failures due to missing development target.
```
