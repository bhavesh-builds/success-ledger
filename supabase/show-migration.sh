#!/bin/bash
# Helper script to display the migration SQL for easy copying

echo "=========================================="
echo "Success Ledger - Database Migration SQL"
echo "=========================================="
echo ""
echo "Copy the SQL below and paste it into Supabase SQL Editor"
echo ""
echo "=========================================="
echo ""

cat "$(dirname "$0")/migrations/001_initial_schema.sql"

echo ""
echo "=========================================="
echo "End of Migration SQL"
echo "=========================================="


