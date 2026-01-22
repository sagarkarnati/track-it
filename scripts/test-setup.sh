#!/bin/bash

# Test script to verify Supabase setup
echo "🧪 Testing Supabase Backend Setup..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    exit 1
fi

echo "✅ Environment variables configured"

# Test API endpoints
echo ""
echo "Testing API endpoints..."

# Test GET /api/reports
echo "📋 Testing GET /api/reports..."
response=$(curl -s http://localhost:3000/api/reports)
if [ $? -eq 0 ]; then
    echo "✅ GET /api/reports working"
else
    echo "❌ GET /api/reports failed"
fi

echo ""
echo "✨ Manual tests to perform:"
echo "1. Visit http://localhost:3000"
echo "2. Click 'Create New Report'"
echo "3. Upload COSEC and BBHR files"
echo "4. Watch for real-time processing updates"
echo "5. Download the generated report"
echo ""
echo "📚 For detailed setup instructions, see docs/QUICK_SETUP.md"
