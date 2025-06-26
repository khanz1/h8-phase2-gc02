# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/

# Build the application
RUN npm run build

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

# Make initialization script executable
RUN chmod +x scripts/docker-init.sh

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

# Start with initialization script
CMD ["./scripts/docker-init.sh"]

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install curl and postgresql-client for health checks and database operations
RUN apk add --no-cache curl postgresql-client

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./

# Copy scripts for database operations
COPY --chown=nodejs:nodejs scripts/ ./scripts/
COPY --chown=nodejs:nodejs data/ ./data/
COPY --chown=nodejs:nodejs tsconfig.json ./

# Make initialization script executable
RUN chmod +x scripts/docker-init.sh

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8001/health || exit 1

# Start with initialization script
CMD ["./scripts/docker-init.sh"] 