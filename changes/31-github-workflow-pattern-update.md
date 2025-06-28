# 31 - GitHub Workflow Pattern Update

## What have been changed, fixed or added

### 🔄 GitHub Actions Workflow Updated

**File Updated:**

- `.github/workflows/deploy.yml` - Updated to follow user's reference pattern

**Key Changes:**

- **Structure**: Updated to match user's preferred CI/CD pattern
- **Container naming**: Changed from generic names to `h8-phase2-gc02-*` for clarity
- **Docker image**: Updated to use `h8-phase2-gc02` instead of `phase2-graded-challenge`
- **Database setup**: Adapted PostgreSQL setup for this project (removed Ollama AI components)
- **Better error handling**: Improved container management with detailed logging
- **Environment verification**: Added step to verify environment setup

### 🎯 Workflow Structure

**Updated Steps:**

1. **Checkout code** - Get latest source
2. **Setup Node.js** - Node 22.x with npm caching
3. **Install & Test** - Dependencies, type-check, and linting
4. **Environment Verification** - Check env.example exists
5. **Docker Hub Login** - Authenticate for image push
6. **Build & Push** - Build production image with caching
7. **Deploy to EC2** - SSH deployment with proper container management

### 🐳 Container Management

**Container Names:**

- **Application**: `h8-phase2-gc02-app`
- **Database**: `h8-phase2-gc02-postgres`
- **Docker Image**: `{username}/h8-phase2-gc02:latest`

**Database Setup:**

```bash
# PostgreSQL container with project-specific settings
docker run -d \
  --name h8-phase2-gc02-postgres \
  --restart unless-stopped \
  -e POSTGRES_DB=h8_phase2_gc02 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=${{ secrets.DB_PASSWORD }} \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine
```

**Application Setup:**

```bash
# Application container with database linking
docker run -d \
  --name h8-phase2-gc02-app \
  --restart unless-stopped \
  --env-file ~/app/.env \
  --link h8-phase2-gc02-postgres:postgres \
  -p 8001:8001 \
  -v ~/app/logs:/app/logs \
  {username}/h8-phase2-gc02:latest
```

## Deployment Process

### 🚀 Automated Steps

1. **Code Quality Checks**:

   - Type checking with TypeScript
   - ESLint code linting
   - Environment file verification

2. **Docker Build & Push**:

   - Build production image with multi-stage Dockerfile
   - Push to Docker Hub with latest and SHA tags
   - Use GitHub Actions caching for efficiency

3. **EC2 Deployment**:
   - Create application directory and environment file
   - Pull latest Docker image
   - Stop and remove existing containers (gracefully)
   - Start PostgreSQL database (if not running)
   - Start application with proper linking
   - Health check verification
   - Container status reporting

### 🔧 Error Handling

**Container Management:**

- Graceful stop and removal of existing containers
- Detailed logging for each deployment step
- Health check verification with fallback error reporting
- Container status display for monitoring

**Database Management:**

- Check if PostgreSQL is already running
- Wait for database to be ready before starting app
- Use persistent volumes for data retention

## Environment Configuration

### 🌐 Required Secrets

Set these in your GitHub repository secrets:

```env
# Docker Hub
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token

# AWS EC2
EC2_HOST=your-ec2-public-ip
EC2_USER=ubuntu
EC2_SSH_KEY=your-private-key-content

# Database
DB_PASSWORD=your-secure-db-password

# Production Environment
PROD_ENV_FILE=|
  NODE_ENV=production
  PORT=8001
  DB_HOST=postgres
  DB_PORT=5432
  DB_NAME=h8_phase2_gc02
  DB_USERNAME=postgres
  DB_PASSWORD=your-secure-db-password
  JWT_SECRET=your-jwt-secret
  JWT_REFRESH_SECRET=your-jwt-refresh-secret
  # ... other production environment variables
```

## Pros and Cons

### ✅ Pros

- **Consistent naming**: Clear project-specific container names
- **Better error handling**: Detailed logging and graceful error management
- **Efficient caching**: GitHub Actions caching for faster builds
- **Production ready**: Proper multi-stage build with security considerations
- **Database separation**: Clean separation between app and database containers
- **Health monitoring**: Built-in health checks and status reporting
- **Manual database control**: Maintains philosophy of manual database operations

### ⚠️ Cons

- **Manual database setup**: Database migrations/seeding must be done manually after deployment
- **Single deployment target**: Only supports production branch deployment
- **Container dependency**: Application depends on database container linking

## Usage Instructions

### 🔥 Triggering Deployment

```bash
# Push to production branch triggers deployment
git checkout production
git merge main
git push origin production
```

### 🗄️ Manual Database Setup (After Deployment)

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run database migrations
docker exec h8-phase2-gc02-app npm run db:sync

# Optional: Add seed data
docker exec h8-phase2-gc02-app npm run db:seed
```

### 📊 Monitoring

```bash
# Check container status
docker ps --filter "name=h8-phase2-gc02"

# View application logs
docker logs h8-phase2-gc02-app --tail 50

# View database logs
docker logs h8-phase2-gc02-postgres --tail 50

# Health check
curl http://localhost:8001/health
```

## Complete Git Commit Message

```
feat: update GitHub workflow to follow standardized CI/CD pattern

• restructure workflow steps to match user's reference pattern
• update container names from generic to h8-phase2-gc02-* for clarity
• change Docker image name from phase2-graded-challenge to h8-phase2-gc02
• improve error handling with detailed logging and graceful container management
• add environment verification step for better deployment safety
• adapt PostgreSQL setup for project-specific database configuration
• maintain manual database control philosophy (no auto-migrations)
• add comprehensive health checks and status reporting
• use GitHub Actions caching for improved build performance

This aligns the deployment workflow with the user's preferred pattern while
maintaining the manual, safe database operation approach established earlier.
```
