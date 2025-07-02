# Docker PostgreSQL Port Configuration Fix

## What Changed

### Fixed Development Configuration

- **docker-compose.yml**: Changed `DB_PORT` from `5000` to `5432` in app environment
  - **Issue**: App was trying to connect to postgres:5000 (incorrect)
  - **Fix**: App now connects to postgres:5432 (correct internal container port)
- **docker-compose.yml**: Changed PostgreSQL port mapping from `5000:5432` to `5001:5432`
  - **Issue**: Port 5000 already in use by macOS ControlCenter (AirPlay Receiver)
  - **Fix**: Use port 5001 for external database access

### Fixed Production Configuration

- **docker-compose.prod.yml**: Removed PostgreSQL port exposure
  - **Security**: Database no longer accessible from host in production
  - **Networking**: Containers still communicate internally via Docker network

## Technical Details

### Docker Networking Fundamentals

```yaml
# Port mapping: "host_port:container_port"
ports:
  - "5001:5432" # Host port 5001 → Container port 5432
```

### Internal vs External Communication

- **Internal** (container-to-container): Use container port (`postgres:5432`)
- **External** (host-to-container): Use host port (`localhost:5001`)

### Configuration Comparison

```yaml
# BEFORE (Incorrect)
DB_HOST: postgres
DB_PORT: 5000  # ❌ Wrong - this is the host port

# AFTER (Correct)
DB_HOST: postgres
DB_PORT: 5432  # ✅ Correct - internal container port
```

## Port Exposure Strategy

### Development Environment

- **Keep port exposed** (`5001:5432`)
- **Benefits**:
  - Connect with database tools (pgAdmin, DBeaver)
  - Direct debugging access
  - Migration script execution from host
  - Development convenience

### Production Environment

- **Remove port exposure** (no ports section)
- **Benefits**:
  - Enhanced security (database not accessible from outside)
  - Reduced attack surface
  - Follows security best practices
  - Internal communication still works via Docker network

## Pros and Cons

### Pros

- ✅ Fixed container communication (app can now connect to database)
- ✅ Enhanced production security (no external database access)
- ✅ Maintained development convenience (external tools can still connect)
- ✅ Follows Docker best practices for container networking
- ✅ Clear separation between dev and prod configurations

### Cons

- ⚠️ Production database access requires docker exec for debugging
- ⚠️ Need different connection strategies for dev vs prod environments

## Bug Fixes

### Main Issues Resolved

1. **Container Communication Failure**

   - Fixed app connecting to wrong port
   - Now uses correct internal container port

2. **Production Security Exposure**
   - Removed unnecessary database port exposure
   - Maintains internal container communication

### Potential Issues

- None expected - changes follow Docker best practices

## How to Verify Fix

### Development

```bash
# Test container communication
docker-compose up -d
docker-compose logs app | grep "Database connected"

# Test external access
psql -h localhost -p 5001 -U postgres -d h8_phase2_gc02
```

### Production

```bash
# Test container communication
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs app | grep "Database connected"

# Verify no external access (should fail)
psql -h localhost -p 5432 -U postgres -d h8_phase2_gc02
```

---

**Git Commit Message:**

```
fix(docker): correct postgresql port configuration and resolve port conflicts

• fix app DB_PORT from 5000 to 5432 for proper container communication
• change postgres port mapping from 5000:5432 to 5001:5432 (port 5000 in use by macOS ControlCenter)
• remove postgresql port exposure in production for security
• maintain port exposure in development for tooling access
• align with Docker networking best practices

BREAKING CHANGE: production postgresql no longer accessible from host, development postgres now on port 5001
```
