# Pino Logger Debug Levels Enhancement

## What Was Changed

Enhanced the Pino logger configuration to allow all log levels for better debugging and troubleshooting. Changed default log level from "info" to "debug" and improved production logging configuration.

### Changes Made:

- Changed default log level from "info" to "debug" for comprehensive logging
- Updated production transport to use dynamic log level instead of hardcoded "info"
- Added trace method for even more detailed logging
- Maintained error-level logging for critical issues

## Technical Details

### Problem:

Logger was set to "info" level by default, which filtered out debug and trace level logs that are crucial for troubleshooting container startup issues and application debugging.

### Solution:

- **Default Log Level**: Changed from `"info"` to `"debug"`
- **Production Transport**: Uses dynamic `logLevel` instead of hardcoded `"info"`
- **New Method**: Added `trace()` method for finest level debugging
- **Backwards Compatible**: Still respects `LOG_LEVEL` environment variable

### Log Level Hierarchy:

```
trace < debug < info < warn < error < fatal
```

With `debug` as default, all levels except `trace` are captured automatically.

### Files Updated:

- `src/config/logger.ts` - Enhanced log level configuration and added trace method

## Pros and Cons

### Pros:

- ✅ Captures all important application events for debugging
- ✅ Better troubleshooting capabilities for container issues
- ✅ Production environments can still override with LOG_LEVEL env var
- ✅ Maintains structured logging with proper levels
- ✅ Added trace level for finest debugging granularity

### Cons:

- ⚠️ More verbose logging by default (can be controlled via LOG_LEVEL)
- ⚠️ Slightly larger log files in development

## Usage Examples

```typescript
const logger = Logger.getInstance();

logger.trace("Very detailed debugging info"); // NEW
logger.debug("Debugging information");
logger.info("General information");
logger.warn("Warning messages");
logger.error("Error messages", error);
logger.fatal("Critical errors", error);
```

## Environment Configuration

To control log levels in different environments:

```bash
# Show all logs including trace
LOG_LEVEL=trace

# Default (shows debug and above)
LOG_LEVEL=debug

# Production (minimal logging)
LOG_LEVEL=info

# Errors only
LOG_LEVEL=error
```

---

**Git Commit Message:**

```
feat(config): enhance pino logger with debug levels for troubleshooting

- change default log level from info to debug for comprehensive logging
- update production transport to use dynamic log level configuration
- add trace method for finest level debugging capabilities
- maintain backwards compatibility with LOG_LEVEL environment variable

Improves debugging capabilities for container startup and application issues.
```
