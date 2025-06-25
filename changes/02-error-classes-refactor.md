---
description:
globs:
alwaysApply: false
---
# Error Classes Refactoring - Individual Inheritance

## What Was Done

Refactored error handling to use individual error classes that inherit from AppError instead of static factory methods.

## Files Created/Updated

### New Error Classes
- `src/shared/errors/BadRequestError.ts` - 400 Bad Request error
- `src/shared/errors/UnauthorizedError.ts` - 401 Unauthorized error  
- `src/shared/errors/ForbiddenError.ts` - 403 Forbidden error
- `src/shared/errors/NotFoundError.ts` - 404 Not Found error
- `src/shared/errors/ConflictError.ts` - 409 Conflict error
- `src/shared/errors/UnprocessableEntityError.ts` - 422 Unprocessable Entity error
- `src/shared/errors/InternalServerError.ts` - 500 Internal Server error
- `src/shared/errors/index.ts` - Barrel export for all error classes

### Updated Files
- `src/shared/errors/AppError.ts` - Removed static factory methods
- `src/shared/middleware/errorHandler.ts` - Updated import path

## Technical Implementation

### OOP Inheritance Pattern
- Each error type is now a separate class inheriting from AppError
- Proper constructor chaining with super() calls
- Each class sets appropriate statusCode and error name
- Default messages provided where appropriate

### Code Example
```typescript
// Before (factory methods)
throw AppError.notFound('User not found');

// After (inheritance)
throw new NotFoundError('User not found');
```

### Import Structure
```typescript
// Single import for all error types
import { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError 
} from '@/shared/errors';
```

### Benefits
- Better OOP design with proper inheritance
- Each error type is self-contained
- Easier to extend with specific error behaviors
- Cleaner separation of concerns
- Type safety for specific error instances

## Git Commit Message

```
refactor(errors): implement inheritance-based error classes

• create individual error classes inheriting from AppError
• remove static factory methods from AppError base class
• add BadRequestError, UnauthorizedError, ForbiddenError classes
• add NotFoundError, ConflictError, UnprocessableEntityError classes
• add InternalServerError class with proper inheritance
• create barrel export index for clean imports
• update error handler to use new import structure
```

## Next Steps

1. Update any existing code using old factory methods
2. Implement error classes in authentication module
3. Add validation error handling for Zod schemas
4. Create custom business logic error classes as needed
