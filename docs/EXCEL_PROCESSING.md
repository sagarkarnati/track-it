# Excel Processing Service

This service processes COSEC attendance dumps and BBHR time-off schedules to generate comprehensive attendance reports.

## Features

- ✅ Parses COSEC dump files (date-wise attendance with in/out times)
- ✅ Parses BBHR time-off schedules (leave and WFH requests)
- ✅ Combines attendance and leave data
- ✅ Handles holidays and weekends automatically
- ✅ Calculates leave balances (CL, EL, SL)
- ✅ Generates color-coded Excel reports
- ✅ Real-time progress logging to database

## Input File Formats

### COSEC Dump (cosec_file)
- Date-wise attendance grouped by date headers
- Columns: User ID, User ID (dup), Name, First IN, Last OUT, Early-IN, Late-IN, Early-OUT, Late-OUT, Leave, Leave
- Empty attendance = Absent
- Format: Excel (.xlsx)

### BBHR Time-Off Schedule (bbhr_file)
- One row per leave/WFH request
- Columns: Employee Number, Name, From, To, Category, Amount, Units, Status, Notes
- Categories: Earned Leave, Sick Leave, Casual Leave, Work from Home
- Only "Approved" leaves are processed
- Format: Excel (.xlsx)

## Output Format

### Attendance Report (output_file)
- One row per employee
- Columns:
  - EMP NO
  - ASSOCIATE NAME
  - CL - Balance
  - EL - Balance
  - SL - Balance
  - No. of days present
  - No. of days absent
  - WFH
  - Individual date columns with status codes

### Status Codes
- `P` = Present (Green background)
- `A` = Absent (Red background)
- `WFH` = Work From Home (Blue background)
- `EL` = Earned Leave (Yellow background)
- `SL` = Sick Leave (Yellow background)
- `CL` = Casual Leave (Yellow background)
- `H` = Holiday (Gray background)
- `-` = Weekend (no color)

## Holidays (India 2026)

The service automatically marks these holidays:
- January 1: New Year's Day
- January 15: Pongal
- January 26: Republic Day
- April 14: Tamil New Year
- May 1: May Day
- May 28: Bakrid
- September 14: Ganesh Chaturthi
- October 2: Gandhi Jayanti
- October 19: Ayudha Pooja
- December 25: Christmas

## Usage

### API Endpoint

```bash
POST /api/reports/[id]/process
```

### Programmatic Usage

```typescript
import { ExcelProcessorService } from '@/lib/excel-processor.service';

const processor = new ExcelProcessorService();

const outputPath = await processor.processAttendanceReport(
  '/path/to/cosec.xlsx',
  '/path/to/bbhr.xlsx',
  'report-id-123'
);

console.log('Report generated:', outputPath);
```

### Testing

```bash
# Upload files first through the UI
# Then trigger processing:
./scripts/test-excel-processor.sh <report-id>
```

## Processing Logic

### Step 1: Parse COSEC File
- Reads date headers (format: DD/MM/YYYY)
- Groups attendance records by date
- Extracts: User ID, Name, First IN, Last OUT, Late OUT

### Step 2: Parse BBHR File
- Reads leave/WFH requests
- Filters only "Approved" status
- Maps leave types to status codes

### Step 3: Process Attendance
1. Get date range from COSEC records
2. For each employee and each date:
   - Check if weekend → mark as `-`
   - Check if holiday → mark as `H`
   - Check BBHR for leave → mark as `WFH`/`EL`/`SL`/`CL`
   - Check COSEC for attendance → mark as `P` or `A`
3. Calculate totals and balances

### Step 4: Generate Report
- Create Excel workbook with all columns
- Apply color coding based on status
- Format headers with bold text and gray background
- Export to file

## Error Handling

The service handles:
- Missing files
- Invalid Excel formats
- Missing columns
- Date parsing errors
- Storage upload errors

All errors are logged to `processing_logs` table and reflected in the report status.

## Real-time Updates

Processing progress is logged to the database in real-time:
- "Starting attendance processing..."
- "Reading COSEC attendance file..."
- "Reading BBHR time-off schedule..."
- "Processing attendance data..."
- "Generating Excel report..."
- "Report generated successfully!"

These logs are visible on the Processing page through Supabase Realtime.

## Performance

- Processes ~100 employees for 1 month in ~2-3 seconds
- Memory efficient (streams data, doesn't load entire file into memory)
- Temporary files cleaned up automatically

## Future Enhancements

- [ ] Support for multiple organizations
- [ ] Configurable holiday calendars
- [ ] Custom leave balance rules
- [ ] Overtime tracking
- [ ] Email notifications
- [ ] Batch processing for multiple months
