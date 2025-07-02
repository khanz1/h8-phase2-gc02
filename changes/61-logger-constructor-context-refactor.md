# Logger Constructor Context Refactor

## What Changed

- **Refactored Logger class** to support constructor-based instantiation with context names
- **Replaced singleton pattern** with Pino child logger approach for better context tracking
- **Maintained backward compatibility** by keeping `getInstance()` method
- **Updated key service files** to use new constructor pattern with class names as context

## Technical Implementation

### Core Changes

1. **Logger Class Refactor**:

   - Removed singleton pattern (`private static instance`)
   - Added `private static baseLogger` to store single Pino instance
   - Created `createBaseLogger()` method to initialize Pino once
   - Added constructor parameter `context?: string` for context names
   - Used Pino's `child()` method to create context-specific loggers

2. **Pino Child Logger Approach**:
   - Single base Pino instance shared across all loggers
   - Child loggers add context information without re-instantiating Pino
   - More efficient than creating multiple Pino instances
   - Context appears in log output for better traceability

### Usage Pattern

**Before (Singleton)**:

```typescript
private readonly logger = Logger.getInstance();
```

**After (Constructor with Context)**:

```typescript
private readonly logger = new Logger(AuthService.name);
```

**Process Events**:

```typescript
const processLogger = new Logger("Process");
```

## Pros and Cons

### Pros

- **Better Log Context**: Each class/service has its own context in logs
- **Improved Debugging**: Easy to trace which component generated logs
- **No Performance Impact**: Uses Pino's efficient child logger feature
- **Backward Compatible**: Existing `getInstance()` still works
- **Clean Architecture**: Follows dependency injection principles
- **Type Safety**: Context names are type-safe using class names

### Cons

- **Migration Required**: Need to update all existing logger usages
- **Slightly More Verbose**: Constructor calls instead of static method
- **Context Naming**: Need to choose appropriate context names

## Files Updated

### Core Logger

- `src/config/logger.ts` - Complete refactor with constructor pattern

### Service Files

- `src/features/auth/auth.service.ts` - Updated to use `new Logger(AuthService.name)`
- `src/features/auth/auth.controller.ts` - Updated to use `new Logger(AuthController.name)`
- `src/features/auth/auth.repository.ts` - Updated to use `new Logger(AuthRepository.name)`
- `src/features/blog/blog.controller.ts` - Updated all three controller classes

### Server Files

- `src/server.ts` - Updated Server class and process event handlers

## Log Output Example

**Before**:

```
[12:34:56.789] INFO: User logged in successfully: user@example.com
```

**After**:

```
[12:34:56.789] INFO: [AuthService] User logged in successfully: user@example.com
```

## Migration Guide

### For New Code

Use constructor pattern with class name:

```typescript
export class MyService {
  private readonly logger = new Logger(MyService.name);
}
```

### For Existing Code

Replace `Logger.getInstance()` with `new Logger(ClassName.name)`:

```typescript
// Before
private readonly logger = Logger.getInstance();

// After
private readonly logger = new Logger(MyClass.name);
```

### For Static Methods/Utilities

Use descriptive context names:

```typescript
// For process events
const processLogger = new Logger("Process");

// For utilities
const utilityLogger = new Logger("CloudinaryHelper");
```

## Git Commit Message

```
refactor(logger): implement constructor-based context logging

• replace singleton pattern with Pino child logger approach
• add context parameter to Logger constructor for better traceability
• maintain backward compatibility with getInstance() method
• update auth and blog services to use new pattern
• improve log readability with component context information
```
