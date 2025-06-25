# 14 - Helpers and Authentication Improvements

## Overview

Created bcrypt and JWT helper utilities, updated authentication system to use helpers, changed register to add-user with admin authorization, and implemented comprehensive authentication and authorization middleware.

## Files Created

- `src/shared/utils/bcrypt.helper.ts` - Bcrypt utility for password hashing and comparison
- `src/shared/utils/jwt.helper.ts` - JWT utility for token generation and verification
- `src/shared/middleware/auth.middleware.ts` - Authentication middleware for token verification
- `src/shared/middleware/authorization.middleware.ts` - Authorization middleware for role-based access

## Files Updated

- `src/features/users/user.model.ts` - Updated to use BcryptHelper
- `src/features/auth/auth.service.ts` - Updated to use JwtHelper and changed register to addUser
- `src/features/auth/auth.controller.ts` - Updated register to addUser method
- `src/features/auth/auth.routes.ts` - Updated routes with authentication and authorization
- `src/features/auth/auth.types.ts` - Added refreshToken to AuthServiceResponse
- `scripts/seeder.ts` - Updated to use BcryptHelper for password hashing
- `env.example` - Added JWT refresh token configuration

## Implementation Details

### Bcrypt Helper Features

- **Password Hashing**: Static method with configurable salt rounds (default: 12)
- **Password Comparison**: Secure comparison with error handling
- **Password Validation**: Strength validation with custom rules
- **Error Handling**: Comprehensive logging and error management
- **Salt Rounds**: Configurable salt rounds for different security levels

### JWT Helper Features

- **Access Tokens**: Short-lived tokens (15 minutes default)
- **Refresh Tokens**: Long-lived tokens (7 days default)
- **Token Pair Generation**: Generate both access and refresh tokens
- **Token Verification**: Verify both token types with proper error handling
- **Header Extraction**: Extract Bearer tokens from Authorization headers
- **Environment Configuration**: Support for separate secrets and expiration times

### Authentication Middleware

- **Token Verification**: Verifies JWT access tokens
- **User Attachment**: Attaches decoded user to request object
- **Optional Authentication**: Middleware that doesn't fail if no token provided
- **Comprehensive Logging**: Debug logs for authentication flow
- **Error Propagation**: Proper error handling and forwarding

### Authorization Middleware

- **Role-Based Access**: Check for specific roles (Admin, Staff, User)
- **Admin Only**: Dedicated middleware for admin-only routes
- **Admin or Staff**: Middleware for staff-level access
- **Ownership Validation**: Check if user owns resource or is admin
- **Detailed Logging**: Log authorization attempts and failures

### Authentication System Changes

- **Register → Add User**: Changed from public registration to admin-only user creation
- **Token Pairs**: Login and add-user now return both access and refresh tokens
- **Protected Routes**: `/me` endpoint now requires authentication
- **Admin Routes**: `/add-user` endpoint requires admin role
- **Refresh Tokens**: Proper refresh token handling with body-based tokens

### Security Improvements

- **Shorter Access Tokens**: 15-minute expiration for better security
- **Separate Refresh Secret**: Different secret for refresh tokens
- **Password Pre-hashing**: Seeder hashes passwords before bulk create
- **Role-based Authorization**: Comprehensive role checking system
- **Request User Type**: TypeScript interface extension for user in requests

### Model and Service Updates

- **User Model Hooks**: Updated to use BcryptHelper for password hashing
- **Service Token Generation**: Updated to use JwtHelper methods
- **Error Handling**: Improved error handling throughout auth flow
- **Type Safety**: Better TypeScript types for JWT payloads

### Environment Configuration

- **JWT_SECRET**: Main JWT signing secret
- **JWT_REFRESH_SECRET**: Separate secret for refresh tokens
- **JWT_EXPIRES_IN**: Access token expiration (15m)
- **JWT_REFRESH_EXPIRES_IN**: Refresh token expiration (7d)

## API Changes

### Endpoints

- ❌ `POST /api/auth/register` - Removed public registration
- ✅ `POST /api/auth/add-user` - Admin-only user creation
- ✅ `POST /api/auth/login` - Login with token pair
- ✅ `POST /api/auth/refresh` - Refresh tokens
- ✅ `GET /api/auth/me` - Protected user info

### Request/Response Changes

- **Login Response**: Now includes `refreshToken`
- **Add User Response**: Includes both tokens
- **Refresh Request**: Uses `refreshToken` in body instead of Authorization header
- **Refresh Response**: Returns new token pair

## Security Compliance

- **OWASP Guidelines**: Follows secure token handling practices
- **Short-lived Tokens**: Reduces token exposure window
- **Role Separation**: Clear separation between different access levels
- **Password Security**: Secure hashing with configurable rounds
- **Error Handling**: No information leakage in error messages

## Git Commit Message

```
feat(auth): implement helpers and improve authentication system

• create BcryptHelper for secure password operations
• create JwtHelper for comprehensive token management
• implement authentication middleware for token verification
• implement authorization middleware for role-based access
• change register to add-user with admin-only access
• add refresh token support with separate secrets
• update all auth components to use helper utilities
• implement token pairs for better security
• add comprehensive error handling and logging
• update environment configuration for token management

BREAKING CHANGE: removed public registration, now requires admin to add users
BREAKING CHANGE: authentication now uses short-lived access tokens with refresh tokens
```
