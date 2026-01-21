# UX Structure Plan - Track-It
## Attendance Data Processing Tool

**Version:** 1.0  
**Date:** January 21, 2026  
**Based on:** PRD v1.0  
**Status:** Ready for Design & Development

---

## Table of Contents
1. [Information Architecture](#1-information-architecture)
2. [Page Structure & Layouts](#2-page-structure--layouts)
3. [Component Hierarchy](#3-component-hierarchy)
4. [Detailed Screen Specifications](#4-detailed-screen-specifications)
5. [Interaction Patterns](#5-interaction-patterns)
6. [State Management](#6-state-management)
7. [Navigation & Routing](#7-navigation--routing)
8. [Responsive Behavior](#8-responsive-behavior)
9. [Accessibility Considerations](#9-accessibility-considerations)

---

## 1. Information Architecture

### 1.1 Site Map

```
Track-It Application
│
├── Authentication (Future - MVP: Single User)
│   ├── Login
│   └── Logout
│
├── Dashboard (Home)
│   ├── New Report CTA
│   ├── Recent Reports List
│   └── Quick Stats
│
├── Upload Wizard (Multi-Step)
│   ├── Step 1: Upload Cosec Dump
│   ├── Step 2: Upload BBHR Time-Off
│   └── Step 3: Upload Employee Master
│
├── Processing Screen
│   ├── Progress Indicator
│   └── Status Messages
│
├── Results Dashboard
│   ├── Summary Cards
│   ├── Gap Details
│   ├── Warning Details
│   └── Download Action
│
└── Previous Reports (Future)
    ├── Report List
    └── Report Details
```

### 1.2 User Journey Map

```
Entry Point → Dashboard → Upload Wizard → Processing → Results → Download → Exit

Alternative Paths:
- Dashboard → View Previous Report → Download
- Upload Wizard → Error → Re-upload → Continue
- Processing → Error → Dashboard (restart)
```

### 1.3 Content Hierarchy

**Priority 1 (Critical):**
- File upload interface
- Validation feedback
- Processing status
- Gap summary
- Download button

**Priority 2 (Important):**
- Preview tables
- Summary statistics
- Detailed gap lists
- Navigation controls

**Priority 3 (Supporting):**
- Help text
- Recent activity
- System messages

---

## 2. Page Structure & Layouts

### 2.1 Layout System

**Grid System:**
- 12-column grid
- Container max-width: 1280px
- Gutter: 24px
- Margin: auto (centered)

**Breakpoints (Future):**
- Desktop: ≥1366px (MVP target)
- Future: Tablet, Mobile

### 2.2 Common Layout Elements

#### Header (Global)
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] Track-It        [Dashboard] [Reports] [Profile] │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Logo/Brand (left)
- Navigation menu (center)
- User profile dropdown (right)

**Height:** 64px
**Position:** Fixed top

#### Main Content Area
```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                    [Page Content]                         │
│                                                           │
│                  (Variable Height)                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Padding:** 40px vertical, 24px horizontal
**Background:** #FAFAFA (light gray)

#### Footer (Optional for MVP)
```
┌─────────────────────────────────────────────────────────┐
│              © 2026 Track-It | Support | Privacy         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Component Hierarchy

### 3.1 Atomic Design Structure

#### Atoms (Basic Building Blocks)
```typescript
- Button (Primary, Secondary, Danger, Ghost)
- Input (Text, File, Date)
- Label
- Icon (Upload, Check, Error, Warning, Info)
- Badge (Status indicator)
- Spinner (Loading)
- Progress Bar
- Tooltip
- Typography (H1, H2, H3, Body, Caption)
```

#### Molecules (Simple Combinations)
```typescript
- FileUploadInput (Input + Label + Help Text)
- StatusMessage (Icon + Text)
- SummaryCard (Icon + Number + Label)
- TableRow (Cells + Actions)
- BreadcrumbItem (Icon + Text + Separator)
- ErrorMessage (Icon + Text + Dismiss)
```

#### Organisms (Complex Components)
```typescript
- Header (Logo + Nav + Profile)
- UploadCard (Title + FileInput + Preview + Actions)
- DataPreviewTable (Header + Rows + Pagination)
- GapListSection (Title + Filter + List + Actions)
- ProcessingModal (Progress + Status + Cancel)
- SummaryDashboard (Cards + Charts + Actions)
```

#### Templates (Page Layouts)
```typescript
- DashboardLayout (Header + Sidebar + Content)
- WizardLayout (Header + Stepper + Content + Actions)
- FullScreenModal (Overlay + Content)
- ResultsLayout (Header + Summary + Details)
```

#### Pages (Complete Views)
```typescript
- DashboardPage
- UploadWizardPage
- ProcessingPage
- ResultsPage
- ErrorPage
```

---

## 4. Detailed Screen Specifications

### 4.1 Dashboard / Home Page

#### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│                        HEADER                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Welcome Back, HR Manager                 │ │
│  │         Last report: December 2025 (3 days ago)      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  [📊 Icon]    NEW ATTENDANCE REPORT                   │ │
│  │                                                        │ │
│  │  Process attendance data for the current month        │ │
│  │                                                        │ │
│  │              [ Create New Report → ]                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Recent Reports                          [View All →]     │
│  ┌────────────────┬────────────┬──────────┬────────────┐ │
│  │ Month          │ Processed  │ Status   │ Actions    │ │
│  ├────────────────┼────────────┼──────────┼────────────┤ │
│  │ December 2025  │ Jan 18     │ ✓ Done   │ [Download] │ │
│  │ November 2025  │ Dec 20     │ ✓ Done   │ [Download] │ │
│  │ October 2025   │ Nov 18     │ ✓ Done   │ [Download] │ │
│  └────────────────┴────────────┴──────────┴────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Components Breakdown

**1. Hero Section**
- **Component:** `HeroCard`
- **Content:**
  - Welcome message (personalized)
  - Last report info with relative timestamp
- **Styling:**
  - Background: White
  - Padding: 32px
  - Border-radius: 8px
  - Box-shadow: Subtle

**2. CTA Card**
- **Component:** `CallToActionCard`
- **Content:**
  - Icon (large, 64px)
  - Title: "NEW ATTENDANCE REPORT"
  - Description text
  - Primary action button
- **Styling:**
  - Background: Gradient (Blue to Light Blue)
  - Padding: 48px
  - Border-radius: 12px
  - Hover effect: Slight lift + shadow increase

**3. Recent Reports Table**
- **Component:** `RecentReportsTable`
- **Columns:**
  - Month (formatted: "December 2025")
  - Processed Date (relative: "3 days ago")
  - Status (badge with icon)
  - Actions (download button)
- **Features:**
  - Max 5 rows
  - "View All" link to full history (future)
  - Row hover effect
  - Responsive column widths

#### Interactions

**Primary Actions:**
1. **Create New Report**
   - Click → Navigate to Upload Wizard
   - Track event: "report_creation_started"

2. **Download Report**
   - Click → Trigger file download
   - Show toast: "Report downloaded successfully"

3. **View All Reports** (Future)
   - Click → Navigate to Reports history page

#### States

**Loading State:**
```
┌────────────────────────────────────┐
│  [Spinner] Loading dashboard...   │
└────────────────────────────────────┘
```

**Empty State (No Reports):**
```
┌────────────────────────────────────┐
│     [📊 Empty Icon]                │
│                                    │
│  No reports yet                    │
│  Create your first report          │
│                                    │
│  [ Create New Report → ]           │
└────────────────────────────────────┘
```

---

### 4.2 Upload Wizard - Step 1: Cosec Dump

#### Layout Structure
```
┌────────────────────────────────────────────────────────────┐
│                        HEADER                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Step 1 of 3                                          │ │
│  │  ●──────○──────○    Upload Cosec Dump                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  Upload Cosec Attendance Dump                         │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐│ │
│  │  │                                                    ││ │
│  │  │         [📁 Upload Icon]                          ││ │
│  │  │                                                    ││ │
│  │  │    Drag & drop your .xlsx file here               ││ │
│  │  │              or click to browse                    ││ │
│  │  │                                                    ││ │
│  │  │    Supported: .xlsx files only (max 10 MB)        ││ │
│  │  └──────────────────────────────────────────────────┘│ │
│  │                                                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│                    [← Back]     [Cancel]                   │
└────────────────────────────────────────────────────────────┘
```

#### Components Breakdown

**1. Progress Stepper**
- **Component:** `ProgressStepper`
- **Props:**
  - `currentStep: 1`
  - `totalSteps: 3`
  - `steps: ['Cosec', 'BBHR', 'Master']`
- **Visual:**
  - Current step: Filled circle
  - Future steps: Empty circle
  - Completed steps: Check icon (future states)
  - Line connecting steps

**2. Upload Area**
- **Component:** `FileUploadDropzone`
- **Features:**
  - Drag & drop support
  - Click to open file picker
  - File type validation (.xlsx only)
  - File size validation (max 10 MB)
  - Visual feedback on drag hover
- **States:**
  - Default (empty)
  - Drag over (highlighted border)
  - Uploading (progress bar)
  - Success (checkmark + filename)
  - Error (error icon + message)

**3. Help Text**
- **Component:** `HelpText`
- **Content:**
  - File format requirements
  - Size limitations
  - Link to sample file (future)

#### Interactions

**File Upload Flow:**

**Step 1: Select File**
```
User Action: Click upload area OR drag file
↓
System: Open file picker dialog OR accept drop
↓
Validation: Check file type (.xlsx) and size (<10 MB)
↓
If Valid: Show uploading state
If Invalid: Show error message + allow retry
```

**Step 2: Upload & Validate**
```
┌────────────────────────────────────┐
│  Cosec_December_2025.xlsx          │
│  [████████░░] 80% Uploading...     │
└────────────────────────────────────┘

↓ (After upload completes)

API Call: POST /api/upload/cosec
- Validate columns
- Parse first 10 rows
- Generate summary stats

↓ (If validation passes)

Show: Preview section (slides in from bottom)
```

**Step 3: Preview & Confirm**
```
┌────────────────────────────────────────────────────────────┐
│  ✓ File uploaded successfully: Cosec_December_2025.xlsx    │
│                                                             │
│  Preview (First 10 rows)                    [Re-upload]    │
│  ┌───────────┬──────────────┬──────────┬──────────┐       │
│  │ User ID   │ Name         │ First IN │ Last OUT │       │
│  ├───────────┼──────────────┼──────────┼──────────┤       │
│  │ 101054    │ Ramasamy S   │          │          │       │
│  │ 101108    │ Ponraj S     │          │          │       │
│  │ ...       │ ...          │ ...      │ ...      │       │
│  └───────────┴──────────────┴──────────┴──────────┘       │
│                                                             │
│  Summary                                                    │
│  • 8 employees found                                        │
│  • Date range: December 1-31, 2025 (31 days)              │
│  • 248 total records                                        │
│                                                             │
│                        [Confirm & Continue →]               │
└────────────────────────────────────────────────────────────┘
```

#### Error States

**Validation Error:**
```
┌────────────────────────────────────────────────────────────┐
│  ✕ File validation failed                                  │
│                                                             │
│  Column mismatch detected                                  │
│                                                             │
│  Expected columns:                                          │
│  • User ID                                                  │
│  • Name                                                     │
│  • First IN                                                 │
│  • Last OUT                                                 │
│                                                             │
│  Found columns:                                             │
│  • User ID                                                  │
│  • Employee Name  ← Should be "Name"                       │
│  • Login Time     ← Should be "First IN"                   │
│  • Logout Time    ← Should be "Last OUT"                   │
│                                                             │
│  Please check your file format and try again.              │
│                                                             │
│              [Re-upload]      [Download Sample]            │
└────────────────────────────────────────────────────────────┘
```

---

### 4.3 Upload Wizard - Step 2: BBHR Time-Off

#### Layout Structure
(Similar to Step 1, with Step 2 highlighted in progress stepper)

```
┌────────────────────────────────────────────────────────────┐
│  Step 2 of 3                                               │
│  ●──────●──────○    Upload BBHR Time-Off Schedule         │
└────────────────────────────────────────────────────────────┘
```

#### Unique Features

**Preview Table Columns:**
- Employee Number
- Name
- From (date)
- To (date)
- Category
- Amount
- Status

**Summary Stats:**
- X leave requests found
- Y employees with leaves
- Date range: [earliest] to [latest]
- Breakdown: X Approved, Y Requested

---

### 4.4 Upload Wizard - Step 3: Employee Master

#### Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│  Step 3 of 3                                               │
│  ●──────●──────●    Upload Employee Master & Holidays     │
└────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  Employee Master                                          │
  │                                                            │
  │  ⚙ Use Previously Uploaded Master                        │
  │  ○ Last updated: November 15, 2025 (85 employees)        │
  │                                                            │
  │  ○ Upload New Master                                      │
  │    [Upload .xlsx file]                                    │
  └──────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │  Holiday Calendar                                         │
  │                                                            │
  │  ⚙ Use 2026 Holiday Calendar                             │
  │  ○ Last updated: January 1, 2026 (13 holidays)           │
  │                                                            │
  │  ○ Upload New Calendar                                    │
  │    [Upload .xlsx file]                                    │
  └──────────────────────────────────────────────────────────┘

                    [← Back]     [Start Processing →]
```

#### Components Breakdown

**1. Master Data Selection**
- **Component:** `MasterDataSelector`
- **Type:** Radio group with conditional upload
- **Options:**
  - Use previous (default if exists)
  - Upload new
- **Shows:** Last upload metadata when "use previous" selected

**2. Holiday Calendar Selection**
- **Component:** `HolidayCalendarSelector`
- **Similar to Master Data Selector**

**3. Action Buttons**
- Back: Returns to Step 2
- Start Processing: 
  - Validates all selections
  - Initiates processing
  - Navigates to Processing screen

---

### 4.5 Processing Screen

#### Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│                    FULL SCREEN OVERLAY                      │
│                   (Semi-transparent backdrop)               │
│                                                             │
│          ┌──────────────────────────────────┐             │
│          │                                   │             │
│          │     Processing Attendance Data    │             │
│          │                                   │             │
│          │   ████████████████░░░░░░  75%    │             │
│          │                                   │             │
│          │   📊 Detecting gaps...            │             │
│          │                                   │             │
│          │   ✓ Validated files               │             │
│          │   ✓ Matched employees             │             │
│          │   ✓ Processed attendance          │             │
│          │   ⏳ Detecting gaps...            │             │
│          │   ⋯ Generating report             │             │
│          │                                   │             │
│          │   Estimated: 1 minute remaining   │             │
│          │                                   │             │
│          └──────────────────────────────────┘             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

#### Components Breakdown

**1. Modal Container**
- **Component:** `ProcessingModal`
- **Behavior:**
  - Cannot be dismissed by clicking backdrop
  - Escape key disabled
  - Full-screen overlay
  - Centered modal (max-width: 500px)

**2. Progress Bar**
- **Component:** `ProgressBar`
- **Features:**
  - Smooth animation
  - Percentage display
  - Color: Blue gradient
  - Height: 12px

**3. Status List**
- **Component:** `ProcessingStatusList`
- **Items:**
  - Completed: ✓ Check icon + Green text
  - In Progress: ⏳ Spinner + Blue text
  - Pending: ⋯ Dots + Gray text
- **Animation:** Fade in as each step completes

**4. Estimated Time**
- **Component:** `EstimatedTime`
- **Updates:** Every 5 seconds
- **Format:** "X minutes Y seconds remaining"

#### Real-Time Updates

**WebSocket/Polling Pattern:**
```typescript
// Frontend polls every 2 seconds
GET /api/process-attendance/status/:reportId

Response:
{
  progress: 75,
  currentStep: "detecting_gaps",
  stepsCompleted: ["validate", "match", "process"],
  estimatedTimeRemaining: 60, // seconds
  status: "processing"
}
```

**State Transitions:**
```
uploading (0%) → 
validating (10%) → 
matching_employees (25%) → 
processing_attendance (50%) → 
detecting_gaps (75%) → 
generating_report (90%) → 
complete (100%)
```

---

### 4.6 Results Dashboard

#### Layout Structure

```
┌────────────────────────────────────────────────────────────┐
│                        HEADER                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ✓ Processing Complete                                │ │
│  │  Attendance Report for December 2025                  │ │
│  │                                                        │ │
│  │  [📥 Download Excel Report]  [🔄 Process New Report] │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Summary                                                   │
│  ┌─────────────┬─────────────┬─────────────┬───────────┐ │
│  │ 📊          │ 🔴          │ ⚠️          │ ✅         │ │
│  │ Total       │ Critical    │ Warnings    │ Clean     │ │
│  │ Employees   │ Gaps        │             │ Records   │ │
│  │             │             │             │           │ │
│  │    1000     │      45     │      12     │    943    │ │
│  └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                            │
│  Date Range: December 1-31, 2025 (31 days)               │
│  Processed: January 21, 2026 at 10:35 AM                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  🔴 Critical Gaps (45 employees)         [Export]    │ │
│  │                                                        │ │
│  │  [Search employees...]                  [Filter ▼]   │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Emp# 101312 - Akashnikhil V            [View]  │  │ │
│  │  │ Issue: Missing Data                             │  │ │
│  │  │ Dates: Dec 10, 12, 15, 18, 22                  │  │ │
│  │  │ Manager: Vidya Sagar Karnati                    │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Emp# 101319 - Sujai R                  [View]  │  │ │
│  │  │ Issue: Pending Approval                         │  │ │
│  │  │ Dates: Dec 24-31 (8 days)                      │  │ │
│  │  │ Manager: Vidya Sagar Karnati                    │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  [Show more...]                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ⚠️ Warnings (12 employees)              [Export]    │ │
│  │                                                        │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ Emp# 101154 - Seshan K B               [View]  │  │ │
│  │  │ Issue: Office Visit on Approved Leave           │  │ │
│  │  │ Dates: Dec 26                                   │  │ │
│  │  │ Manager: Vidya Sagar Karnati                    │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  [Show more...]                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Components Breakdown

**1. Success Banner**
- **Component:** `SuccessBanner`
- **Content:**
  - Success icon + message
  - Report title
  - Primary actions (Download, New Report)
- **Styling:**
  - Background: Light green
  - Border: Green
  - Prominent placement at top

**2. Summary Cards**
- **Component:** `SummaryCard`
- **Props:**
  - `icon: string`
  - `label: string`
  - `value: number`
  - `variant: 'default' | 'critical' | 'warning' | 'success'`
- **Layout:** 4-column grid
- **Responsive:** Stack on smaller screens (future)

**3. Gap List Section**
- **Component:** `GapListSection`
- **Features:**
  - Collapsible (expand/collapse)
  - Search bar
  - Filter dropdown (by manager, date range)
  - Export to CSV option
  - Pagination (show 10, load more)

**4. Gap Item Card**
- **Component:** `GapItemCard`
- **Content:**
  - Employee number + name
  - Issue type badge
  - Affected dates (formatted)
  - Manager name
  - View details button
- **Styling:**
  - Border: Left colored bar (red for critical, yellow for warning)
  - Hover: Slight shadow
  - Clickable: Expands to show more details

#### Interactions

**Download Report:**
```
User clicks "Download Excel Report"
↓
System: Generate Excel from DB data
↓
Browser: Download file
↓
Show toast notification: "Report downloaded successfully"
```

**View Gap Details:**
```
User clicks "View" on gap item
↓
Expand card to show:
- Full list of affected dates (calendar view)
- Employee email
- Action suggestions
- Copy employee details button
```

**Process New Report:**
```
User clicks "Process New Report"
↓
Confirm dialog: "Current results will be cleared. Continue?"
↓
If Yes: Navigate to Upload Wizard (Step 1)
If No: Stay on Results page
```

---

### 4.7 Error Pages

#### Generic Error Page
```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│                    [⚠️ Large Icon]                         │
│                                                             │
│               Oops! Something went wrong                    │
│                                                             │
│  We encountered an unexpected error while processing        │
│  your request. This has been logged and our team will       │
│  look into it.                                              │
│                                                             │
│              [← Back to Dashboard]                          │
│                                                             │
│  Error ID: ERR-20260121-1035-A4B2                          │
│  Time: January 21, 2026 at 10:35 AM                        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

#### Processing Timeout Error
```
┌────────────────────────────────────────────────────────────┐
│                    [⏱️ Clock Icon]                          │
│                                                             │
│            Processing Timeout                               │
│                                                             │
│  Processing took longer than expected (>5 minutes).         │
│  This may be due to large file size or system load.        │
│                                                             │
│  What to do:                                                │
│  • Retry with smaller date range                           │
│  • Check if files are corrupted                            │
│  • Contact support if issue persists                        │
│                                                             │
│      [Try Again]        [Contact Support]                  │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Interaction Patterns

### 5.1 Micro-interactions

#### Button Hover
```css
Default: 
  background: #2563EB
  transform: scale(1)
  shadow: 0 2px 4px rgba(0,0,0,0.1)

Hover:
  background: #1D4ED8
  transform: scale(1.02)
  shadow: 0 4px 8px rgba(0,0,0,0.15)
  transition: all 0.2s ease

Active:
  transform: scale(0.98)
```

#### File Upload Drag & Drop
```
Default state:
  border: 2px dashed #CBD5E1
  background: #F8FAFC

Drag over:
  border: 2px dashed #2563EB
  background: #EFF6FF
  cursor: copy

Drop:
  border: 2px solid #10B981
  background: #ECFDF5
  → trigger upload animation
```

#### Progress Bar Animation
```
- Smooth transition with ease-out
- Duration: 0.5s per update
- Pulse effect on current progress
- Color transition: Blue → Green when complete
```

#### Toast Notifications
```
Appearance:
  - Slide in from top-right
  - Duration: 4 seconds
  - Auto-dismiss with countdown bar
  - Hover to pause countdown
  - Click to dismiss immediately

Types:
  - Success: Green background + check icon
  - Error: Red background + X icon
  - Info: Blue background + info icon
  - Warning: Yellow background + warning icon
```

### 5.2 Loading States

#### Skeleton Screens

**Table Loading:**
```
┌────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓           │
│  ▓▓▓▓▓▓▓▓      ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓     ▓▓▓▓▓▓             │
│  ▓▓▓▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓▓    ▓▓▓▓▓▓▓            │
└────────────────────────────────────────────────────────────┘
(Animated shimmer effect)
```

**Card Loading:**
```
┌────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓                 │
│                                │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             │
│                                │
│  ▓▓▓▓▓▓▓▓     ▓▓▓▓▓▓▓▓        │
└────────────────────────────────┘
```

### 5.3 Form Validation

#### Real-Time Validation
```
Field: Email Input

States:
1. Pristine (not touched)
   - Border: Gray
   - No message

2. Focus
   - Border: Blue
   - Show hint: "Enter your work email"

3. Valid (after blur)
   - Border: Green
   - Show checkmark icon
   - Message: None

4. Invalid (after blur)
   - Border: Red
   - Show X icon
   - Message: "Please enter a valid email"
   - Example: "john@company.com"
```

---

## 6. State Management

### 6.1 Global State Structure

```typescript
interface AppState {
  user: {
    email: string;
    name: string;
    role: 'hr_manager';
    lastLogin: Date;
  };
  
  uploadWizard: {
    currentStep: 1 | 2 | 3;
    cosecFile: {
      uploaded: boolean;
      fileName: string;
      fileId: string;
      validation: ValidationResult;
      preview: PreviewData;
    };
    bbhrFile: {
      uploaded: boolean;
      fileName: string;
      fileId: string;
      validation: ValidationResult;
      preview: PreviewData;
    };
    employeeMaster: {
      useExisting: boolean;
      uploaded: boolean;
      fileName: string;
      fileId: string;
      lastUpdated: Date;
    };
    holidayCalendar: {
      useExisting: boolean;
      uploaded: boolean;
      fileName: string;
      fileId: string;
      lastUpdated: Date;
    };
  };
  
  processing: {
    status: 'idle' | 'processing' | 'completed' | 'failed';
    reportId: string;
    progress: number;
    currentStep: string;
    error: Error | null;
  };
  
  results: {
    reportId: string;
    summary: {
      totalEmployees: number;
      criticalGaps: number;
      warnings: number;
      cleanRecords: number;
    };
    gaps: GapRecord[];
    warnings: WarningRecord[];
    dateRange: { start: Date; end: Date };
    processedAt: Date;
  };
  
  processingLock: {
    isLocked: boolean;
    lockedBy: string;
    startedAt: Date;
  };
}
```

### 6.2 State Transitions

```
[Dashboard] 
    ↓ Click "New Report"
[Upload Wizard - Step 1] (state.uploadWizard.currentStep = 1)
    ↓ Upload Cosec + Validate
[Upload Wizard - Step 1 Preview] (state.uploadWizard.cosecFile.uploaded = true)
    ↓ Click "Confirm & Continue"
[Upload Wizard - Step 2] (state.uploadWizard.currentStep = 2)
    ↓ Upload BBHR + Validate
[Upload Wizard - Step 2 Preview] (state.uploadWizard.bbhrFile.uploaded = true)
    ↓ Click "Confirm & Continue"
[Upload Wizard - Step 3] (state.uploadWizard.currentStep = 3)
    ↓ Select Master + Holidays
    ↓ Click "Start Processing"
[Processing Screen] (state.processing.status = 'processing')
    ↓ Poll for updates
    ↓ Progress: 0% → 100%
[Results Dashboard] (state.processing.status = 'completed')
    ↓ Download or Process New
[Dashboard] (state reset)
```

### 6.3 Data Persistence

**Session Storage:**
- Upload wizard progress (until processing complete)
- File metadata
- Preview data

**Local Storage:**
- User preferences (future)
- Last used filters/sorting

**Database:**
- Processed reports
- Results data
- Gap records

---

## 7. Navigation & Routing

### 7.1 Route Structure

```typescript
const routes = {
  // Public routes (future with auth)
  '/login': LoginPage,
  
  // Protected routes
  '/': DashboardPage,
  '/reports/new': UploadWizardPage,
  '/reports/processing/:reportId': ProcessingPage,
  '/reports/results/:reportId': ResultsPage,
  '/reports/history': ReportsHistoryPage, // Future
  
  // Error routes
  '/error': ErrorPage,
  '*': NotFoundPage,
};
```

### 7.2 Navigation Guards

```typescript
// Protect routes that require authentication
beforeEach((to, from, next) => {
  if (requiresAuth(to) && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});

// Prevent navigation during processing
beforeEach((to, from, next) => {
  if (from.path.includes('/processing') && 
      state.processing.status === 'processing') {
    if (!confirm('Processing in progress. Are you sure you want to leave?')) {
      next(false);
    }
  }
  next();
});
```

### 7.3 Breadcrumb Navigation

```
Dashboard > New Report > Step 1
Dashboard > New Report > Step 2
Dashboard > New Report > Step 3
Dashboard > Processing
Dashboard > Results > December 2025
```

---

## 8. Responsive Behavior

### 8.1 Desktop (MVP)

**Minimum Resolution:** 1366 x 768
**Optimal Resolution:** 1920 x 1080

**Layout:**
- Fixed width container: 1280px max
- Centered with auto margins
- No fluid resizing

### 8.2 Future: Tablet & Mobile

#### Tablet (768px - 1365px)
- Stack summary cards (2x2 grid)
- Reduce table columns
- Collapse sidebar (hamburger menu)

#### Mobile (<768px)
- Single column layout
- Vertical stepper
- Bottom action bar (sticky)
- Swipe gestures for file upload

---

## 9. Accessibility Considerations

### 9.1 Keyboard Navigation

**Tab Order:**
```
Header (Logo, Nav, Profile) →
Main Action (New Report) →
Recent Reports Table →
Footer Links
```

**Keyboard Shortcuts:**
- `Ctrl/Cmd + N`: New Report
- `Ctrl/Cmd + D`: Download Report
- `Esc`: Close modal/Cancel operation
- `Enter`: Submit/Confirm action
- `←` / `→`: Navigate wizard steps

### 9.2 Screen Reader Support

**ARIA Labels:**
```html
<button aria-label="Upload Cosec attendance file">
  Upload File
</button>

<div role="progressbar" 
     aria-valuenow="75" 
     aria-valuemin="0" 
     aria-valuemax="100"
     aria-label="Processing attendance data">
  75% Complete
</div>

<div role="alert" aria-live="polite">
  File uploaded successfully
</div>
```

**Focus Management:**
- Auto-focus on file upload input when step loads
- Trap focus in modal dialogs
- Announce state changes (processing, errors)
- Skip navigation link at top

### 9.3 Color Contrast

**WCAG AA Standards:**
- Text on background: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Color Coding:**
- Don't rely on color alone
- Use icons + text labels
- Provide patterns/textures for charts

---

## 10. Component Library Reference

### 10.1 Button Variants

```typescript
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="danger">Delete</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

### 10.2 Input Components

```typescript
<Input type="text" placeholder="Enter text..." />
<Input type="email" error="Invalid email" />
<Input type="file" accept=".xlsx" />
<TextArea rows={4} placeholder="Enter notes..." />
<Select options={[...]} placeholder="Select option" />
<Checkbox label="I agree to terms" />
<Radio name="option" value="1" label="Option 1" />
```

### 10.3 Feedback Components

```typescript
<Alert variant="success">Operation successful</Alert>
<Alert variant="error">Operation failed</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="info">Information message</Alert>

<Toast 
  message="File uploaded" 
  variant="success" 
  duration={4000} 
/>

<Badge variant="success">Approved</Badge>
<Badge variant="danger">Critical</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">Info</Badge>
```

### 10.4 Data Display

```typescript
<Table 
  columns={columns}
  data={data}
  pagination
  sortable
  searchable
/>

<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>

<StatCard 
  icon="📊"
  value={1000}
  label="Total Employees"
  variant="default"
/>
```

---

## 11. Design Tokens

### 11.1 Colors

```typescript
const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#2563EB',  // Primary Blue
    600: '#1D4ED8',
    700: '#1E40AF',
  },
  success: {
    50: '#ECFDF5',
    500: '#10B981',  // Green
    600: '#059669',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',  // Yellow
    600: '#D97706',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',  // Red
    600: '#DC2626',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    500: '#6B7280',
    700: '#374151',
    900: '#111827',
  },
};
```

### 11.2 Typography

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### 11.3 Spacing

```typescript
const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
};
```

### 11.4 Shadows

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};
```

### 11.5 Border Radius

```typescript
const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  DEFAULT: '0.25rem',  // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  full: '9999px',
};
```

---

## 12. Animation Guidelines

### 12.1 Timing Functions

```typescript
const transitions = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

const durations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};
```

### 12.2 Page Transitions

```typescript
// Fade in on mount
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}

// Slide in from right
.slide-enter {
  transform: translateX(100%);
}
.slide-enter-active {
  transform: translateX(0);
  transition: transform 300ms ease-out;
}
```

---

## 13. Implementation Checklist

### Phase 1: Core Pages
- [ ] Dashboard page with CTA
- [ ] Upload Wizard (all 3 steps)
- [ ] File upload component with validation
- [ ] Preview table component

### Phase 2: Processing
- [ ] Processing modal with progress
- [ ] Real-time status updates
- [ ] Error handling

### Phase 3: Results
- [ ] Results dashboard with summary cards
- [ ] Gap list with filtering
- [ ] Excel download functionality

### Phase 4: Polish
- [ ] Loading states everywhere
- [ ] Error pages
- [ ] Toast notifications
- [ ] Micro-interactions
- [ ] Keyboard navigation
- [ ] Screen reader support

---

## 14. Next Steps

1. **Design Phase:**
   - Create high-fidelity mockups in Figma
   - Build interactive prototype
   - User testing with 2-3 HR managers

2. **Development Phase:**
   - Set up component library (shadcn/ui)
   - Implement atomic components first
   - Build pages progressively
   - Integrate with API endpoints

3. **Testing Phase:**
   - Unit tests for components
   - Integration tests for flows
   - E2E tests for critical paths
   - Accessibility audit

4. **Launch:**
   - Staging deployment
   - UAT with HR team
   - Production rollout
   - Monitor & iterate

---

**END OF UX STRUCTURE PLAN**
