# Morgan Real IP Logging Implementation

## Changes Made

Updated Morgan logging middleware in `src/app.ts` to use the `X-Real-IP` header for accurate client IP logging when behind a reverse proxy (Nginx).

### What was changed:

- **Added custom Morgan token**: Created `real-ip` token that prioritizes IP headers in this order:

  1. `X-Real-IP` header (set by Nginx)
  2. `X-Forwarded-For` header (fallback)
  3. `req.socket.remoteAddress` (direct connection)
  4. `req.ip` (Express fallback)
  5. `'unknown'` (final fallback)

- **Custom production format**: Implemented production-specific log format using the real IP token
- **Maintained development format**: Kept the simple "dev" format for development environment

## Pros and Cons

### Pros:

- ✅ **Accurate IP logging**: Captures real client IP instead of proxy IP
- ✅ **Fallback chain**: Multiple fallback options ensure IP is always captured
- ✅ **Production ready**: Proper format for production environments with reverse proxy
- ✅ **Nginx compatible**: Works seamlessly with standard Nginx proxy configurations
- ✅ **Security**: Better logging for security analysis and rate limiting
- ✅ **Debugging**: Easier troubleshooting with actual client IPs

### Cons:

- ⚠️ **Header dependency**: Relies on Nginx properly setting X-Real-IP header
- ⚠️ **Trust requirement**: Assumes proxy headers are not spoofed (should be configured in Nginx)
- ⚠️ **Format difference**: Production and development logs have different formats

## Potential Issues and Fixes

### Issue 1: Missing X-Real-IP header

- **Symptom**: Logs show proxy IP instead of client IP
- **Fix**: Ensure Nginx configuration includes:
  ```nginx
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  ```

### Issue 2: Header spoofing

- **Symptom**: Unexpected or invalid IPs in logs
- **Fix**: Configure Nginx to only accept real IP from trusted sources:
  ```nginx
  set_real_ip_from 10.0.0.0/8;  # Internal network
  real_ip_header X-Real-IP;
  ```

### Issue 3: IPv6 compatibility

- **Symptom**: IPv6 addresses not properly logged
- **Fix**: Current implementation handles IPv6, but ensure Nginx configuration supports it

## Files Modified

- `src/app.ts` - Updated Morgan logging configuration with custom real IP token

## Git Commit Message

```
feat(logging): implement X-Real-IP support in Morgan logger

• add custom 'real-ip' token with fallback chain
• create production log format using real client IP
• maintain X-Forwarded-For and socket address fallbacks
• ensure accurate IP logging behind Nginx reverse proxy

BREAKING CHANGE: production log format now includes real IP instead of proxy IP
```
