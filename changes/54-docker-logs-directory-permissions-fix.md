# Docker Logs Directory Permissions Fix

## What Changed

Fixed production deployment error where the application couldn't write to log files due to incorrect permissions on the mounted logs directory.

### Files Modified

- `.github/workflows/deploy.yml` - Added permission fix for logs directory

### Changes Made

- Added `sudo chown -R 1001:1001 ~/app/logs` command in deployment script
- Set proper ownership for logs directory to match nodejs user (UID 1001) in container

## Problem Solved

The application was crashing in production with the error:

```
Uncaught Exception 7 [Error: EACCES: permission denied, open '/app/logs/app-2025-07-02.log']
```

This occurred because:

1. Docker container runs as `nodejs` user (UID 1001)
2. `docker-compose.prod.yml` mounts host directory `~/app/logs` to container `/app/logs`
3. Host directory had default permissions (owned by deployment user)
4. Container user couldn't write to the mounted directory

## Pros and Cons

### Pros

- ✅ Fixes production file logging capability
- ✅ Maintains log persistence on host system
- ✅ Preserves existing volume mount structure
- ✅ Simple one-line fix in deployment script

### Cons

- ❌ Requires sudo access in deployment environment
- ❌ Adds platform-specific permission handling

## Alternative Solutions Considered

1. **Remove volume mount**: Logs would be lost on container restart
2. **Disable file logging**: Would lose production log persistence
3. **Change log directory**: Would require more code changes
4. **Run container as root**: Security risk

## Technical Details

The fix works by:

1. Creating the logs directory on the host: `mkdir -p ~/app/logs`
2. Setting ownership to match container user: `sudo chown -R 1001:1001 ~/app/logs`
3. Container nodejs user (UID 1001) can now write to the mounted directory

The UID 1001 corresponds to the `nodejs` user created in the Dockerfile production stage.

---

**Git Commit Message:**

```
fix(deploy): set proper permissions for logs directory in production

• add chown command for logs directory in deployment script
• set ownership to nodejs user (UID 1001) for container compatibility
• fix EACCES permission denied error for log file creation
• maintain log persistence with proper volume mount permissions
```
