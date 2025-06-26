#!/bin/bash

# Docker Run Script with Migration and Seeding Control
# Provides easy control over database initialization

set -e

# Default values
ENVIRONMENT="dev"
RUN_MIGRATIONS="auto"
RUN_SEEDING="auto"
SEED_MODE="normal"
DETACHED=false
REBUILD=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_help() {
    echo "Docker Run Script for Phase2 Graded Challenge"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT     Environment to run (dev/prod) [default: dev]"
    echo "  -m, --migrate MODE        Migration mode (auto/true/false) [default: auto]"
    echo "  -s, --seed MODE           Seeding mode (auto/true/false/reset/clear) [default: auto]"
    echo "  -d, --detached            Run in detached mode"
    echo "  -r, --rebuild             Force rebuild of Docker images"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Migration modes:"
    echo "  auto   - Run migrations only if needed (default)"
    echo "  true   - Always run migrations"
    echo "  false  - Never run migrations"
    echo ""
    echo "Seeding modes:"
    echo "  auto     - Run seeding only if database is empty (default)"
    echo "  true     - Always run seeding (may create duplicates)"
    echo "  false    - Never run seeding"
    echo "  reset    - Clear all data and reseed (db:seed:undo:full + db:seed)"
    echo "  clear    - Clear all data and reseed (same as reset)"
    echo "  complete - Drop tables, recreate, and seed (db:reset + db:seed:undo:full + db:seed)"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Start dev with auto migration/seeding"
    echo "  $0 -e prod                            # Start production environment"
    echo "  $0 -m true -s false                   # Force migrate, no seeding"
    echo "  $0 -m false -s false                  # No migration, no seeding"
    echo "  $0 -m true -s reset                   # Force migrate and reset seeding"
    echo "  $0 -s clear                           # Clear and reseed database"
    echo "  $0 -s complete                        # Complete reset: drop tables + recreate + seed"
    echo "  $0 -d                                 # Run in background"
    echo "  $0 -r -m true -s true                 # Rebuild and force init"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -m|--migrate)
            RUN_MIGRATIONS="$2"
            shift 2
            ;;
        -s|--seed)
            RUN_SEEDING="$2"
            shift 2
            ;;
        -d|--detached)
            DETACHED=true
            shift
            ;;
        -r|--rebuild)
            REBUILD=true
            shift
            ;;
        -h|--help)
            print_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            print_help
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo -e "${RED}❌ Invalid environment: $ENVIRONMENT${NC}"
    echo "Valid environments: dev, prod"
    exit 1
fi

# Validate migration mode
if [[ "$RUN_MIGRATIONS" != "auto" && "$RUN_MIGRATIONS" != "true" && "$RUN_MIGRATIONS" != "false" ]]; then
    echo -e "${RED}❌ Invalid migration mode: $RUN_MIGRATIONS${NC}"
    echo "Valid modes: auto, true, false"
    exit 1
fi

# Handle special seeding modes and validate
if [[ "$RUN_SEEDING" == "reset" || "$RUN_SEEDING" == "clear" ]]; then
    SEED_MODE="reset"
    RUN_SEEDING="true"
elif [[ "$RUN_SEEDING" == "complete" ]]; then
    SEED_MODE="complete"
    RUN_SEEDING="true"
elif [[ "$RUN_SEEDING" != "auto" && "$RUN_SEEDING" != "true" && "$RUN_SEEDING" != "false" ]]; then
    echo -e "${RED}❌ Invalid seeding mode: $RUN_SEEDING${NC}"
    echo "Valid modes: auto, true, false, reset, clear, complete"
    exit 1
fi

# Set compose file based on environment
if [[ "$ENVIRONMENT" == "prod" ]]; then
    COMPOSE_FILE="docker/docker-compose.prod.yml"
    ENV_NAME="Production"
else
    COMPOSE_FILE="docker/docker-compose.yml"
    ENV_NAME="Development"
fi

# Display configuration
echo -e "${BLUE}🚀 Starting Phase2 Graded Challenge${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Environment:     ${GREEN}$ENV_NAME${NC}"
echo -e "Migrations:      ${YELLOW}$RUN_MIGRATIONS${NC}"
echo -e "Seeding:         ${YELLOW}$RUN_SEEDING${NC}"
echo -e "Detached:        ${YELLOW}$DETACHED${NC}"
echo -e "Rebuild:         ${YELLOW}$REBUILD${NC}"
echo -e "Compose file:    ${YELLOW}$COMPOSE_FILE${NC}"
echo ""

# Set environment variables
export RUN_MIGRATIONS
export RUN_SEEDING
export SEED_MODE

# Build docker-compose command
COMPOSE_CMD="docker-compose -f $COMPOSE_FILE"

# Add build flag if rebuild requested
if [[ "$REBUILD" == true ]]; then
    COMPOSE_CMD="$COMPOSE_CMD up --build"
    echo -e "${BLUE}ℹ️  Rebuilding Docker images...${NC}"
else
    COMPOSE_CMD="$COMPOSE_CMD up"
fi

# Add detached flag if requested
if [[ "$DETACHED" == true ]]; then
    COMPOSE_CMD="$COMPOSE_CMD -d"
    echo -e "${BLUE}ℹ️  Running in detached mode...${NC}"
fi

# Stop existing containers if they exist
echo -e "${BLUE}ℹ️  Stopping any existing containers...${NC}"
docker-compose -f $COMPOSE_FILE down > /dev/null 2>&1 || true

# Run the command
echo -e "${GREEN}🎯 Executing: $COMPOSE_CMD${NC}"
echo ""

if eval $COMPOSE_CMD; then
    echo ""
    echo -e "${GREEN}✅ Containers started successfully!${NC}"
    
    if [[ "$DETACHED" == true ]]; then
        echo ""
        echo -e "${BLUE}ℹ️  Useful commands:${NC}"
        echo "  View logs:     docker-compose -f $COMPOSE_FILE logs -f"
        echo "  Stop:          docker-compose -f $COMPOSE_FILE down"
        echo "  Status:        docker-compose -f $COMPOSE_FILE ps"
        echo ""
        if [[ "$ENVIRONMENT" == "dev" ]]; then
            echo -e "${GREEN}🌐 Application available at: http://localhost:8001${NC}"
        else
            echo -e "${GREEN}🌐 Application available at: http://localhost${NC}"
        fi
    fi
else
    echo ""
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi 