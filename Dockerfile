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
RUN echo '#!/bin/sh' > /app/db-operations.sh && \
    echo 'set -e' >> /app/db-operations.sh && \
    echo '' >> /app/db-operations.sh && \
    echo 'echo "Starting database operations..."' >> /app/db-operations.sh && \
    echo '' >> /app/db-operations.sh && \
    echo '# Wait for database to be ready' >> /app/db-operations.sh && \
    echo 'echo "Waiting for database connection..."' >> /app/db-operations.sh && \
    echo 'until npm run db:migrate check 2>/dev/null; do' >> /app/db-operations.sh && \
    echo '  echo "Database not ready, waiting 5 seconds..."' >> /app/db-operations.sh && \
    echo '  sleep 5' >> /app/db-operations.sh && \
    echo 'done' >> /app/db-operations.sh && \
    echo 'echo "Database connection established!"' >> /app/db-operations.sh && \
    echo '' >> /app/db-operations.sh && \
    echo '# Run operations based on command' >> /app/db-operations.sh && \
    echo 'case "$1" in' >> /app/db-operations.sh && \
    echo '  "migrate")' >> /app/db-operations.sh && \
    echo '    echo "Running database migrations..."' >> /app/db-operations.sh && \
    echo '    npm run db:migrate' >> /app/db-operations.sh && \
    echo '    ;;' >> /app/db-operations.sh && \
    echo '  "seed")' >> /app/db-operations.sh && \
    echo '    echo "Running database seeding..."' >> /app/db-operations.sh && \
    echo '    npm run db:seed' >> /app/db-operations.sh && \
    echo '    ;;' >> /app/db-operations.sh && \
    echo '  "setup")' >> /app/db-operations.sh && \
    echo '    echo "Running full database setup..."' >> /app/db-operations.sh && \
    echo '    npm run db:setup' >> /app/db-operations.sh && \
    echo '    ;;' >> /app/db-operations.sh && \
    echo '  *)' >> /app/db-operations.sh && \
    echo '    echo "Usage: $0 {migrate|seed|setup}"' >> /app/db-operations.sh && \
    echo '    exit 1' >> /app/db-operations.sh && \
    echo '    ;;' >> /app/db-operations.sh && \
    echo 'esac' >> /app/db-operations.sh && \
    echo '' >> /app/db-operations.sh && \
    echo 'echo "Database operations completed successfully!"' >> /app/db-operations.sh

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
RUN echo '#!/bin/sh' > /app/start-dev.sh && \
    echo 'set -e' >> /app/start-dev.sh && \
    echo '' >> /app/start-dev.sh && \
    echo 'echo "Starting development server with database setup..."' >> /app/start-dev.sh && \
    echo '' >> /app/start-dev.sh && \
    echo '# Wait for database to be ready' >> /app/start-dev.sh && \
    echo 'echo "Waiting for database connection..."' >> /app/start-dev.sh && \
    echo 'until npm run db:migrate check 2>/dev/null; do' >> /app/start-dev.sh && \
    echo '  echo "Database not ready, waiting 5 seconds..."' >> /app/start-dev.sh && \
    echo '  sleep 5' >> /app/start-dev.sh && \
    echo 'done' >> /app/start-dev.sh && \
    echo 'echo "Database connection established!"' >> /app/start-dev.sh && \
    echo '' >> /app/start-dev.sh && \
    echo '# Check if we should run database setup' >> /app/start-dev.sh && \
    echo 'if [ "$RUN_DB_SETUP" = "true" ] || [ "$RUN_DB_SETUP" = "1" ]; then' >> /app/start-dev.sh && \
    echo '  echo "Running database setup (migrate + seed)..."' >> /app/start-dev.sh && \
    echo '  npm run db:setup' >> /app/start-dev.sh && \
    echo '  echo "Database setup completed!"' >> /app/start-dev.sh && \
    echo 'elif [ "$RUN_DB_MIGRATE" = "true" ] || [ "$RUN_DB_MIGRATE" = "1" ]; then' >> /app/start-dev.sh && \
    echo '  echo "Running database migrations only..."' >> /app/start-dev.sh && \
    echo '  npm run db:migrate' >> /app/start-dev.sh && \
    echo '  echo "Database migrations completed!"' >> /app/start-dev.sh && \
    echo 'fi' >> /app/start-dev.sh && \
    echo '' >> /app/start-dev.sh && \
    echo 'echo "Starting development server..."' >> /app/start-dev.sh && \
    echo 'exec npm run dev' >> /app/start-dev.sh

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
RUN echo '#!/bin/sh' > /app/start-prod.sh && \
    echo 'set -e' >> /app/start-prod.sh && \
    echo '' >> /app/start-prod.sh && \
    echo 'echo "Starting production server..."' >> /app/start-prod.sh && \
    echo '' >> /app/start-prod.sh && \
    echo '# In production, migrations should be handled by CI/CD' >> /app/start-prod.sh && \
    echo '# This is just a fallback safety check' >> /app/start-prod.sh && \
    echo 'if [ "$RUN_DB_MIGRATE" = "true" ] || [ "$RUN_DB_MIGRATE" = "1" ]; then' >> /app/start-prod.sh && \
    echo '  echo "Running database migrations..."' >> /app/start-prod.sh && \
    echo '  npm run db:migrate' >> /app/start-prod.sh && \
    echo '  echo "Database migrations completed!"' >> /app/start-prod.sh && \
    echo 'fi' >> /app/start-prod.sh && \
    echo '' >> /app/start-prod.sh && \
    echo 'echo "Starting application server..."' >> /app/start-prod.sh && \
    echo 'exec npm start' >> /app/start-prod.sh

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