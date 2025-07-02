# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/

# Build the application
RUN npm run build

# Migration stage - for running database operations
FROM node:22-alpine AS migration

WORKDIR /app

# Install postgresql-client for database operations
RUN apk add --no-cache postgresql-client curl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (needed for ts-node and scripts)
RUN npm ci --only=production && npm install --no-save ts-node tsconfig-paths

# Copy scripts and data
COPY scripts/ ./scripts/
COPY data/ ./data/
COPY src/config/ ./src/config/
COPY src/shared/ ./src/shared/

# Create entrypoint script for database operations
RUN cat > /app/db-operations.sh << 'EOF'
#!/bin/sh
set -e

echo "Starting database operations..."

# Wait for database to be ready
echo "Waiting for database connection..."
until npm run db:migrate check 2>/dev/null; do
  echo "Database not ready, waiting 5 seconds..."
  sleep 5
done
echo "Database connection established!"

# Run operations based on command
case "$1" in
  "migrate")
    echo "Running database migrations..."
    npm run db:migrate
    ;;
  "seed")
    echo "Running database seeding..."
    npm run db:seed
    ;;
  "setup")
    echo "Running full database setup..."
    npm run db:setup
    ;;
  *)
    echo "Usage: $0 {migrate|seed|setup}"
    exit 1
    ;;
esac

echo "Database operations completed successfully!"
EOF

RUN chmod +x /app/db-operations.sh

ENTRYPOINT ["/app/db-operations.sh"]

# Development stage
FROM node:22-alpine AS development

WORKDIR /app

# Install curl and postgresql-client for health checks and database operations
RUN apk add --no-cache curl postgresql-client

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY data/ ./data/

# Create logs directory
RUN mkdir -p logs

# Create startup script for development
RUN cat > /app/start-dev.sh << 'EOF'
#!/bin/sh
set -e

echo "Starting development server with database setup..."

# Wait for database to be ready
echo "Waiting for database connection..."
until npm run db:migrate check 2>/dev/null; do
  echo "Database not ready, waiting 5 seconds..."
  sleep 5
done
echo "Database connection established!"

# Check if we should run database setup
if [ "$RUN_DB_SETUP" = "true" ] || [ "$RUN_DB_SETUP" = "1" ]; then
  echo "Running database setup (migrate + seed)..."
  npm run db:setup
  echo "Database setup completed!"
elif [ "$RUN_DB_MIGRATE" = "true" ] || [ "$RUN_DB_MIGRATE" = "1" ]; then
  echo "Running database migrations only..."
  npm run db:migrate
  echo "Database migrations completed!"
fi

echo "Starting development server..."
exec npm run dev
EOF

RUN chmod +x /app/start-dev.sh

# Expose port
EXPOSE 8002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8002/health || exit 1

# Start development server with database setup
CMD ["/app/start-dev.sh"]

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install curl and postgresql-client for health checks and database operations
RUN apk add --no-cache curl postgresql-client

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files for production dependency installation
COPY --chown=nodejs:nodejs package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy scripts for database operations (needed for production migrations)
COPY --chown=nodejs:nodejs scripts/ ./scripts/
COPY --chown=nodejs:nodejs data/ ./data/
COPY --chown=nodejs:nodejs tsconfig.json ./

# Install ts-node and tsconfig-paths for production migration scripts
RUN npm install --no-save ts-node tsconfig-paths

# Create production startup script
RUN cat > /app/start-prod.sh << 'EOF'
#!/bin/sh
set -e

echo "Starting production server..."

# In production, migrations should be handled by CI/CD
# This is just a fallback safety check
if [ "$RUN_DB_MIGRATE" = "true" ] || [ "$RUN_DB_MIGRATE" = "1" ]; then
  echo "Running database migrations..."
  npm run db:migrate
  echo "Database migrations completed!"
fi

echo "Starting application server..."
exec npm start
EOF

RUN chmod +x /app/start-prod.sh && chown nodejs:nodejs /app/start-prod.sh

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8002/health || exit 1

# Start production server
CMD ["/app/start-prod.sh"] 