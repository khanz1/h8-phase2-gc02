FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci && npm cache clean --force

COPY src/ ./src/

RUN npm run build

FROM node:22-alpine AS development

WORKDIR /app

RUN apk add --no-cache curl postgresql-client

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./

RUN npm ci

COPY src/ ./src/
COPY scripts/ ./scripts/

RUN mkdir -p logs

EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8002/health || exit 1

CMD ["npm", "run", "dev"]

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache curl postgresql-client

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --chown=nodejs:nodejs package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

COPY --chown=nodejs:nodejs scripts/ ./scripts/
COPY --chown=nodejs:nodejs tsconfig.json ./

RUN mkdir -p logs && chown -R nodejs:nodejs logs

USER nodejs

EXPOSE 8002

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8002/health || exit 1

CMD ["npm", "start"] 