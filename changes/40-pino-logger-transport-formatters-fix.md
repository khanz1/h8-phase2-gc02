# Pino Logger Transport Formatters Fix

## What Was Changed

Fixed the Pino logger configuration error that was preventing the application from starting in production. The issue was caused by attempting to use custom level formatters with transport targets, which is not supported by Pino.

### Changes Made:

- Separated logger configuration for production and development environments
- Removed custom formatters from production configuration when using transport targets
- Kept custom formatters only for development environment with pretty printing
- Maintained proper file logging functionality for production

## Technical Details

### Problem:

The application was failing to start with error:

```
Error: option.transport.targets do not allow custom level formatters
```

This occurred because the logger was trying to use both:

- Custom level formatters (`formatters.level`)
- Transport targets (`transport.targets`)

Pino doesn't support custom formatters when using transport targets because the transports handle their own formatting.

### Solution:

Restructured the logger configuration to:

- **Production**: Use transport targets without custom formatters for file logging
- **Development**: Use custom formatters with pretty printing for console output

### Files Updated:

- `src/config/logger.ts` - Fixed logger configuration for production compatibility

## Pros and Cons

### Pros:

- ✅ Fixes application startup failures in production
- ✅ Maintains proper file logging functionality
- ✅ Preserves development experience with pretty printing
- ✅ Follows Pino best practices for transport usage
- ✅ Ensures compatibility with Docker production environment

### Cons:

- ⚠️ Production logs won't have custom level formatting (but this is standard)
- ⚠️ Slight difference in log format between development and production

## Remaining Issues

None. The application should now start successfully in production with proper logging.

## Testing Verification

To verify the fix works:

```bash
# Build and run in production mode
docker build -t your-app .
docker run -p 8001:8001 -e NODE_ENV=production -e LOG_FILE=true your-app

# Check application starts without logger errors
curl http://localhost:8001/health
```

The application should start without Pino configuration errors.

---

**Git Commit Message:**

```
fix(config): resolve pino logger transport formatters conflict

- separate logger config for production and development
- remove custom formatters from production transport targets
- maintain file logging functionality for production
- preserve pretty printing with formatters for development

Fixes application startup failure due to pino transport targets incompatibility with custom level formatters.
```
