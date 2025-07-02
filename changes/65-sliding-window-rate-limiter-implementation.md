# Sliding Window Rate Limiter Implementation

## Changes Made

### What I Changed, Fixed, or Added

**New Rate Limiter Middleware Implementation:**

- Created `src/shared/middleware/rateLimiter.middleware.ts` with sliding window algorithm
- Implemented 5-second window with maximum 10 requests per client
- Used in-memory storage with automatic cleanup every minute
- Client identification based on IP address (supports proxy headers)
- Comprehensive rate limit response format for 429 errors

**Application Integration:**

- Integrated rate limiter middleware in `src/app.ts` to apply to all routes
- Added rate limiter import and middleware usage after morgan logging

**Response Format Updates:**

- Updated `src/shared/utils/response.dto.ts` to support rate limit info in failed responses only
- Maintained clean success responses without rate limit data
- Added RateLimitInfo type for proper typing

**App Service Updates:**

- Updated `src/app.service.ts` to remove rate limit info from successful responses
- Cleaned up health check and app info endpoints

## Technical Implementation Details

### Rate Limiter Features

- **Algorithm:** Sliding window with precise timestamp tracking
- **Window Size:** 5000ms (5 seconds)
- **Request Limit:** 10 requests per window
- **Storage:** In-memory Map with automatic cleanup
- **Client ID:** IP address from headers or socket
- **Headers:** Standard rate limit headers (X-RateLimit-\*)

### Response Format for Rate Limit Exceeded (429)

```json
{
  "success": false,
  "message": "Rate limit exceeded. Too many requests.",
  "rateLimitInfo": {
    "limit": 10,
    "remaining": 0,
    "resetTime": 1703123456789,
    "retryAfter": 3
  },
  "retryAfter": "You can try again at 2023-12-21T10:30:59.789Z (in 3 seconds)"
}
```

### Success Response Format (No Rate Limit Info)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Pros and Cons

### Pros

- **Accurate Rate Limiting:** Sliding window provides precise rate limiting vs fixed window
- **Memory Efficient:** Automatic cleanup prevents memory leaks
- **User Friendly:** Clear retry information with exact timestamps
- **Standards Compliant:** Uses standard HTTP headers and status codes
- **Production Ready:** Handles proxy headers and edge cases
- **Clean Integration:** Minimal impact on existing codebase
- **Type Safe:** Full TypeScript implementation with proper interfaces

### Cons

- **Memory Storage:** Rate limit data lost on server restart
- **Single Server:** No shared state across multiple server instances
- **IP-Based Only:** Limited to IP identification (no user-based limiting)
- **No Persistence:** No database storage for analytics or long-term tracking

## Potential Issues and Fixes

### Issue 1: Memory Usage in High Traffic

**Problem:** Large number of clients could consume significant memory
**Fix:**

- Implement Redis storage for production environments
- Add configurable cleanup intervals and TTL settings
- Monitor memory usage with alerts

### Issue 2: Proxy Configuration

**Problem:** Incorrect IP identification behind proxies
**Fix:**

- Configure proxy headers properly (X-Real-IP, X-Forwarded-For)
- Add whitelist for trusted proxy IPs
- Validate IP address format

### Issue 3: Rate Limit Bypass

**Problem:** Users could potentially bypass limits by changing IPs
**Fix:**

- Implement user-based rate limiting after authentication
- Add fingerprinting based on user agent and other headers
- Use distributed rate limiting with Redis

### Usage Example

```bash
# Test rate limiting with curl
for i in {1..15}; do
  echo "Request $i:"
  curl -w "Status: %{http_code}\n" http://localhost:8002/health
  sleep 0.3
done
```

## Files Created/Updated

### Created:

- `src/shared/middleware/rateLimiter.middleware.ts` - Main rate limiter implementation

### Updated:

- `src/app.ts` - Added rate limiter middleware integration
- `src/shared/utils/response.dto.ts` - Enhanced response format support
- `src/app.service.ts` - Removed rate limit info from successful responses

## Git Commit Message

```
feat(middleware): implement sliding window rate limiter

• add SlidingWindowRateLimiter class with 5-second window and 10 request limit
• integrate rate limiting middleware to all application routes
• implement memory-based storage with automatic cleanup
• add comprehensive 429 response with retry information
• support standard rate limit headers (X-RateLimit-*)
• enhance ResponseDTO to handle rate limit info for failed responses only
• maintain clean success responses without rate limit data
• add proper TypeScript interfaces for rate limit information
```
