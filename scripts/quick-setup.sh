#!/bin/bash

echo "🚀 Pheme Quick Setup"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Step 1: Database Schema${NC}"
echo ""
echo "Opening Supabase SQL Editor..."
echo ""
echo "Please:"
echo "  1. The SQL Editor should open in your browser"
echo "  2. Copy ALL contents from 'supabase-schema.sql'"
echo "  3. Paste into the SQL Editor"
echo "  4. Click 'RUN' button (or Cmd/Ctrl + Enter)"
echo "  5. Wait for 'Success. No rows returned'"
echo ""
echo "Press ENTER when schema is created..."

# Try to open browser
if command -v open &> /dev/null; then
    open "https://supabase.com/dashboard/project/jurmkjcoklubevhzlgda/sql/new"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://supabase.com/dashboard/project/jurmkjcoklubevhzlgda/sql/new"
fi

read -p ""

echo ""
echo -e "${GREEN}✅ Schema setup complete!${NC}"
echo ""
echo -e "${YELLOW}📊 Step 2: Seed Sample Data${NC}"
echo ""
echo "Running seed script..."
echo ""

npm run seed

echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo "🚀 Start the app: npm run dev"
echo ""
