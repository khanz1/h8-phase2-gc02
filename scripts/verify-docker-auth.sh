#!/bin/bash

echo "🔍 Docker Hub Authentication Verification Script"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed or not in PATH"
    exit 1
fi

# Check Docker daemon
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    exit 1
fi

echo "✅ Docker is installed and running"

# Get current user info
echo ""
echo "📋 Current Docker Hub login status:"
docker system info | grep -E "Username|Registry"

echo ""
echo "🔧 To test your Docker Hub credentials locally:"
echo "1. Run: docker login"
echo "2. Enter your Docker Hub username"
echo "3. Enter your Docker Hub token (not password!)"
echo ""
echo "🚀 To test image push:"
echo "1. docker build -t {username}/h8-phase2-gc02:test ."
echo "2. docker push {username}/h8-phase2-gc02:test"
echo ""
echo "📝 Replace {username} with your actual Docker Hub username"
echo ""
echo "🔗 Create repository at: https://hub.docker.com/repository/create"
echo "📚 Generate token at: https://hub.docker.com/settings/security" 