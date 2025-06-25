# Phase2 Graded Challenge - Project Proposal

## Project Overview

A TypeScript-based Express.js application using OOP principles, service repository pattern, and modern development practices with Docker containerization and CI/CD deployment.

## Tech Stack

### Core Technologies

- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Web application framework
- **PostgreSQL v16+** - Primary database
- **Sequelize** - ORM (not sequelize-typescript)
- **Zod** - Schema validation
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **pg** - PostgreSQL driver

### Development & Infrastructure

- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy for production
- **AWS EC2** - Production hosting
- **Pino** - Structured logging
- **Morgan** - HTTP request logging

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Database configuration
│   ├── logger.ts     # Logger configuration
│   └── env.ts        # Environment variables
├── features/         # Feature-based modules
│   ├── auth/         # Authentication feature
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.model.ts
│   │   ├── auth.types.ts
│   │   └── auth.routes.ts
│   └── users/        # User management feature
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.repository.ts
│       ├── user.model.ts
│       ├── user.types.ts
│       └── user.routes.ts
├── shared/           # Shared utilities
│   ├── middleware/   # Express middlewares
│   ├── utils/        # Utility functions
│   ├── errors/       # Error handling
│   └── types/        # Global types only
├── database/         # Database related
│   ├── migrations/   # Database migrations
│   ├── seeders/      # Database seeders
│   └── models/       # Sequelize model exports
├── app.ts           # Express app setup
└── server.ts        # Server entry point

docker/
├── Dockerfile
├── docker-compose.yml
└── nginx/
    └── default.conf

scripts/
├── migrate.ts       # Database migration script
├── seed.ts          # Database seeding script
├── dev.ts           # Development server
└── build.ts         # Production build

.github/
└── workflows/
    └── deploy.yml   # GitHub Actions CI/CD

logs/                # Daily log files
├── app-YYYY-MM-DD.log
└── error-YYYY-MM-DD.log
```

## Scripts & Commands

### Development Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database (drop, create, migrate, seed)

# Docker
npm run docker:dev   # Start development with Docker
npm run docker:prod  # Start production with Docker

# Linting & Testing
npm run lint         # ESLint code checking
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

### Migration Script (`scripts/migrate.ts`)

- Handles database schema migrations
- Supports rollback functionality
- Environment-specific configurations

### Seeding Script (`scripts/seed.ts`)

- Populates database with initial data
- Creates admin users and sample data
- Environment-aware seeding

## Library Dependencies

### Production Dependencies

```json
{
  "express": "^4.18.2",
  "sequelize": "^6.35.0",
  "pg": "^8.11.3",
  "zod": "^3.22.4",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "pino": "^8.16.0",
  "pino-pretty": "^10.2.3",
  "morgan": "^1.10.0",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "dotenv": "^16.3.1"
}
```

### Development Dependencies

```json
{
  "typescript": "^5.2.2",
  "@types/express": "^4.17.21",
  "@types/node": "^20.8.0",
  "@types/bcrypt": "^5.0.2",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/morgan": "^1.9.9",
  "ts-node": "^10.9.1",
  "ts-node-dev": "^2.0.0",
  "eslint": "^8.52.0",
  "@typescript-eslint/eslint-plugin": "^6.9.0",
  "@typescript-eslint/parser": "^6.9.0"
}
```

## Architecture Patterns

### Service Repository Pattern

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic implementation
- **Repositories**: Data access layer
- **Models**: Sequelize ORM models
- **Types**: Feature-specific type definitions

### Error Handling Strategy

- Centralized Express error handler
- Custom error classes for different scenarios
- Structured error logging with Pino
- Proper HTTP status codes and messages

### Logging Strategy

- **Pino**: Structured JSON logging
- **Morgan**: HTTP request/response logging
- Daily log rotation
- Different log levels (info, warn, error, debug)
- Request correlation IDs

## Cursor Rules for Project

### File Organization Rules

1. **Feature Proximity**: Keep related files in the same feature directory
2. **Naming Convention**: Use `feature.{type}.ts` pattern
3. **Types Location**: Feature-specific types stay within feature, only global types in `/shared/types`
4. **Import Organization**: Use path aliases, group imports logically

### Code Quality Rules

1. **OOP Principles**: Use classes for services, repositories, and controllers
2. **Clean Code**: Multi-line implementations preferred over one-liners for readability
3. **Type Safety**: Strict TypeScript configuration, no `any` types
4. **Error Handling**: Always use try-catch blocks and proper error propagation

### Development Workflow Rules

1. **Conventional Commits**: Use semantic commit messages
2. **Code Review**: All features require pull request review
3. **Testing**: Unit tests for services and repositories
4. **Documentation**: Update README and API docs with changes

## Next Steps

1. **Project Initialization**

   - Set up package.json and dependencies
   - Configure TypeScript and ESLint
   - Create basic project structure

2. **Database Setup**

   - Configure Sequelize connection
   - Create initial migration scripts
   - Set up model base classes

3. **Authentication Module**

   - Implement JWT-based authentication
   - User registration/login endpoints
   - Password hashing with bcrypt

4. **Logging & Middleware**

   - Configure Pino logger
   - Set up Morgan request logging
   - Implement error handling middleware

5. **Docker Configuration**

   - Create Dockerfile for application
   - Set up docker-compose with PostgreSQL
   - Configure development environment

6. **CI/CD Pipeline**
   - GitHub Actions workflow
   - AWS EC2 deployment configuration
   - Nginx reverse proxy setup

This proposal provides a solid foundation for building a scalable, maintainable TypeScript Express.js application following modern development practices.
