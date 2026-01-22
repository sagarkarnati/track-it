# Testing the Excel Processor

## Prerequisites

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Create test Excel files from the documentation:**

   You need to convert the markdown tables in these files to actual Excel files:
   - `/docs/Cosec_Dump_rptviewer.md` → `cosec_dump.xlsx`
   - `/docs/BBHR_Time_Off_Schedule_(CoreStack).md` → `bbhr_schedule.xlsx`

   **Quick way to create Excel files:**
   - Copy the table from each markdown file
   - Paste into Excel/Google Sheets
   - Save as `.xlsx`

## Testing Steps

### 1. Upload Files Through UI

1. Navigate to: http://localhost:3000
2. Click "**New Report**" in the sidebar
3. Enter report name (e.g., "December 2025 Attendance")
4. **Step 1**: Upload your COSEC dump Excel file
5. **Step 2**: Upload your BBHR schedule Excel file
6. **Step 3**: Review and submit

### 2. Watch Real-Time Processing

The processing page will automatically show:
- ✅ Real-time status updates
- ✅ Processing logs streaming live
- ✅ Progress through each stage

Processing stages:
1. "Starting attendance processing..."
2. "Reading COSEC attendance file..."
3. "Reading BBHR time-off schedule..."
4. "Files prepared for processing"
5. "Processing attendance data..."
6. "Generating Excel report..."
7. "Uploading generated report"
8. "Report processing completed successfully"

### 3. Download the Report

Once processing is complete:
1. Click "**Download Report**" button
2. Open the Excel file
3. Verify the output:
   - ✅ Employee list with all team members
   - ✅ Leave balances (CL, EL, SL)
   - ✅ Daily attendance status
   - ✅ Color coding:
     - 🟢 Green = Present
     - 🔴 Red = Absent
     - 🔵 Blue = Work From Home
     - 🟡 Yellow = Leave (EL/SL/CL)
     - ⚪ Gray = Holiday
     - White = Weekend
   - ✅ Totals calculated correctly

### 4. Alternative: Test via API

If you prefer testing via API:

```bash
# Get a report ID first by creating a report through UI
# Then trigger processing:
./scripts/test-excel-processor.sh <report-id>
```

Or use curl directly:
```bash
curl -X POST "http://localhost:3000/api/reports/<report-id>/process" \
  -H "Content-Type: application/json"
```

## Expected Output Example

The generated Excel file should have columns like:

| EMP NO | ASSOCIATE NAME  | CL | EL | SL | Present | Absent | WFH | Mon, 1/Dec/25 | Tue, 2/Dec/25 | ... |
|--------|-----------------|----|----|----|---------| -------|-----|---------------|---------------|-----|
| 101054 | Ramasamy S      | 1  | 0  | 6  | 0       | 6      | 16  | WFH           | WFH           | ... |
| 101108 | Ponraj S        | 0  | 12 | 11 | 8       | 1      | 13  | WFH           | WFH           | ... |
| ...    | ...             | .. | .. | .. | ...     | ...    | ... | ...           | ...           | ... |

## What the Processor Does

1. **Parses COSEC File**:
   - Extracts date-wise attendance (First IN, Last OUT)
   - Identifies present/absent days

2. **Parses BBHR File**:
   - Extracts approved leaves and WFH
   - Maps date ranges to individual days

3. **Combines Data**:
   - Matches employees across both files
   - Applies leave/WFH over attendance data
   - Marks weekends automatically (Saturday/Sunday)
   - Marks holidays from India calendar

4. **Calculates Metrics**:
   - Total present days
   - Total absent days
   - Total WFH days
   - Leave balances (deducted based on approved leaves)

5. **Generates Report**:
   - Creates color-coded Excel file
   - Formats headers with styling
   - Applies conditional formatting

## Troubleshooting

### Files not uploading?
- Check file size (max 10MB)
- Ensure files are `.xlsx` format
- Check browser console for errors

### Processing stuck?
- Check the processing logs table in Supabase
- Look at server console for errors
- Verify environment variables are set

### Report download fails?
- Check Supabase Storage is accessible
- Verify `reports` bucket exists
- Check bucket permissions

### Wrong calculations?
- Verify input file formats match documentation
- Check date formats (MM/DD/YY or DD/MM/YYYY)
- Ensure leave status is "Approved" in BBHR file

## Sample Test Data

Use the employee data from the docs:
- **Employees**: 101054, 101108, 101144, 101154, 101288, 101312, 101319, 101428
- **Date Range**: December 1-31, 2025
- **Includes**: Various leave types, WFH, holidays, weekends

## Need Help?

Check these files for reference:
- `/docs/EXCEL_PROCESSING.md` - Detailed processing documentation
- `/docs/MVP_STATUS.md` - Feature status and completion
- `/src/lib/excel-processor.service.ts` - Processing implementation
