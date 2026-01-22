#!/bin/bash

# Track-It Database Migration Script
# This script applies the initial database schema to Supabase

echo "🚀 Starting Track-It database migration..."

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed. Please install PostgreSQL client tools."
    exit 1
fi

# Load environment variables
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    exit 1
fi

source .env.local

# Extract connection details from POSTGRES_URL_NON_POOLING
if [ -z "$POSTGRES_URL_NON_POOLING" ]; then
    echo "❌ Error: POSTGRES_URL_NON_POOLING not found in .env.local"
    exit 1
fi

echo "📊 Applying database schema..."
psql "$POSTGRES_URL_NON_POOLING" -f supabase/migrations/001_initial_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Verify tables in Supabase Dashboard → Table Editor"
    echo "2. Check Storage bucket 'reports' in Storage section"
    echo "3. Run 'pnpm dev' to start the application"
else
    echo "❌ Database migration failed. Please check the error messages above."
    exit 1
fi
