# Docker Hub Authentication Issue Resolution

## Summary

Analyzed and provided comprehensive troubleshooting steps for the Docker Hub 401 Unauthorized error that occurs during GitHub Actions CI/CD pipeline when attempting to push Docker images.

## Problem Analysis

The error `failed to fetch oauth token: unexpected status from GET request to https://auth.docker.io/token?scope=repository%3A***%2Fh8-phase2-gc02%3Apull%2Cpush&service=registry.docker.io: 401 Unauthorized` indicates authentication issues with Docker Hub.

## Files Created/Updated

- **Created**: `scripts/verify-docker-auth.sh` - Docker authentication verification script

## Root Causes and Solutions

### 1. Repository Doesn't Exist

**Problem**: Docker Hub repository `{username}/h8-phase2-gc02` doesn't exist.

**Solution**:

1. Visit [Docker Hub](https://hub.docker.com)
2. Click "Create Repository"
3. Repository name: `h8-phase2-gc02` (exactly as in workflow)
4. Choose visibility (public recommended for open source)
5. Click "Create"

### 2. Incorrect Access Token

**Problem**: `DOCKERHUB_TOKEN` secret is wrong, expired, or using password instead of token.

**Solution**:

1. Go to Docker Hub → Settings → Security
2. Click "New Access Token"
3. Name: `GitHub Actions` (or similar)
4. Permissions: Select "Read, Write, Delete" or minimum "Read, Write"
5. Copy the generated token
6. Update GitHub repository secret `DOCKERHUB_TOKEN`

### 3. Username Mismatch

**Problem**: `DOCKERHUB_USERNAME` secret doesn't match actual Docker Hub username.

**Solution**:

1. Check your Docker Hub username (case-sensitive)
2. Update GitHub repository secret `DOCKERHUB_USERNAME`

### 4. Repository Access Permissions

**Problem**: Token doesn't have push permissions to the repository.

**Solution**:

1. Verify token has write permissions
2. If repository is private, ensure token has access
3. For organization repositories, check organization settings

## Verification Steps

### Step 1: Test Local Authentication

```bash
# Run verification script
./scripts/verify-docker-auth.sh

# Test Docker login
docker login

# Enter your Docker Hub username
# Enter your Docker Hub ACCESS TOKEN (not password!)
```

### Step 2: Test Local Build and Push

```bash
# Build test image
docker build -t {your-username}/h8-phase2-gc02:test .

# Push test image
docker push {your-username}/h8-phase2-gc02:test
```

**Replace `{your-username}` with your actual Docker Hub username**

### Step 3: Verify GitHub Secrets

Check GitHub repository secrets:

1. Go to Settings → Secrets and variables → Actions
2. Verify `DOCKERHUB_USERNAME` matches your Docker Hub username exactly
3. Verify `DOCKERHUB_TOKEN` is an access token (not password)
4. Regenerate token if uncertain

### Step 4: Check Repository Settings

1. Repository name: Must be exactly `h8-phase2-gc02`
2. Repository visibility: Public or private with proper token access
3. Repository namespace: Must match `DOCKERHUB_USERNAME`

## GitHub Actions Workflow Configuration

The workflow is correctly configured:

```yaml
# 5) Log in to Docker Hub
- name: Docker Hub Login
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

# 6) Build & push the Docker image
- name: Build & Push Image
  uses: docker/build-push-action@v5
  with:
    context: .
    file: Dockerfile
    target: production
    push: true
    tags: |
      ${{ secrets.DOCKERHUB_USERNAME }}/h8-phase2-gc02:latest
      ${{ secrets.DOCKERHUB_USERNAME }}/h8-phase2-gc02:${{ github.sha }}
```

## Quick Fix Checklist

- [ ] **Repository exists** on Docker Hub with name `h8-phase2-gc02`
- [ ] **Username secret** matches Docker Hub username exactly
- [ ] **Token secret** is an access token (not password) with write permissions
- [ ] **Local test** succeeds with same credentials
- [ ] **Repository visibility** allows token access

## Common Mistakes to Avoid

1. **Using password instead of token**: GitHub secrets should use Docker Hub access tokens, not passwords
2. **Case sensitivity**: Docker Hub usernames are case-sensitive
3. **Repository naming**: Must match exactly between Docker Hub and GitHub workflow
4. **Token permissions**: Ensure token has at least read/write permissions
5. **Organization repositories**: Check organization-level permissions

## Testing Commands

```bash
# Check current Docker login status
docker system info | grep Username

# Login with credentials
docker login

# Test build
docker build -t test-image .

# Test push (after creating repository)
docker tag test-image {username}/h8-phase2-gc02:test
docker push {username}/h8-phase2-gc02:test
```

## Pros and Cons

### Pros

✅ **Clear diagnosis** - Identified exact authentication failure points  
✅ **Step-by-step resolution** - Comprehensive troubleshooting guide  
✅ **Local testing** - Verification script for pre-flight checks  
✅ **Prevention** - Guidelines to avoid common mistakes  
✅ **Quick reference** - Checklist for rapid issue resolution

### Cons

❌ **Manual intervention** - Requires user to configure Docker Hub manually  
❌ **Secret management** - User must handle sensitive token creation  
❌ **Multi-step process** - Several verification steps needed

## Current Status

✅ **Issue identified** - Docker Hub authentication failure diagnosed  
✅ **Solutions provided** - Multiple resolution paths documented  
✅ **Verification tools** - Local testing script created  
✅ **Documentation** - Comprehensive troubleshooting guide available

## Next Steps

1. **Create Docker Hub repository** if it doesn't exist
2. **Generate new access token** with proper permissions
3. **Update GitHub secrets** with correct credentials
4. **Test locally** using verification script
5. **Retry GitHub Actions** workflow after fixes

## Git Commit Message

```
docs(docker): add comprehensive Docker Hub authentication troubleshooting

• create verification script for local Docker authentication testing
• document common causes of 401 unauthorized errors
• provide step-by-step resolution guide for authentication issues
• add checklist for rapid issue diagnosis and resolution
• include local testing commands for credential verification
• explain difference between access tokens and passwords
• add guidance for repository creation and permissions

Resolves Docker Hub authentication failures in CI/CD pipeline by
providing systematic troubleshooting approach and verification tools.
```
