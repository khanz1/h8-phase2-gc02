# Docker Compose Environment Variables Setup

## Overview

Docker Compose can use environment variables from `.env` files to configure services dynamically. This allows you to:

- Keep sensitive data out of version control
- Use different configurations for different environments
- Avoid hardcoding values in docker-compose.yml

## How to Use Environment Variables

### 1. Create Environment Files

Create a `.env` file in the `docker/` directory:

```bash
# Copy the example and modify as needed
cp docker/.env.example docker/.env
```

### 2. Environment Variable Syntax

The docker-compose.yml now uses the following syntax:

- `${VARIABLE_NAME}` - Uses the variable from environment
- `${VARIABLE_NAME:-default_value}` - Uses variable with fallback to default

### 3. Required Environment Variables

Create `docker/.env` with these variables:

```env
# Application
NODE_ENV=development
PORT=8001
APP_NAME=Phase2-Graded-Challenge

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=h8_phase2_gc02
DB_USERNAME=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-dev
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here-dev
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
LOG_FILE=true

# CORS
CORS_ORIGIN=http://localhost:8001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 4. How Docker Compose Loads Environment Variables

Docker Compose automatically loads environment variables in this order:

1. Environment variables set in the shell
2. Environment variables from `.env` file in the same directory as docker-compose.yml
3. Default values specified in docker-compose.yml using `:-` syntax
4. Environment variables defined in the `environment` section

### 5. Running with Environment Variables

```bash
# Navigate to docker directory
cd docker

# Create your .env file
cp .env.example .env

# Edit the .env file with your actual values
nano .env

# Run docker-compose (automatically loads .env)
docker-compose up -d
```

### 6. Production Environment

For production, create a separate `.env.prod` file and specify it explicitly:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

### 7. Security Best Practices

- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Rotate JWT secrets regularly
- Use environment-specific values for each deployment

### 8. Troubleshooting

**Check environment variable substitution:**

```bash
# Show the resolved docker-compose configuration
docker-compose config
```

**Verify environment variables are loaded:**

```bash
# Check what variables Docker Compose sees
docker-compose config | grep -A 20 environment
```

**Debug missing variables:**

- Ensure `.env` file is in the same directory as docker-compose.yml
- Check for typos in variable names
- Verify syntax uses `${VAR_NAME}` format
