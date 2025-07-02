# Docker Compose Files Relocation

## What Changed

### Moved Files

- `docker/docker-compose.yml` → `docker-compose.yml` (root directory)
- `docker/docker-compose.prod.yml` → `docker-compose.prod.yml` (root directory)

### Updated Files

- `.github/workflows/deploy.yml` - Updated file paths to reference root location
- `docker-compose.yml` - Updated relative paths for build context and volumes
- `docker-compose.prod.yml` - No path updates needed (uses absolute paths)

### Changes Made

**Development Docker Compose (`docker-compose.yml`):**

- Changed build context from `context: ..` to `context: .`
- Updated volume mounts:
  - `../src:/app/src:ro` → `./src:/app/src:ro`
  - `../scripts:/app/scripts:ro` → `./scripts:/app/scripts:ro`
  - `../logs:/app/logs` → `./logs:/app/logs`

**GitHub Actions Workflow (`deploy.yml`):**

- Updated SCP source path from `docker/docker-compose.prod.yml` to `docker-compose.prod.yml`
- Updated docker-compose command references:
  - `-f docker/docker-compose.prod.yml` → `-f docker-compose.prod.yml`

**File Cleanup:**

- Deleted old `docker/docker-compose.yml`
- Deleted old `docker/docker-compose.prod.yml`

## Pros and Cons

### Pros

- **Standard Convention**: Docker Compose files at root level follow industry standards
- **Simplified Commands**: Can run `docker-compose up` without `-f` flag for default file
- **Better Project Organization**: Config files at root level are more discoverable
- **IDE Integration**: Better support from IDEs and tools that expect compose files in root
- **Simplified Paths**: No need for `../` relative paths in volume mounts
- **Cleaner Directory Structure**: Reduces nesting and makes project structure flatter

### Cons

- **Breaking Change**: Existing workflows referencing old paths will break
- **Learning Curve**: Team needs to remember new file locations
- **Documentation Updates**: All documentation referencing old paths needs updating
- **Root Directory Clutter**: More files in root directory (though this is standard)

## Potential Issues & Fix Guide

### Issue 1: Old Docker Compose Commands Fail

**Problem**: Commands using old file paths fail
**Fix**:

```bash
# Old command
docker-compose -f docker/docker-compose.yml up

# New command (from root directory)
docker-compose up
# or explicitly
docker-compose -f docker-compose.yml up
```

### Issue 2: Development Environment Setup

**Problem**: Developers need to update their local workflows
**Fix**:

- Update README.md with new commands
- Update development documentation
- Inform team about the change

### Issue 3: CI/CD Pipeline Adjustments

**Problem**: Other CI/CD tools or scripts referencing old paths
**Fix**:

- Search for all references to `docker/docker-compose`
- Update build scripts and deployment documentation
- Check any local development scripts

### Issue 4: Volume Mount Path Issues in Development

**Problem**: Development volume mounts not working
**Fix**:

- Ensure you're running docker-compose from the project root
- Verify relative paths are correct (`./src` instead of `../src`)
- Check file permissions for mounted volumes

### Issue 5: Production Deployment Issues

**Problem**: Production deployment fails due to file not found
**Fix**:

- Verify SCP action successfully copies `docker-compose.prod.yml` to server
- Check file exists in `~/app/docker-compose.prod.yml` on EC2
- Ensure working directory is correct in deployment script

## Migration Instructions

### For Development:

1. Navigate to project root directory
2. Run `docker-compose up` (no need for `-f` flag)
3. All volume mounts and build context now work from root

### For Production:

1. Changes are automatically applied via GitHub Actions
2. Next deployment will use the new file structure
3. No manual intervention required

### For Team Members:

1. Pull latest changes from main branch
2. Update any local scripts referencing old paths
3. Use `docker-compose` commands from project root directory

---

**Git Commit Message:**

```
refactor(docker): relocate compose files from /docker to root directory

• move docker-compose.yml and docker-compose.prod.yml to project root
• update relative paths in development compose file (context, volumes)
• modify GitHub Actions workflow to reference new file locations
• remove old compose files from docker/ directory
• align with industry standard of keeping compose files at root level

BREAKING CHANGE: docker-compose files moved from docker/ to root directory
```
