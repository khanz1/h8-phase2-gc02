#!/bin/bash

# Deployment Setup Script for Phase2 Graded Challenge
# This script prepares the environment for deployment

set -e

echo "🚀 Phase2 Graded Challenge - Deployment Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ This script must be run from the project root directory"
    exit 1
fi

print_info "Verifying project structure..."

# Check required files
REQUIRED_FILES=(
    "Dockerfile"
    "package.json" 
    "tsconfig.json"
    "env.example"
    "src/app.ts"
    "src/server.ts"
    "scripts/migrations.sql"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file is missing"
        exit 1
    fi
done

# Check required directories
REQUIRED_DIRS=(
    "src"
    "scripts"
    "docker"
    ".github/workflows"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status 0 "$dir directory exists"
    else
        print_status 1 "$dir directory is missing"
        exit 1
    fi
done

# Verify Docker files
print_info "Verifying Docker configuration..."

if [ -f "docker/docker-compose.yml" ]; then
    print_status 0 "Development Docker Compose file exists"
else
    print_status 1 "Development Docker Compose file missing"
    exit 1
fi

if [ -f "docker/docker-compose.prod.yml" ]; then
    print_status 0 "Production Docker Compose file exists"
else
    print_status 1 "Production Docker Compose file missing"
    exit 1
fi

# Check if TypeScript compiles
print_info "Checking TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
    print_status 0 "TypeScript compilation successful"
else
    print_status 1 "TypeScript compilation failed"
    exit 1
fi

# Check if Docker can build the image
print_info "Testing Docker build..."
if docker build -t phase2-test-build -f Dockerfile --target production . > /dev/null 2>&1; then
    print_status 0 "Docker build successful"
    # Clean up test image
    docker rmi phase2-test-build > /dev/null 2>&1
else
    print_status 1 "Docker build failed"
    exit 1
fi

# Verify environment example
print_info "Checking environment configuration..."
if grep -q "NODE_ENV" env.example && grep -q "PORT" env.example && grep -q "DB_" env.example; then
    print_status 0 "Environment example file has required variables"
else
    print_status 1 "Environment example file missing required variables"
    exit 1
fi

# Check for secrets documentation
print_info "Creating deployment documentation..."
cat << 'EOF' > DEPLOYMENT.md
# Deployment Setup

## Required GitHub Secrets

Set the following secrets in your GitHub repository settings:

### Docker Hub
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

### AWS EC2
- `EC2_HOST`: Your EC2 instance IP address or hostname
- `EC2_USER`: SSH username for EC2 (usually `ubuntu` or `ec2-user`)
- `EC2_SSH_KEY`: Private SSH key for EC2 access

### Database
- `DB_PASSWORD`: Production database password

### Application Environment
- `PROD_ENV_FILE`: Complete production .env file content

## Production Environment Variables

Your `PROD_ENV_FILE` secret should contain:

```
NODE_ENV=production
PORT=8001
APP_NAME=Phase2-Graded-Challenge

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=phase2_challenge
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
LOG_FILE=true

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Deployment Process

1. Push to `production` branch to trigger deployment
2. GitHub Actions will:
   - Run tests and linting
   - Build Docker image
   - Push to Docker Hub
   - Deploy to EC2
   - Run database migrations
   - Verify deployment health

## Manual Deployment Commands

If you need to deploy manually:

```bash
# Build image
docker build -t your-username/phase2-graded-challenge:latest .

# Push to registry
docker push your-username/phase2-graded-challenge:latest

# Deploy on EC2
ssh your-ec2-server
docker pull your-username/phase2-graded-challenge:latest
docker stop phase2-app || true
docker rm phase2-app || true
docker run -d --name phase2-app --restart unless-stopped \
  --env-file ~/app/.env \
  -p 8001:8001 \
  your-username/phase2-graded-challenge:latest
```
EOF

print_status 0 "Deployment documentation created"

# Success message
echo ""
echo "🎉 Deployment setup verification completed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Set up the required GitHub secrets"
echo "  2. Configure your AWS EC2 instance"
echo "  3. Push to the 'production' branch to trigger deployment"
echo ""
print_info "Documentation created: DEPLOYMENT.md" 