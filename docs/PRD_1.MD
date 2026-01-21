# Product Requirements Document (PRD)
## Attendance Data Processing Tool - "Track-It"

**Version:** 1.0  
**Date:** January 21, 2026  
**Product Manager:** [Your Name]  
**Status:** Ready for Development

---

## 1. Executive Summary

**Track-It** is a MicroSaaS attendance processing tool that automates the consolidation of Cosec physical attendance data and BBHR leave management data into a unified Excel attendance report for payroll processing. The tool will reduce HR processing time from 2 weeks to ~4-8 hours per month (90-95% time reduction) while ensuring 100% calculation accuracy and comprehensive gap detection.

**Target Users:** 3-4 HR Managers  
**Target Scale:** Up to 1000 employees  
**MVP Timeline:** To be determined  
**Core Value:** Eliminate manual Excel work, prevent payroll errors, maintain employee trust

---

## 2. Problem Statement

### Current Pain Points
HR managers currently spend **2 weeks per month** manually:
- Exporting data from Cosec (physical attendance system) and BBHR (leave management)
- Using Excel formulas and manual copy-paste to merge datasets
- Calculating present/absent/WFH days and leave balances
- Identifying data gaps and inconsistencies
- Notifying employees about missing leave applications

### Business Impact
- **Time Loss:** 2 weeks of manual work per payroll cycle
- **Error Risk:** Manual process prone to calculation mistakes
- **Employee Trust:** Payroll errors damage employee confidence
- **Missed Gaps:** Difficult to identify missing data systematically
- **No Reminders:** Cannot proactively notify employees about data issues

### Why Now
- Monthly payroll cycle makes manual work unsustainable
- Growing team size increases complexity
- Need for accurate, auditable attendance records

---

## 3. Goals & Success Metrics

### Primary Goals
1. **Automate Data Processing:** Merge Cosec + BBHR + Employee Master data automatically
2. **Ensure Accuracy:** 0% calculation error tolerance
3. **Detect Gaps:** Identify 100% of missing/conflicting data
4. **Save Time:** Reduce processing from 2 weeks to 4-8 hours (90-95% reduction)

### Success Metrics

| Metric | Current State | Target State | Measurement Method |
|--------|--------------|--------------|-------------------|
| Processing Time | 2 weeks | 4-8 hours | Time tracking per payroll cycle |
| Calculation Accuracy | ~95% (manual errors) | 100% | QA validation against manual process |
| Gap Detection Rate | Unknown | 100% | Test with historical files |
| Adoption Success | N/A | 3 consecutive error-free cycles | Usage tracking |

### Leading Indicators
- Upload success rate (no validation errors)
- Processing completion rate (no crashes)
- Gap detection accuracy (validate with known issues)

### Lagging Indicators
- Payroll error reduction
- HR time savings per cycle
- Employee complaint reduction

---

## 4. User Personas & Stakeholders

### Primary User: HR Manager
**Profile:**
- 3-4 HR managers in the organization
- Responsible for monthly payroll data preparation
- Currently Excel-proficient but process is time-consuming
- Need desktop Chrome browser access during business hours

**Goals:**
- Process 1000 employees in <5 minutes
- Ensure 100% accuracy for payroll
- Identify all data gaps before payroll deadline
- Download clean Excel report

**Pain Points:**
- Manual Excel formulas break frequently
- Hard to spot missing data across large datasets
- Time pressure during payroll cycle
- Fear of making costly errors

### Secondary Stakeholders
**Employees:**
- Receive email notifications about missing data (post-MVP)
- Need to apply leaves in BBHR or contact HR to fix Cosec records

**Reporting Managers:**
- Need to approve "Requested" leave applications (post-MVP notifications)

**Finance/Payroll Team:**
- Consume final attendance report for payroll processing
- Depend on accuracy and timeliness

---

## 5. Scope Definition

### In Scope (MVP)

#### Core Features
✅ **File Upload & Validation**
- Upload 3 files sequentially: Cosec dump, BBHR time-off, Employee Master + Holiday Calendar
- File format: .xlsx only
- Column validation with error blocking
- Preview: First 10 rows + summary stats (employee count, date range)
- Re-upload capability if mistake detected

✅ **Data Processing**
- Match employees by Employee Number across all files
- Process full calendar month OR custom date ranges
- Apply business logic for day classification (Leave > WFH > Present)
- Calculate: Present days, Absent days, WFH days
- Trust BBHR leave balance calculations

✅ **Gap Detection**
- **Critical Gaps:** Missing data (no Cosec + no BBHR on weekday), Pending approvals ("Requested" status)
- **Warnings:** Came to office on approved leave day
- **Info:** Weekend/holiday work, WFH + office visit

✅ **Output & Download**
- Gap Summary Dashboard (counts, lists, categories)
- Excel download with 2 sheets:
  - Sheet 1: Attendance template (color-coded: red=missing, yellow=warning)
  - Sheet 2: Gap/Warning details with employee info and dates
- File naming: `Attendance_Report_[Month]_[Year].xlsx`

✅ **Multi-User Support**
- Multiple HR managers can VIEW results simultaneously
- ONE user can PROCESS at a time (locking mechanism)

✅ **Data Storage**
- Results stored in Supabase/PostgreSQL database
- Uploaded files deleted immediately after processing
- No historical report storage in MVP

### Out of Scope (Post-MVP)

❌ **Email Notifications**
- Automated emails to employees about missing data
- Notifications to managers about pending approvals
- Email tracking and follow-up workflows

❌ **Advanced Features**
- API integration with Cosec/BBHR systems
- User authentication/multi-tenancy
- Historical report comparison/search
- Approval workflows within the tool
- Mobile application
- Advanced analytics/reporting
- Audit trail/change logs

❌ **Extended Platform Support**
- Mobile browsers
- Non-Chrome desktop browsers
- 24/7 availability (business hours only for MVP)

### Explicitly Not Doing
- Modifying Cosec or BBHR systems
- Replacing BBHR leave management workflow
- Automated payroll calculation (only attendance data)
- Employee self-service portal

---

## 6. Functional Requirements

### 6.1 File Upload & Validation

#### FR-1: Sequential File Upload
**Description:** Users upload 3 files in a step-by-step wizard.

**Steps:**
1. **Step 1:** Upload Cosec Attendance Dump (.xlsx)
2. **Step 2:** Upload BBHR Time-Off Schedule (.xlsx)
3. **Step 3:** Upload Employee Master + Holiday Calendar (.xlsx)

**Behavior:**
- Each step validates file format and column structure
- Preview displays: First 10 rows + Summary (employee count, date range detected)
- User confirms data before proceeding to next step
- Can go back and re-upload any file
- Cannot proceed if validation fails

#### FR-2: File Format Validation
**Required Columns:**

**Cosec Dump:**
- User ID
- Name
- First IN
- Last OUT
- Date (implied from report structure)

**BBHR Time-Off:**
- Employee Number
- Name
- From (date)
- To (date)
- Category (Earned Leave, Casual Leave, Sick Leave, Work from Home)
- Amount
- Units
- Status (Approved, Requested)

**Employee Master:**
- Employee Number (new column to be added)
- Emp Name
- Work Email
- Work Location
- Division
- Current Working Area
- Job Title
- Department
- Reporting to

**Holiday Calendar:**
- Date
- Day
- Type (Standard, NA)
- Holiday Description
- Remarks

**Error Handling:**
- If columns missing/mismatched → Block processing
- Display error message: "Expected columns: [list]. Found: [list]. Please check file format."

#### FR-3: Data Preview & Confirmation
**Display:**
- Table showing first 10 rows of uploaded file
- Summary statistics:
  - Employee count
  - Date range detected (e.g., "December 1-31, 2025")
  - Total records
- "Confirm" button to proceed
- "Re-upload" button to replace file

### 6.2 Employee Matching & Master Data

#### FR-4: Employee Number Matching
**Logic:**
- Primary key: Employee Number (present in all 3 files)
- Match Cosec User ID → BBHR Employee Number → Employee Master Employee Number

**Edge Cases:**
- If employee found in Cosec/BBHR but NOT in Employee Master:
  - Flag as "Unknown Employee"
  - Prompt HR to add employee details manually OR upload updated master
  - Block processing until resolved
- If employee in Employee Master but not in Cosec/BBHR:
  - Include in final report with all days marked as missing data

#### FR-5: Employee Master Persistence
**Behavior:**
- Employee Master uploaded once, not required every month
- System remembers last uploaded master
- HR can update master anytime (e.g., new hires, terminations)
- Option to "Use Previous Master" or "Upload New Master"

### 6.3 Data Processing & Business Logic

#### FR-6: Day Classification Rules (Priority Order)

**Priority 1: Holidays & Weekends**
- Check if date is in Holiday Calendar OR Saturday/Sunday
- If YES + Cosec entry exists → Mark as **"P"** (Present, count toward days present)
- If YES + No Cosec entry → Mark as **"-"** (Off day, no count)

**Priority 2: BBHR Leaves (Overrides WFH)**
- If BBHR has Earned Leave (EL), Casual Leave (CL), or Sick Leave (SL) with Status = "Approved":
  - Mark as **"EL"**, **"CL"**, or **"SL"**
  - Count toward absent days
  - If Cosec entry also exists → Flag as WARNING: "Came to office on approved leave"

**Priority 3: BBHR Work From Home**
- If BBHR has "Work from Home" with Status = "Approved":
  - Mark as **"WFH"**
  - Count toward WFH days
  - If Cosec entry also exists → No warning (employee came to office on WFH day, acceptable)

**Priority 4: Cosec Present**
- If Cosec has First IN and Last OUT times:
  - Mark as **"P"** (Present)
  - Count toward days present

**Priority 5: No Data (Gap Detection)**
- If weekday + No Cosec entry + No BBHR entry:
  - Mark as **"?"** (Missing data)
  - Flag as CRITICAL GAP
  - Count toward days with no data

**Priority 6: Weekends/Holidays (No Data)**
- If weekend/holiday + No Cosec entry + No BBHR entry:
  - Mark as **"-"** (Standard off day)
  - No gap flag

#### FR-7: Multiple BBHR Entries Handling
**Scenario:** Employee has multiple leave/WFH requests for overlapping dates (e.g., WFH Dec 9-26 + Sick Leave Dec 19)

**Logic:**
- For each date, apply Priority 2 (Leaves) before Priority 3 (WFH)
- Dec 19: Show "SL" (Sick Leave overrides WFH)
- Other dates in range: Show "WFH"

#### FR-8: "Requested" Status Handling
**Behavior:**
- "Requested" leaves are NOT approved yet
- Do NOT mark day as leave
- Check if Cosec entry exists:
  - If YES → Mark as "P" (Present)
  - If NO → Mark as "?" (Missing data) + Flag as CRITICAL: "Pending manager approval"

#### FR-9: Metrics Calculation
**Calculate for each employee:**
- **CL Balance, EL Balance, SL Balance, Comp Off:** Trust values from BBHR (no recalculation)
- **No. of days present:** Count of "P" (including weekend/holiday work)
- **No. of days absent:** Count of "EL", "CL", "SL"
- **WFH:** Count of "WFH"
- **Days with no data:** Count of "?" (missing data gaps)

### 6.4 Gap Detection & Alerting

#### FR-10: Critical Gaps (Red Alert)
**Type 1: Missing Data**
- Weekday + No Cosec entry + No BBHR entry
- Mark cell as "?" with red background color
- Add to Gap Summary: "Missing attendance/leave data"

**Type 2: Pending Manager Approval**
- BBHR Status = "Requested"
- Add to Gap Summary: "Pending leave approval by [Manager Name]"

#### FR-11: Warnings (Yellow Alert)
**Type 1: Office Visit on Approved Leave**
- BBHR has approved leave (EL/CL/SL) + Cosec entry exists
- Mark cell with leave type (EL/CL/SL) with yellow background color
- Add to Gap Summary: "Attended office on approved leave day"

#### FR-12: Informational (No Alert)
**Type 1: Weekend/Holiday Work**
- Weekend or Holiday + Cosec entry exists
- Mark as "P" with normal formatting
- Optionally add note in Gap Summary: "Worked on [Holiday Name/Weekend]"

**Type 2: WFH + Office Visit**
- WFH approved + Cosec entry exists
- Mark as "WFH" with normal formatting
- No gap flag (acceptable behavior)

### 6.5 Processing Status & Progress

#### FR-13: Real-Time Processing Updates
**Display:**
- Progress bar showing percentage completion
- Status messages:
  - "Validating files..."
  - "Matching employees..."
  - "Processing attendance data..."
  - "Detecting gaps..."
  - "Generating report..."
- Estimated time remaining (if possible)

**Timeout:**
- Maximum processing time: 5 minutes
- If exceeds 5 minutes → Show error: "Processing timeout. Please contact support."

#### FR-14: Error Handling
**On Processing Failure:**
- Display clear error message with details
- Log error for debugging
- Prompt user to restart from Step 1 (re-upload files)
- Do not save partial results
- Delete any uploaded files

### 6.6 Output & Download

#### FR-15: Gap Summary Dashboard
**Display after processing completes:**

**Summary Cards:**
- Total Employees Processed: [count]
- Date Range: [start date] to [end date]
- Critical Gaps: [count] employees
- Warnings: [count] employees
- Clean Records: [count] employees

**Detailed Lists:**
- **Critical Gaps Section:**
  - Employee Name
  - Employee Number
  - Issue Type (Missing Data / Pending Approval)
  - Dates Affected (e.g., "Dec 1, 5, 10-12")
  - Action Required
- **Warnings Section:**
  - Employee Name
  - Employee Number
  - Warning Type (Office Visit on Leave / etc.)
  - Dates Affected
- **Clean Records Section:**
  - List of employees with no issues

**Actions:**
- "Download Excel Report" button
- "Process New Report" button (clears current session)
- "View Previous Results" (if results stored in DB)

#### FR-16: Excel Download - Sheet 1 (Attendance Template)
**Structure:** Exactly match the sample template provided

**Columns:**
- EMP NO
- ASSOCIATE NAME
- CL - Balance
- EL - Balance
- SL - Balance
- Comp Off
- No. of days present
- No. of days absent
- WFH
- Days with no data
- [Each date as column]: Mon, 1/Dec/25 | Tue, 2/Dec/25 | ... | Wed, 31/Dec/25
- Location
- Division
- RM (Reporting Manager)

**Cell Values:**
- "P" = Present
- "WFH" = Work From Home
- "EL" / "CL" / "SL" = Leave types
- "-" = Weekend/Holiday (no work)
- "?" = Missing data

**Color Coding:**
- Red background: Critical gaps ("?", pending approvals)
- Yellow background: Warnings (office on leave day)
- White background: Normal

#### FR-17: Excel Download - Sheet 2 (Gap Details)
**Columns:**
- Employee Number
- Employee Name
- Issue Type (Critical / Warning)
- Specific Issue (Missing Data / Pending Approval / Office on Leave)
- Dates Affected (comma-separated list)
- Reporting Manager
- Email (for future notification use)
- Notes/Comments

**Sorting:**
- Critical gaps first
- Then warnings
- Alphabetical by employee name within each category

#### FR-18: File Naming & Download
**Behavior:**
- Auto-generate filename: `Attendance_Report_December_2025.xlsx`
- Format: `Attendance_Report_[MonthName]_[Year].xlsx`
- Browser downloads file to default Downloads folder
- Option to download again from Gap Summary Dashboard

### 6.7 Multi-User Concurrency

#### FR-19: Processing Lock
**Behavior:**
- When User A starts processing, system acquires lock
- If User B tries to process while locked:
  - Display message: "Processing in progress by [User A]. Please wait or view previous results."
  - Disable "Start Processing" button
  - Show estimated completion time
- Lock released when processing completes or fails

#### FR-20: View-Only Access
**Behavior:**
- Multiple users can view Gap Summary Dashboard simultaneously
- Multiple users can download the same Excel report
- Read-only access does not acquire lock

---

## 7. User Flows

### 7.1 Happy Path: Successful Processing

```
1. HR Manager logs into Track-It dashboard
2. Clicks "New Attendance Report"
3. **Step 1: Upload Cosec Dump**
   - Selects Cosec_Dump_December_2025.xlsx
   - System validates columns → ✅ Pass
   - Displays preview: 10 rows + "8 employees, Dec 1-31, 2025"
   - Clicks "Confirm & Continue"
4. **Step 2: Upload BBHR Time-Off**
   - Selects BBHR_TimeOff_December_2025.xlsx
   - System validates columns → ✅ Pass
   - Displays preview: 10 rows + "32 leave requests, 8 employees"
   - Clicks "Confirm & Continue"
5. **Step 3: Upload Employee Master**
   - System prompts: "Use Previous Master (uploaded Nov 2025)?"
   - Selects "Use Previous Master"
   - Displays preview of master data
   - Clicks "Start Processing"
6. **Processing Screen**
   - Progress bar: "Matching employees... 25%"
   - Progress bar: "Processing attendance... 50%"
   - Progress bar: "Detecting gaps... 75%"
   - Progress bar: "Generating report... 100%"
   - Time elapsed: 2 minutes 14 seconds
7. **Gap Summary Dashboard**
   - Summary: "8 employees processed, 2 critical gaps, 1 warning"
   - Lists: 
     - Critical: Akashnikhil V (Missing data: Dec 10, 12)
     - Warning: Seshan K B (Office on leave: Dec 26)
   - Clicks "Download Excel Report"
8. Excel file downloaded: `Attendance_Report_December_2025.xlsx`
9. HR Manager opens Excel, verifies data, shares with payroll team
```

### 7.2 Error Path: Column Validation Failure

```
1. HR Manager uploads Cosec dump
2. System validates columns → ❌ Fail
3. Error displayed:
   "Column mismatch detected
   Expected: User ID, Name, First IN, Last OUT
   Found: User ID, Employee Name, Login Time, Logout Time
   Please check your file format and try again."
4. HR Manager clicks "Re-upload"
5. Selects correct file → Validation passes
6. Continues to Step 2
```

### 7.3 Error Path: Unknown Employee

```
1. Processing reaches employee matching phase
2. System finds Employee #101500 in Cosec dump
3. Employee #101500 NOT in Employee Master
4. Processing paused
5. Error displayed:
   "Unknown employee detected
   Employee #101500 (Name: New Hire X) found in attendance data but not in Employee Master.
   Please add this employee to your master data or upload an updated master file."
6. Options:
   - "Add Employee Manually" (opens form)
   - "Upload Updated Master"
   - "Exclude This Employee" (continues processing without them)
```

### 7.4 Concurrent User Path

```
1. HR Manager A starts processing at 10:00 AM
2. HR Manager B tries to start processing at 10:01 AM
3. System displays:
   "Processing in Progress
   Another user is currently processing attendance data.
   Started: 10:00 AM by [Manager A]
   Estimated completion: 10:05 AM
   
   You can:
   - Wait and refresh this page
   - View previous reports"
4. HR Manager B clicks "View Previous Reports"
5. Sees November 2025 report (read-only)
6. At 10:05 AM, Manager A completes processing
7. Manager B refreshes, lock released, can now process
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

**NFR-1: Processing Speed**
- Target: Process 1000 employees in 2-5 minutes
- File size: Up to 10 MB per file
- Acceptable: Up to 5 minutes for 1000 employees
- Unacceptable: >5 minutes (timeout error)

**NFR-2: Real-Time Updates**
- Progress updates every 5 seconds minimum
- Status messages reflect current processing stage
- No frozen UI during processing

**NFR-3: File Upload Speed**
- Files upload in <30 seconds (10 MB file on standard broadband)
- Display upload progress bar

### 8.2 Reliability

**NFR-4: Accuracy**
- **Zero tolerance** for calculation errors
- 100% match with manual process validation
- All business logic rules must be deterministic

**NFR-5: Error Recovery**
- Processing failures must not corrupt data
- Failed processing deletes all uploaded files
- User can retry immediately without system restart

**NFR-6: Data Integrity**
- Database transactions ensure atomic operations
- No partial results saved on failure
- Results stored in DB are immutable (no accidental edits)

### 8.3 Usability

**NFR-7: Browser Support**
- Primary: Google Chrome (latest version)
- Desktop only (responsive design not required for MVP)
- Minimum screen resolution: 1366x768

**NFR-8: User Experience**
- Maximum 3 clicks to start processing after login
- Clear error messages with actionable steps
- Preview data before processing (no surprises)

**NFR-9: Accessibility**
- Not required for MVP (business hours, internal users)
- Future: WCAG 2.1 AA compliance

### 8.4 Security

**NFR-10: Data Storage**
- Uploaded files deleted immediately after processing
- Processed results stored in Supabase/PostgreSQL with encryption at rest
- No sensitive data in browser localStorage/sessionStorage

**NFR-11: Authentication**
- MVP: Basic email/password authentication (if multi-user)
- Future: SSO integration with company identity provider

**NFR-12: Data Access**
- Only authenticated HR managers can access the tool
- No public access
- Results visible only to authorized users

### 8.5 Availability

**NFR-13: Uptime**
- Business hours (9 AM - 6 PM local time, Monday-Friday)
- No 24/7 requirement for MVP
- Acceptable downtime: Weekends, holidays

**NFR-14: Backup Plan**
- If tool fails during payroll cycle, HR can revert to manual Excel process
- Tool complements but doesn't replace manual capability initially

### 8.6 Scalability

**NFR-15: User Concurrency**
- Support 3-4 HR managers concurrently viewing results
- 1 processing session at a time (enforced by lock)

**NFR-16: Data Volume**
- MVP: 1000 employees
- Future: Scale to 5000 employees without performance degradation

---

## 9. Data Models & Business Logic

### 9.1 Data Entities

#### Employee Master
```
{
  employee_number: string (primary key)
  emp_name: string
  work_email: string
  work_location: string
  division: string
  current_working_area: string
  job_title: string
  department: string
  reporting_to: string
  last_updated: timestamp
}
```

#### Holiday Calendar
```
{
  id: uuid (primary key)
  date: date
  day: string
  type: string (Standard, NA)
  holiday_description: string
  remarks: string
  year: integer
}
```

#### Processed Report (stored in DB)
```
{
  report_id: uuid (primary key)
  month: string
  year: integer
  date_range_start: date
  date_range_end: date
  processed_by: string (user email)
  processed_at: timestamp
  total_employees: integer
  critical_gaps_count: integer
  warnings_count: integer
  excel_file_path: string (downloadable link)
  status: string (completed, failed)
}
```

#### Employee Attendance Record (part of report)
```
{
  report_id: uuid (foreign key)
  employee_number: string
  employee_name: string
  cl_balance: decimal
  el_balance: decimal
  sl_balance: decimal
  comp_off: decimal
  days_present: integer
  days_absent: integer
  wfh_days: integer
  days_no_data: integer
  daily_attendance: json (date → status mapping)
  location: string
  division: string
  reporting_manager: string
}
```

#### Gap Detection Record
```
{
  report_id: uuid (foreign key)
  employee_number: string
  employee_name: string
  issue_type: string (Critical, Warning)
  specific_issue: string
  dates_affected: array[date]
  reporting_manager: string
  email: string
}
```

### 9.2 Business Logic Pseudocode

```python
def process_attendance(cosec_data, bbhr_data, employee_master, holiday_calendar):
    """
    Main processing function
    """
    results = []
    gaps = []
    
    # Step 1: Match employees
    employees = match_employees(cosec_data, bbhr_data, employee_master)
    
    # Step 2: Get date range
    date_range = extract_date_range(cosec_data, bbhr_data)
    
    # Step 3: Process each employee
    for employee in employees:
        attendance_record = {
            'employee_number': employee.number,
            'employee_name': employee.name,
            'daily_attendance': {}
        }
        
        # Get employee-specific data
        cosec_records = filter_cosec_by_employee(cosec_data, employee.number)
        bbhr_records = filter_bbhr_by_employee(bbhr_data, employee.number)
        
        # Step 4: Process each date in range
        for date in date_range:
            status = classify_day(
                date=date,
                cosec_records=cosec_records,
                bbhr_records=bbhr_records,
                holiday_calendar=holiday_calendar
            )
            
            attendance_record['daily_attendance'][date] = status
            
            # Step 5: Detect gaps
            if is_gap(status, date, holiday_calendar):
                gaps.append({
                    'employee': employee,
                    'date': date,
                    'issue': determine_issue_type(status, bbhr_records)
                })
        
        # Step 6: Calculate metrics
        attendance_record['days_present'] = count_status(attendance_record, 'P')
        attendance_record['days_absent'] = count_status(attendance_record, ['EL', 'CL', 'SL'])
        attendance_record['wfh_days'] = count_status(attendance_record, 'WFH')
        attendance_record['days_no_data'] = count_status(attendance_record, '?')
        
        # Step 7: Add leave balances from BBHR (trusted)
        attendance_record['cl_balance'] = get_leave_balance(bbhr_data, employee, 'CL')
        attendance_record['el_balance'] = get_leave_balance(bbhr_data, employee, 'EL')
        attendance_record['sl_balance'] = get_leave_balance(bbhr_data, employee, 'SL')
        attendance_record['comp_off'] = get_leave_balance(bbhr_data, employee, 'Comp Off')
        
        results.append(attendance_record)
    
    return results, gaps


def classify_day(date, cosec_records, bbhr_records, holiday_calendar):
    """
    Apply priority rules to determine day status
    """
    is_weekend_or_holiday = is_weekend(date) or is_holiday(date, holiday_calendar)
    has_cosec_entry = has_attendance(cosec_records, date)
    
    # Priority 1: Holiday/Weekend with office visit
    if is_weekend_or_holiday and has_cosec_entry:
        return 'P'  # Worked on off-day
    
    if is_weekend_or_holiday and not has_cosec_entry:
        return '-'  # Standard off-day
    
    # Priority 2: Check BBHR for leaves (overrides WFH)
    bbhr_on_date = filter_bbhr_by_date(bbhr_records, date)
    
    for leave in bbhr_on_date:
        if leave.status == 'Approved' and leave.category in ['Earned Leave', 'Casual Leave', 'Sick Leave']:
            leave_type = map_leave_category(leave.category)  # EL, CL, SL
            
            # Check for warning: came to office on leave day
            if has_cosec_entry:
                add_warning(employee, date, 'Office visit on approved leave')
            
            return leave_type
    
    # Priority 3: Check BBHR for WFH
    for entry in bbhr_on_date:
        if entry.status == 'Approved' and entry.category == 'Work from Home':
            return 'WFH'
    
    # Priority 4: Check Cosec for presence
    if has_cosec_entry:
        return 'P'
    
    # Priority 5: Check for requested (not approved) leaves
    for entry in bbhr_on_date:
        if entry.status == 'Requested':
            add_critical_gap(employee, date, 'Pending manager approval')
            return '?'  # Missing data due to unapproved leave
    
    # Priority 6: No data found (weekday gap)
    if is_weekday(date):
        add_critical_gap(employee, date, 'Missing attendance/leave data')
        return '?'
    
    return '-'  # Fallback


def is_gap(status, date, holiday_calendar):
    """
    Determine if a status represents a gap
    """
    if status == '?':
        return True  # Critical gap
    
    if status in ['EL', 'CL', 'SL'] and has_cosec_entry:
        return True  # Warning: office on leave
    
    return False
```

---

## 10. UI/UX Requirements

### 10.1 Layout & Navigation

**Page Structure:**
1. **Dashboard/Home**
   - "New Attendance Report" button (prominent)
   - "View Previous Reports" link
   - Recent activity feed (last 3 reports)

2. **Upload Wizard** (3 steps)
   - Breadcrumb navigation: Step 1 → Step 2 → Step 3
   - Back button to previous step
   - Progress indicator (1 of 3, 2 of 3, 3 of 3)

3. **Processing Screen**
   - Full-screen overlay
   - Large progress bar
   - Status messages
   - "Cancel" button (if technically feasible)

4. **Gap Summary Dashboard**
   - Two-column layout:
     - Left: Summary cards (counts)
     - Right: Detailed lists (expandable)
   - Top: Download button + Process New button

### 10.2 Visual Design

**Color Palette:**
- Primary: Blue (#2563EB) for actions/buttons
- Success: Green (#10B981) for completed steps
- Warning: Yellow (#F59E0B) for warnings
- Error: Red (#EF4444) for critical gaps
- Neutral: Gray (#6B7280) for text/borders

**Typography:**
- Headings: Sans-serif, bold
- Body: Sans-serif, regular
- Data tables: Monospace for alignment

**Icons:**
- Upload: ↑ arrow
- Success: ✓ checkmark
- Error: ✕ cross
- Warning: ⚠ triangle
- Info: ℹ circle

### 10.3 Responsive Behavior

**Desktop Only (MVP):**
- Minimum width: 1366px
- Fixed layout (no mobile adaptation)
- Horizontal scrolling for date columns in preview

### 10.4 Loading & Error States

**Loading States:**
- File upload: Spinner + "Uploading..."
- Validation: Spinner + "Validating file..."
- Processing: Progress bar + percentage + status message

**Error States:**
- Inline error messages below file upload input
- Modal popup for critical errors (processing failure)
- Toast notifications for success (download complete)

**Empty States:**
- No previous reports: "You haven't processed any reports yet. Click 'New Attendance Report' to get started."

---

## 11. Technical Architecture

### 11.1 Tech Stack Recommendations

**Frontend:**
- Next.js 16 (React 19) - per project standards
- Tailwind CSS 4 - per project standards
- shadcn/ui components - per project standards
- React Query for data fetching

**Backend:**
- Next.js API routes (internal APIs)
- File processing: Node.js + ExcelJS library
- Business logic in `/src/lib/` services

**Database:**
- Supabase (PostgreSQL)
- Tables: employees, holidays, processed_reports, attendance_records, gap_detections

**File Storage:**
- Temporary: Server file system (deleted after processing)
- Results: Generate Excel on-demand from DB data

**Authentication:**
- NextAuth (if multi-user)
- Simple email/password for MVP

### 11.2 API Endpoints

**Internal APIs (Dashboard UI Only):**

```
POST /api/upload/cosec
- Accepts: multipart/form-data (.xlsx file)
- Returns: { validation_status, preview_data, summary }

POST /api/upload/bbhr
- Accepts: multipart/form-data (.xlsx file)
- Returns: { validation_status, preview_data, summary }

POST /api/upload/employee-master
- Accepts: multipart/form-data (.xlsx file)
- Returns: { validation_status, preview_data, summary }

POST /api/process-attendance
- Accepts: { cosec_file_id, bbhr_file_id, master_file_id, date_range }
- Returns: { report_id, status }
- Long-running: Use polling or WebSocket for progress updates

GET /api/process-attendance/status/:report_id
- Returns: { progress_percentage, status_message, completed }

GET /api/reports/:report_id
- Returns: { report_data, gaps, warnings }

GET /api/reports/:report_id/download
- Returns: Excel file stream
- Content-Disposition: attachment; filename="Attendance_Report_December_2025.xlsx"

GET /api/reports
- Returns: List of previous reports (pagination optional)

GET /api/processing-lock
- Returns: { locked, locked_by, started_at }

POST /api/processing-lock/acquire
- Acquires lock if available
- Returns: { success, lock_token }

POST /api/processing-lock/release
- Releases lock
- Requires: lock_token
```

### 11.3 Security Architecture

**Per Project Standards:**
- All `/api/*` endpoints use `validateInternalRequest()` guard
- Require NextAuth session
- Reject cross-origin requests (no CORS for MVP)
- Block external tools (curl, Postman)

**File Upload Security:**
- Validate file type (.xlsx only)
- Limit file size (10 MB max)
- Scan for malicious content (optional: antivirus integration)
- Store files in isolated temporary directory

**Data Access:**
- Row-level security in Supabase (if multi-tenant future)
- HR managers can only see their organization's data

### 11.4 File Processing Pipeline

```
1. Upload → Temporary storage (server /tmp or memory)
2. Validation → ExcelJS parse, column check
3. Preview generation → Extract first 10 rows + metadata
4. User confirmation → Store validated file ID in session
5. Processing → Load all 3 files, execute business logic
6. Gap detection → Flag issues per employee per date
7. Result storage → Save to database (structured data)
8. Excel generation → Create .xlsx from DB data on download
9. Cleanup → Delete temporary files
```

---

## 12. Acceptance Criteria

### AC-1: File Upload & Validation

**Given** an HR manager on the upload wizard  
**When** they upload a valid Cosec dump file  
**Then** the system displays a preview with first 10 rows and summary stats  
**And** the "Confirm & Continue" button is enabled

**Given** an HR manager uploads an invalid file (wrong columns)  
**When** the system validates the file  
**Then** an error message lists expected vs actual columns  
**And** the "Confirm & Continue" button is disabled  
**And** a "Re-upload" option is available

### AC-2: Employee Matching

**Given** all uploaded files contain matching employee numbers  
**When** processing starts  
**Then** all employees are matched successfully across Cosec, BBHR, and Employee Master

**Given** an employee exists in Cosec but not in Employee Master  
**When** processing reaches employee matching  
**Then** processing is paused with an error  
**And** HR is prompted to add missing employee details or upload updated master

### AC-3: Day Classification

**Given** a weekday with Cosec entry and no BBHR entry  
**When** processing that date  
**Then** the day is marked as "P" (Present)

**Given** a weekday with approved EL in BBHR and Cosec entry  
**When** processing that date  
**Then** the day is marked as "EL"  
**And** a warning is flagged: "Came to office on approved leave"

**Given** a Saturday with no Cosec entry and no BBHR entry  
**When** processing that date  
**Then** the day is marked as "-" (Weekend off)

**Given** a holiday with Cosec entry  
**When** processing that date  
**Then** the day is marked as "P" (Worked on holiday)  
**And** it counts toward "No. of days present"

**Given** a weekday with "Requested" leave in BBHR and no Cosec entry  
**When** processing that date  
**Then** the day is marked as "?" (Missing data)  
**And** a critical gap is flagged: "Pending manager approval"

### AC-4: Metrics Calculation

**Given** an employee with 10 "P" days, 3 "EL" days, 5 "WFH" days, 2 "?" days  
**When** calculating metrics  
**Then**:
- No. of days present = 10
- No. of days absent = 3
- WFH = 5
- Days with no data = 2

### AC-5: Gap Detection

**Given** processing completes with 2 employees having missing data and 1 with a warning  
**When** displaying the Gap Summary Dashboard  
**Then**:
- Critical Gaps count = 2
- Warnings count = 1
- Detailed lists show employee names, dates affected, and issue types

### AC-6: Excel Download

**Given** an HR manager clicks "Download Excel Report"  
**When** the download completes  
**Then**:
- File is named `Attendance_Report_[Month]_[Year].xlsx`
- Sheet 1 contains attendance template with correct structure
- Sheet 2 contains gap details with all fields populated
- Cells with critical gaps have red background
- Cells with warnings have yellow background

**Given** the downloaded Excel file  
**When** comparing with manual process output  
**Then** calculations match 100% (zero tolerance for errors)

### AC-7: Processing Lock

**Given** User A is processing a report  
**When** User B tries to start processing  
**Then** User B sees a message: "Processing in progress by [User A]"  
**And** the "Start Processing" button is disabled

**Given** User A completes processing  
**When** User B refreshes the page  
**Then** the lock is released  
**And** User B can start a new processing session

### AC-8: Error Recovery

**Given** processing fails midway due to system error  
**When** the error occurs  
**Then**:
- A clear error message is displayed
- All uploaded files are deleted
- No partial results are saved
- User can restart from Step 1 without system restart

### AC-9: Performance

**Given** 1000 employees and date range of 31 days  
**When** processing starts  
**Then** processing completes within 5 minutes  
**And** progress updates are displayed every 5 seconds

### AC-10: Data Storage

**Given** processing completes successfully  
**When** checking the database  
**Then**:
- Processed report record is saved with report_id
- All attendance records are saved
- All gap detection records are saved
- Uploaded files are deleted from temporary storage

---

## 13. Testing Strategy

### 13.1 Test Cases

**Category 1: File Upload**
- TC-001: Upload valid Cosec file → Success
- TC-002: Upload invalid Cosec file (wrong columns) → Error
- TC-003: Upload file >10 MB → Error
- TC-004: Upload non-.xlsx file → Error
- TC-005: Re-upload after error → Success

**Category 2: Data Validation**
- TC-006: All employees matched across files → Success
- TC-007: Employee in Cosec but not in master → Error prompt
- TC-008: Duplicate employee numbers → Error
- TC-009: Invalid date formats → Error

**Category 3: Business Logic**
- TC-010: Weekday + Cosec entry + No BBHR → "P"
- TC-011: Weekday + No Cosec + Approved EL → "EL"
- TC-012: Weekday + Cosec + Approved EL → "EL" + Warning
- TC-013: Weekend + No Cosec → "-"
- TC-014: Weekend + Cosec → "P"
- TC-015: Holiday + Cosec → "P"
- TC-016: Weekday + No Cosec + No BBHR → "?" + Critical Gap
- TC-017: Weekday + No Cosec + Requested Leave → "?" + Critical Gap
- TC-018: WFH + Cosec → "WFH" (no warning)
- TC-019: Multiple BBHR entries (Leave + WFH) → Leave priority

**Category 4: Metrics**
- TC-020: Calculate days present correctly
- TC-021: Calculate days absent correctly
- TC-022: Calculate WFH days correctly
- TC-023: Calculate days with no data correctly
- TC-024: Leave balances match BBHR values

**Category 5: Gap Detection**
- TC-025: Detect all missing data gaps
- TC-026: Detect all pending approval gaps
- TC-027: Detect all warnings (office on leave)
- TC-028: Gap summary counts accurate
- TC-029: Gap details list all affected dates

**Category 6: Excel Output**
- TC-030: Sheet 1 structure matches template
- TC-031: Sheet 2 contains all gap records
- TC-032: Color coding applied correctly (red/yellow)
- TC-033: File named correctly
- TC-034: Download multiple times → Same file

**Category 7: Concurrency**
- TC-035: User A processing → User B blocked
- TC-036: User A completes → User B unblocked
- TC-037: Multiple users view results → No conflicts

**Category 8: Performance**
- TC-038: 100 employees → <1 minute
- TC-039: 500 employees → <3 minutes
- TC-040: 1000 employees → <5 minutes
- TC-041: Progress updates display correctly

**Category 9: Error Handling**
- TC-042: Processing fails → Error message + Cleanup
- TC-043: File corruption → Graceful error
- TC-044: Database error → Rollback + Error

### 13.2 QA Validation Plan

**Phase 1: Manual Validation (Week 1)**
- Test with existing manually-processed files (December 2025 sample)
- Compare tool output vs manual output cell-by-cell
- Verify 100% calculation match
- Test all 44 test cases above

**Phase 2: Edge Case Testing (Week 2)**
- Test with boundary conditions:
  - 0 employees
  - 1 employee
  - 1000 employees
  - Date range: 1 day, 7 days, 31 days, 90 days
- Test with data quality issues:
  - Missing columns
  - Extra columns
  - Duplicate rows
  - Empty cells
  - Special characters in names

**Phase 3: Historical Data Validation (Week 3)**
- Upload 6 months of historical files (June-December 2025)
- Compare tool outputs with actual payroll records
- Identify any discrepancies
- Document gap detection accuracy (Did it find issues missed manually?)

**Phase 4: User Acceptance Testing (Week 4)**
- 3-4 HR managers use the tool in parallel
- Process January 2026 data (live test)
- Gather feedback on usability, speed, accuracy
- Identify any workflow blockers

**Phase 5: Production Pilot (Month 2)**
- Run tool alongside manual process for February 2026
- Compare outputs
- If 100% match → Transition fully to tool for March 2026
- Monitor for 3 consecutive cycles (March, April, May) for adoption success

---

## 14. Future Enhancements (Post-MVP)

### P1 (High Priority - Next Version)

**Email Notifications**
- Automated emails to employees with missing data
- Emails to managers for pending leave approvals
- Email templates with personalized content
- Notification tracking (sent, opened, acted upon)

**Historical Report Management**
- Search and filter previous reports
- Compare reports month-over-month
- Trends/analytics dashboard (average WFH days, leave patterns)

**Employee Self-Service**
- Portal for employees to view their own attendance
- Dispute submission workflow

### P2 (Medium Priority)

**Advanced Gap Detection**
- ML-based anomaly detection (e.g., unusual leave patterns)
- Predictive alerts (e.g., "Employee may not have applied leave for upcoming date")

**API Integrations**
- Direct Cosec API integration (no manual export)
- BBHR API integration (real-time leave data)
- Slack/Teams notifications

**Approval Workflows**
- In-app leave approval for managers
- Attendance correction requests

### P3 (Low Priority / Nice-to-Have)

**Multi-Tenancy**
- Support multiple organizations
- Organization-level customization (different leave policies, holidays)

**Mobile App**
- Mobile view for managers to review/approve on-the-go

**Advanced Analytics**
- Department-wise attendance trends
- Location-wise WFH patterns
- Export to BI tools (Power BI, Tableau)

**Audit Trail**
- Track all changes to attendance records
- Compliance reporting (e.g., GDPR data access logs)

---

## 15. Appendix

### A. Sample Data Files

**Referenced Files:**
- `Cosec_Dump_rptviewer.md` - Cosec attendance export sample
- `BBHR_Time_Off_Schedule_(CoreStack).md` - BBHR leave data sample
- `Emp_Attendance_Template.md` - Desired output template
- `employee_information.md` - Employee master data structure
- `India_Holiday_List_2026.md` - Holiday calendar structure

### B. Glossary

- **Cosec**: Physical access control system tracking employee entry/exit via door swipes
- **BBHR**: BambooHR, leave management system
- **EL**: Earned Leave
- **CL**: Casual Leave
- **SL**: Sick Leave
- **WFH**: Work From Home
- **P**: Present (attended office)
- **RM**: Reporting Manager
- **Gap**: Missing or inconsistent attendance/leave data

### C. Dependencies

**External Systems:**
- Cosec attendance system (export only, no integration)
- BBHR (export only, no integration)
- Supabase/PostgreSQL (database)

**Internal Dependencies:**
- Employee Master data (maintained by HR)
- Holiday Calendar (updated annually)

### D. Assumptions

1. Employee numbers are unique and consistent across systems
2. Cosec and BBHR export formats remain stable
3. BBHR leave balance calculations are accurate (trusted source)
4. HR managers have desktop Chrome browsers
5. Files are exported monthly, processed once per month
6. Weekend = Saturday + Sunday (no regional variations in MVP)
7. Holidays apply to all locations (no location-specific handling in MVP)

### E. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Calculation errors | High | Medium | 100% QA validation, historical data testing |
| File format changes | Medium | Low | Column validation, error messages |
| Processing timeout | Medium | Medium | Optimize code, allow 5-minute timeout |
| User adoption resistance | Medium | Medium | Parallel run with manual process, training |
| Database downtime | High | Low | Supabase SLA, backup plan (manual process) |

---

## Sign-Off

**Product Manager:** _________________ Date: _______

**Engineering Lead:** _________________ Date: _______

**QA Lead:** _________________ Date: _______

**HR Manager (Stakeholder):** _________________ Date: _______

---

**Document Control:**
- **Version:** 1.0
- **Last Updated:** January 21, 2026
- **Next Review:** Upon MVP completion
- **Distribution:** Product, Engineering, QA, HR Teams

---

**END OF PRD**
