# Pino Transport Targets and Formatters Compatibility Fix

## What Changed

Fixed a critical production error in the Pino logger configuration where custom level formatters were being used alongside transport targets, which is not allowed by Pino.

### Files Modified

- `src/config/logger.ts` - Removed formatters when using transport.targets in production file logging

### Changes Made

- Removed `formatters.level` configuration when `transport.targets` is used in production with file logging
- Added explanatory comment about the incompatibility
- Kept formatters only for production without file logging and development modes

## Problem Solved

The application was crashing in production with the error:

```
Error: option.transport.targets do not allow custom level formatters
```

This occurred because Pino doesn't allow custom level formatters when using multiple transport targets.

## Pros and Cons

### Pros

- ✅ Fixes production deployment crash
- ✅ Maintains file logging functionality in production
- ✅ Preserves pretty formatting in development
- ✅ Keeps level formatting for production console-only mode

### Cons

- ❌ Level labels in production file logs won't be uppercase when file logging is enabled
- ❌ Less consistent formatting across different production modes

## Remaining Considerations

- Monitor log format consistency across different environments
- Consider alternative approaches for level formatting if needed
- Verify log readability in production file outputs

## Technical Details

Pino's transport system with multiple targets creates a separate process for each transport, which doesn't support custom formatters. The fix ensures compatibility by:

1. Using transport.targets without formatters for production file logging
2. Preserving formatters for single-target scenarios
3. Maintaining development experience with pino-pretty

---

**Git Commit Message:**

```
fix(logger): remove formatters when using pino transport targets

• remove level formatters from production file logging config
• add explanatory comment about pino transport limitations
• maintain formatters for non-transport scenarios
• fix production deployment crash with pino targets
```
