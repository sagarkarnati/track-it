#!/bin/bash

# Script to test the Excel processor with sample files

echo "🧪 Testing Excel Processor..."

REPORT_ID="$1"

if [ -z "$REPORT_ID" ]; then
  echo "Usage: ./test-excel-processor.sh <report-id>"
  echo "Example: ./test-excel-processor.sh 550e8400-e29b-41d4-a716-446655440000"
  exit 1
fi

echo "📋 Processing report: $REPORT_ID"

# Trigger the processing endpoint
curl -X POST "http://localhost:3000/api/reports/${REPORT_ID}/process" \
  -H "Content-Type: application/json" \
  -w "\n\n✅ Response received\n"

echo ""
echo "✅ Processing triggered! Check the dashboard for real-time updates."
echo "🔍 Monitor processing logs at: http://localhost:3000/processing?id=${REPORT_ID}"
