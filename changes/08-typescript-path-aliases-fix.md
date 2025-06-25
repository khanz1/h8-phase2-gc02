# 08 - TypeScript Path Aliases Fix

## Overview

Fixed the TypeScript path aliases resolution issue that was preventing the application from finding modules imported with `@/` prefix.

## Problem

The application was failing to start with the error:

```
Error: Cannot find module '@/config/logger'
```

This occurred because the development scripts were not registering the TypeScript path mappings at runtime.

## Solution

Updated all `ts-node` and `ts-node-dev` script commands in `package.json` to include the `tsconfig-paths/register` option, which enables runtime resolution of TypeScript path aliases.

## Changes Made

### Files Updated

- `package.json` - Updated development and database scripts

### Technical Details

1. **Development Script Fix**

   - Updated the `dev` script to include `-r tsconfig-paths/register`
   - This enables `ts-node-dev` to resolve TypeScript path aliases at runtime

2. **Database Scripts Fix**

   - Updated all database-related scripts (`db:migrate`, `db:rollback`, `db:reset`, `db:check`, `db:seed`, `db:seed:clear`, `db:seed:test`)
   - Added `-r tsconfig-paths/register` to each `ts-node` command

3. **Path Alias Configuration**
   - Confirmed that `tsconfig.json` already has proper path mappings configured:
     - `@/*`: Maps to `src/*`
     - `@/config/*`: Maps to `src/config/*`
     - `@/features/*`: Maps to `src/features/*`
     - `@/shared/*`: Maps to `src/shared/*`
     - `@/database/*`: Maps to `src/database/*`

## Script Changes

### Before

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "db:migrate": "ts-node scripts/migration-runner.ts migrate",
  "db:rollback": "ts-node scripts/migration-runner.ts rollback"
}
```

### After

```json
{
  "dev": "ts-node-dev --respawn --transpile-only -r tsconfig-paths/register src/server.ts",
  "db:migrate": "ts-node -r tsconfig-paths/register scripts/migration-runner.ts migrate",
  "db:rollback": "ts-node -r tsconfig-paths/register scripts/migration-runner.ts rollback"
}
```

## Verification

- The development server now starts successfully without module resolution errors
- All imports using `@/` prefix are properly resolved
- The logger and other configured modules can be imported using clean path aliases

## Git Commit Message

```
fix(config): resolve typescript path aliases in development scripts

• add tsconfig-paths/register to ts-node-dev command
• update all database scripts to include path resolution
• enable runtime resolution of @ path aliases
• fix cannot find module '@/config/logger' error
```
