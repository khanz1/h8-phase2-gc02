#!/bin/bash

# Docker Test Script for Phase2 Graded Challenge
# This script tests the Docker setup and services

set -e

echo "🧪 Testing Docker Setup for Phase2 Graded Challenge"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Test 1: Check if Docker is installed
echo "Test 1: Checking Docker installation..."
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version)
    print_status 0 "Docker is installed: $DOCKER_VERSION"
else
    print_status 1 "Docker is not installed"
    exit 1
fi

# Test 2: Check if Docker Compose is installed
echo "Test 2: Checking Docker Compose installation..."
if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_status 0 "Docker Compose is installed: $COMPOSE_VERSION"
else
    print_status 1 "Docker Compose is not installed"
    exit 1
fi

# Test 3: Check if Docker daemon is running
echo "Test 3: Checking Docker daemon..."
if docker info >/dev/null 2>&1; then
    print_status 0 "Docker daemon is running"
else
    print_status 1 "Docker daemon is not running"
    exit 1
fi

# Test 4: Check if required files exist
echo "Test 4: Checking required Docker files..."
FILES=("Dockerfile" "docker/docker-compose.yml" "docker/docker-compose.prod.yml")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "$file exists"
    else
        print_status 1 "$file is missing"
    fi
done

# Test 5: Validate Docker Compose files
echo "Test 5: Validating Docker Compose files..."
if docker-compose -f docker/docker-compose.yml config >/dev/null 2>&1; then
    print_status 0 "Development docker-compose.yml is valid"
else
    print_status 1 "Development docker-compose.yml has errors"
fi

if docker-compose -f docker/docker-compose.prod.yml config >/dev/null 2>&1; then
    print_status 0 "Production docker-compose.prod.yml is valid"
else
    print_status 1 "Production docker-compose.prod.yml has errors"
fi

# Test 6: Check port availability
echo "Test 6: Checking port availability..."
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $1 is already in use"
        return 1
    else
        print_status 0 "Port $1 is available"
        return 0
    fi
}

check_port 8001
check_port 5432
check_port 80

# Test 7: Test Docker build
echo "Test 7: Testing Docker build (this may take a while)..."
if docker build -t phase2-test -f Dockerfile --target development . >/dev/null 2>&1; then
    print_status 0 "Docker build successful"
    # Clean up test image
    docker rmi phase2-test >/dev/null 2>&1
else
    print_status 1 "Docker build failed"
fi

echo ""
echo "🎉 Docker setup test completed!"
echo ""
print_info "To start the development environment, run:"
echo "  npm run docker:dev"
echo ""
print_info "To start the production environment, run:"
echo "  npm run docker:prod"
echo ""
print_info "For more information, see docker/README.md" 