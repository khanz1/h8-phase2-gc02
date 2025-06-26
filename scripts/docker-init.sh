#!/bin/sh

# Docker Initialization Script for Phase2 Graded Challenge
# Handles conditional database migrations and seeding

set -e

echo "🚀 Starting Phase2 Graded Challenge Initialization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
attempt=0
max_attempts=30

while ! pg_isready -h ${DB_HOST:-postgres} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ Database failed to become ready after $max_attempts attempts"
    exit 1
  fi
  echo "   Database not ready, waiting... (attempt $attempt/$max_attempts)"
  sleep 2
done
print_status 0 "Database is ready!"

# Function to check if migrations table exists
check_migrations_table() {
    PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-postgres} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} -d ${DB_NAME:-phase2_challenge} -c "SELECT 1 FROM information_schema.tables WHERE table_name='migrations';" 2>/dev/null | grep -q "(1 row)" || return 1
}

# Function to check if any data exists in key tables
check_existing_data() {
    local table_count
    table_count=$(PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-postgres} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} -d ${DB_NAME:-phase2_challenge} -t -c "
        SELECT COUNT(*) FROM (
            SELECT 1 FROM \"Users\" LIMIT 1
            UNION ALL
            SELECT 1 FROM \"Blog_Categories\" LIMIT 1  
            UNION ALL
            SELECT 1 FROM \"Blog_Posts\" LIMIT 1
        ) as combined_count;" 2>/dev/null | tr -d ' \n' || echo "0")
    
    [ "$table_count" -gt 0 ]
}

# Function to check if tables exist
check_tables_exist() {
    local tables_exist
    tables_exist=$(PGPASSWORD=${DB_PASSWORD:-password} psql -h ${DB_HOST:-postgres} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} -d ${DB_NAME:-phase2_challenge} -t -c "
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('Users', 'Blog_Categories', 'Blog_Posts');" 2>/dev/null | tr -d ' \n' || echo "0")
    
    [ "$tables_exist" -eq 3 ]
}

# Handle Migrations
print_info "Checking migration requirements..."

if [ "${RUN_MIGRATIONS:-auto}" = "false" ]; then
    print_warning "Migrations disabled by RUN_MIGRATIONS=false"
elif [ "${RUN_MIGRATIONS:-auto}" = "true" ] || [ "${RUN_MIGRATIONS:-auto}" = "auto" ]; then
    
    should_migrate=false
    
    if [ "${RUN_MIGRATIONS}" = "true" ]; then
        print_info "Force migration enabled (RUN_MIGRATIONS=true)"
        should_migrate=true
    elif ! check_tables_exist; then
        print_info "Core tables missing, migrations needed"
        should_migrate=true
    elif ! check_migrations_table; then
        print_info "Migrations table missing, running migrations"
        should_migrate=true
    else
        print_info "Database appears to be migrated, skipping migrations"
        print_warning "Use RUN_MIGRATIONS=true to force migration"
    fi
    
    if [ "$should_migrate" = true ]; then
        print_info "Running database migrations..."
        if npm run db:migrate; then
            print_status 0 "Migrations completed successfully!"
        else
            print_status 1 "Migration failed!"
            # Don't exit on migration failure in development
            if [ "${NODE_ENV}" = "production" ]; then
                exit 1
            else
                print_warning "Continuing despite migration failure (development mode)"
            fi
        fi
    fi
else
    print_warning "Invalid RUN_MIGRATIONS value: ${RUN_MIGRATIONS}"
fi

# Handle Seeding
print_info "Checking seeding requirements..."

if [ "${RUN_SEEDING:-auto}" = "false" ]; then
    print_warning "Seeding disabled by RUN_SEEDING=false"
elif [ "${RUN_SEEDING:-auto}" = "true" ] || [ "${RUN_SEEDING:-auto}" = "auto" ]; then
    
    should_seed=false
    
    if [ "${RUN_SEEDING}" = "true" ]; then
        print_info "Force seeding enabled (RUN_SEEDING=true)"
        should_seed=true
    elif ! check_tables_exist; then
        print_warning "Core tables don't exist, cannot seed. Run migrations first."
    elif ! check_existing_data; then
        print_info "No existing data found, seeding database"
        should_seed=true
    else
        print_info "Database contains data, skipping seeding"
        print_warning "Use RUN_SEEDING=true to force seeding, RUN_SEEDING=reset to clear and reseed, or RUN_SEEDING=complete for full reset"
    fi
    
    if [ "$should_seed" = true ]; then
        if [ "${SEED_MODE:-normal}" = "reset" ]; then
            print_info "Advanced reset: Truncating with restart identity and cascade..."
            if npm run db:seed:undo:full; then
                print_info "Database cleared successfully, now seeding fresh data..."
                if npm run db:seed; then
                    print_status 0 "Database reset and seeding completed successfully!"
                else
                    print_status 1 "Database seeding after reset failed!"
                    print_warning "Continuing despite seeding failure"
                fi
            else
                print_status 1 "Database reset failed!"
                print_warning "Continuing despite reset failure"
            fi
        elif [ "${SEED_MODE:-normal}" = "complete" ]; then
            print_info "Complete database reset: Drop tables + recreate + seed..."
            if npm run db:reset:complete; then
                print_status 0 "Complete database reset and seeding completed successfully!"
            else
                print_status 1 "Complete database reset failed!"
                print_warning "Continuing despite complete reset failure"
            fi
        else
            print_info "Running database seeding..."
            if npm run db:seed; then
                print_status 0 "Seeding completed successfully!"
            else
                print_status 1 "Seeding failed!"
                # Don't exit on seeding failure
                print_warning "Continuing despite seeding failure"
            fi
        fi
    fi
else
    print_warning "Invalid RUN_SEEDING value: ${RUN_SEEDING}"
fi

# Final status check
print_info "Performing final database status check..."
if check_tables_exist; then
    print_status 0 "Database tables are present"
    
    if check_existing_data; then
        print_status 0 "Database contains data"
    else
        print_warning "Database tables exist but appear empty"
    fi
else
    print_status 1 "Database tables are missing - check migration logs"
fi

print_status 0 "Database initialization completed!"

# Start the application
print_info "Starting application in ${NODE_ENV:-development} mode..."
if [ "$NODE_ENV" = "production" ]; then
    exec npm start
else
    exec npm run dev
fi 