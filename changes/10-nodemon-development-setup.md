# 10 - Nodemon Development Setup

## Overview

Switched from ts-node-dev to nodemon for better development experience and fixed authentication model initialization issues.

## Files Created

- `nodemon.json` - Nodemon configuration file for TypeScript development

## Files Updated

- `package.json` - Updated dev script to use nodemon, added nodemon dependency
- `src/features/auth/auth.model.ts` - Fixed model initialization to follow project pattern

## Implementation Details

### Nodemon Configuration

- Watch TypeScript files in `src` directory
- Auto-restart on changes to `.ts`, `.js`, `.json` files
- Ignore test files and node_modules
- 1-second delay to prevent rapid restarts
- Set NODE_ENV to development

### Package.json Changes

- Added nodemon as dev dependency
- Updated `dev` script to use nodemon
- Kept old script as `dev:old` for fallback

### Auth Model Fixes

- Restructured User model to use `initialize()` method pattern
- Added `associate()` method for future associations
- Fixed sequelize instance access through initialization parameter
- Follows same pattern as other models in the project

### Development Benefits

- Faster restarts compared to ts-node-dev
- Better file watching
- More configurable through nodemon.json
- Cleaner development workflow

## Commands

```bash
# Start development server with nodemon
npm run dev

# Alternative: use old ts-node-dev setup
npm run dev:old
```

## Configuration Files

### nodemon.json

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts", "node_modules"],
  "exec": "ts-node -r tsconfig-paths/register src/server.ts",
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000"
}
```

## Git Commit Message

```
feat(dev): switch to nodemon for development workflow

• replace ts-node-dev with nodemon for better dev experience
• add nodemon.json configuration for TypeScript watching
• fix auth model initialization to follow project pattern
• add static initialize() and associate() methods to User model
• improve development server restart speed and reliability
• maintain backward compatibility with dev:old script
```
