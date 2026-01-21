# UI Implementation Plan - Track-It
## shadcn/ui Component Mapping

**Version:** 1.0  
**Date:** January 21, 2026  
**Based on:** UX Structure Plan v1.0  
**Status:** Ready for Implementation

---

## Table of Contents
1. [Component Library Overview](#1-component-library-overview)
2. [Global Layout Components](#2-global-layout-components)
3. [Dashboard Page Components](#3-dashboard-page-components)
4. [Upload Wizard Components](#4-upload-wizard-components)
5. [Processing Screen Components](#5-processing-screen-components)
6. [Results Dashboard Components](#6-results-dashboard-components)
7. [Error Pages Components](#7-error-pages-components)
8. [Shared Component Patterns](#8-shared-component-patterns)
9. [Installation Checklist](#9-installation-checklist)

---

## 1. Component Library Overview

### 1.1 Required shadcn/ui Components

**Core UI Components:**
- `button` - Primary actions, secondary actions, ghost buttons
- `card` - Container for content sections
- `table` - Data display for reports and previews
- `badge` - Status indicators (success, warning, error)
- `alert` - Validation messages and notifications
- `input` - Text and file inputs
- `label` - Form field labels
- `progress` - Processing progress bar
- `dialog` - Modal dialogs and confirmations
- `toast` - Notification system (sonner or react-hot-toast)
- `separator` - Visual dividers
- `skeleton` - Loading state placeholders
- `dropdown-menu` - User profile, filters
- `tabs` - Future content organization
- `tooltip` - Contextual help text
- `avatar` - User profile display
- `scroll-area` - Scrollable regions

**Form Components:**
- `form` - Form wrapper with validation
- `radio-group` - Employee master selection
- `checkbox` - Future features
- `select` - Dropdown selections

**Data Display:**
- `accordion` - Collapsible gap sections
- `collapsible` - Expandable content

### 1.2 Required shadcn/ui Blocks

**Dashboard Blocks:**
- None required for MVP (custom dashboard implementation)

**Chart Blocks (Future):**
- Analytics dashboard for post-MVP features

---

## 2. Global Layout Components

### 2.1 Header Navigation

```
Component Structure:
├── <header> (custom container)
│   ├── <div> (logo section)
│   │   └── <Link> (Next.js Link)
│   ├── <nav> (navigation menu)
│   │   ├── <Button variant="ghost"> (Dashboard)
│   │   └── <Button variant="ghost"> (Reports)
│   └── <DropdownMenu> (user profile)
│       ├── <DropdownMenuTrigger>
│       │   └── <Avatar>
│       │       ├── <AvatarImage>
│       │       └── <AvatarFallback>
│       └── <DropdownMenuContent>
│           ├── <DropdownMenuItem> (Profile)
│           ├── <DropdownMenuSeparator>
│           └── <DropdownMenuItem> (Logout)
```

**shadcn Components Used:**
- `button` (variant: ghost)
- `dropdown-menu`
- `avatar`
- `separator`

### 2.2 Main Content Container

```
Component Structure:
├── <main> (custom container with mx-auto)
│   └── <div className="container max-w-7xl mx-auto px-4">
│       └── [Page Content]
```

**shadcn Components Used:**
- None (uses Tailwind container utility)

### 2.3 Footer (Optional MVP)

```
Component Structure:
├── <footer> (custom container)
│   ├── <Separator>
│   └── <div> (footer content)
```

**shadcn Components Used:**
- `separator`

---

## 3. Dashboard Page Components

### 3.1 Hero/Welcome Section

```
Component Structure:
├── <Card>
│   ├── <CardHeader>
│   │   └── <CardTitle> (Welcome Back, HR Manager)
│   ├── <CardContent>
│   │   └── <p> (Last report info)
```

**shadcn Components Used:**
- `card` (with CardHeader, CardContent)

### 3.2 Call-to-Action Card

```
Component Structure:
├── <Card className="bg-gradient-to-r from-blue-500 to-blue-600">
│   ├── <CardContent>
│   │   ├── <div> (icon placeholder)
│   │   ├── <CardTitle> (NEW ATTENDANCE REPORT)
│   │   ├── <CardDescription> (Process attendance data...)
│   │   └── <Button size="lg"> (Create New Report →)
```

**shadcn Components Used:**
- `card` (with CardContent, CardTitle, CardDescription)
- `button` (size: lg, custom styling for white on gradient)

### 3.3 Recent Reports Table

```
Component Structure:
├── <div> (section header)
│   ├── <h2> (Recent Reports)
│   └── <Button variant="ghost"> (View All →)
├── <Card>
│   └── <CardContent>
│       └── <Table>
│           ├── <TableHeader>
│           │   └── <TableRow>
│           │       ├── <TableHead> (Month)
│           │       ├── <TableHead> (Processed)
│           │       ├── <TableHead> (Status)
│           │       └── <TableHead> (Actions)
│           └── <TableBody>
│               └── <TableRow> (repeated)
│                   ├── <TableCell> (December 2025)
│                   ├── <TableCell> (Jan 18)
│                   ├── <TableCell>
│                   │   └── <Badge variant="success"> (✓ Done)
│                   └── <TableCell>
│                       └── <Button variant="outline" size="sm"> (Download)
```

**shadcn Components Used:**
- `card`
- `table` (with TableHeader, TableBody, TableRow, TableHead, TableCell)
- `badge` (variant: success)
- `button` (variant: outline, ghost, size: sm)

### 3.4 Empty State

```
Component Structure:
├── <Card>
│   └── <CardContent className="flex flex-col items-center">
│       ├── <div> (empty icon placeholder)
│       ├── <CardTitle> (No reports yet)
│       ├── <CardDescription> (Create your first report)
│       └── <Button> (Create New Report →)
```

**shadcn Components Used:**
- `card` (with CardContent, CardTitle, CardDescription)
- `button`

### 3.5 Loading State

```
Component Structure:
├── <Card>
│   └── <CardContent>
│       ├── <Skeleton className="h-4 w-full">
│       ├── <Skeleton className="h-4 w-3/4">
│       └── <Skeleton className="h-4 w-1/2">
```

**shadcn Components Used:**
- `card`
- `skeleton`

---

## 4. Upload Wizard Components

### 4.1 Progress Stepper

```
Component Structure:
├── <Card>
│   └── <CardContent>
│       ├── <div> (Step 1 of 3)
│       └── <div> (stepper visualization - custom)
│           ├── <div> (●──────○──────○)
│           └── <p> (Upload Cosec Dump)
```

**shadcn Components Used:**
- `card`
- Custom stepper implementation (no direct shadcn component)

**Alternative with Tabs:**
```
├── <Tabs value="step1" (non-interactive)>
│   └── <TabsList>
│       ├── <TabsTrigger value="step1"> (Cosec)
│       ├── <TabsTrigger value="step2" disabled> (BBHR)
│       └── <TabsTrigger value="step3" disabled> (Master)
```

**shadcn Components Used (Alternative):**
- `tabs` (with TabsList, TabsTrigger - styled as stepper)

### 4.2 File Upload Dropzone (Step 1 & 2)

```
Component Structure:
├── <Card>
│   ├── <CardHeader>
│   │   └── <CardTitle> (Upload Cosec Attendance Dump)
│   └── <CardContent>
│       ├── <div> (dropzone area - custom with react-dropzone)
│       │   ├── <div> (icon placeholder)
│       │   ├── <p> (Drag & drop your .xlsx file here)
│       │   ├── <p> (or click to browse)
│       │   └── <p className="text-muted-foreground"> (Supported: .xlsx...)
│       └── <div> (buttons)
│           ├── <Button variant="ghost"> (← Back)
│           └── <Button variant="outline"> (Cancel)
```

**shadcn Components Used:**
- `card` (with CardHeader, CardTitle, CardContent)
- `button` (variants: ghost, outline)
- Custom dropzone with react-dropzone library

### 4.3 Upload Progress Display

```
Component Structure:
├── <Card>
│   └── <CardContent>
│       ├── <div> (filename)
│       └── <Progress value={80}>
```

**shadcn Components Used:**
- `card`
- `progress`

### 4.4 File Preview & Validation Success

```
Component Structure:
├── <Alert variant="success">
│   ├── <CheckCircle className="h-4 w-4">
│   ├── <AlertTitle> (File uploaded successfully)
│   └── <AlertDescription> (Cosec_December_2025.xlsx)
├── <Card>
│   ├── <CardHeader>
│   │   ├── <CardTitle> (Preview - First 10 rows)
│   │   └── <Button variant="ghost" size="sm"> (Re-upload)
│   ├── <CardContent>
│   │   └── <Table>
│   │       ├── <TableHeader>
│   │       │   └── <TableRow>
│   │       │       ├── <TableHead> (User ID)
│   │       │       ├── <TableHead> (Name)
│   │       │       ├── <TableHead> (First IN)
│   │       │       └── <TableHead> (Last OUT)
│   │       └── <TableBody>
│   │           └── <TableRow> (10 rows)
│   └── <CardFooter>
│       ├── <div> (Summary section)
│       │   ├── <p> (• 8 employees found)
│       │   ├── <p> (• Date range: December 1-31, 2025)
│       │   └── <p> (• 248 total records)
│       └── <Button> (Confirm & Continue →)
```

**shadcn Components Used:**
- `alert` (custom success variant with green styling)
- `card` (with CardHeader, CardTitle, CardContent, CardFooter)
- `table`
- `button` (variants: ghost, default)

### 4.5 Validation Error Display

```
Component Structure:
├── <Alert variant="destructive">
│   ├── <AlertCircle className="h-4 w-4">
│   ├── <AlertTitle> (File validation failed)
│   └── <AlertDescription>
│       └── <div>
│           ├── <p> (Column mismatch detected)
│           ├── <div> (Expected columns list)
│           ├── <div> (Found columns list)
│           └── <p> (Please check your file format...)
├── <div> (action buttons)
│   ├── <Button> (Re-upload)
│   └── <Button variant="outline"> (Download Sample)
```

**shadcn Components Used:**
- `alert` (variant: destructive with AlertTitle, AlertDescription)
- `button` (variants: default, outline)

### 4.6 Master Data Selection (Step 3)

```
Component Structure:
├── <Card>
│   ├── <CardHeader>
│   │   └── <CardTitle> (Employee Master)
│   └── <CardContent>
│       └── <RadioGroup defaultValue="existing">
│           ├── <div className="flex items-center space-x-2">
│           │   ├── <RadioGroupItem value="existing">
│           │   ├── <Label> (Use Previously Uploaded Master)
│           │   └── <p className="text-sm text-muted-foreground">
│           │       (Last updated: November 15, 2025...)
│           └── <div className="flex items-center space-x-2">
│               ├── <RadioGroupItem value="new">
│               ├── <Label> (Upload New Master)
│               └── <div> (conditional file upload)
├── <Card>
│   ├── <CardHeader>
│   │   └── <CardTitle> (Holiday Calendar)
│   └── <CardContent>
│       └── <RadioGroup> (same structure as above)
├── <div> (action buttons)
│   ├── <Button variant="ghost"> (← Back)
│   └── <Button> (Start Processing →)
```

**shadcn Components Used:**
- `card` (with CardHeader, CardTitle, CardContent)
- `radio-group` (with RadioGroupItem)
- `label`
- `button` (variants: ghost, default)

---

## 5. Processing Screen Components

### 5.1 Full-Screen Modal Overlay

```
Component Structure:
├── <Dialog open={true} modal={true}>
│   └── <DialogContent className="max-w-md" hideClose={true}>
│       ├── <DialogHeader>
│       │   └── <DialogTitle> (Processing Attendance Data)
│       ├── <div> (progress section)
│       │   ├── <Progress value={75}>
│       │   └── <p> (75%)
│       ├── <div> (current status)
│       │   ├── <div> (icon + text)
│       │   └── <p> (📊 Detecting gaps...)
│       ├── <div> (status checklist)
│       │   ├── <div className="flex items-center gap-2">
│       │   │   ├── <CheckCircle className="text-green-500">
│       │   │   └── <span> (Validated files)
│       │   ├── <div className="flex items-center gap-2">
│       │   │   ├── <CheckCircle className="text-green-500">
│       │   │   └── <span> (Matched employees)
│       │   ├── <div className="flex items-center gap-2">
│       │   │   ├── <CheckCircle className="text-green-500">
│       │   │   └── <span> (Processed attendance)
│       │   ├── <div className="flex items-center gap-2">
│       │   │   ├── <Loader2 className="animate-spin text-blue-500">
│       │   │   └── <span> (Detecting gaps...)
│       │   └── <div className="flex items-center gap-2 text-muted-foreground">
│       │       ├── <Circle className="h-4 w-4">
│       │       └── <span> (Generating report)
│       └── <DialogFooter>
│           └── <p className="text-sm text-muted-foreground">
│               (Estimated: 1 minute remaining)
```

**shadcn Components Used:**
- `dialog` (with DialogContent, DialogHeader, DialogTitle, DialogFooter)
- `progress`
- Lucide icons: `CheckCircle`, `Loader2`, `Circle`

### 5.2 Processing Status States

**Icons for Status:**
- Completed: `<CheckCircle>` (lucide-react)
- In Progress: `<Loader2 className="animate-spin">` (lucide-react)
- Pending: `<Circle>` (lucide-react)

**shadcn Components Used:**
- Lucide React icons (included with shadcn)

---

## 6. Results Dashboard Components

### 6.1 Success Banner

```
Component Structure:
├── <Alert variant="success" (custom green variant)>
│   ├── <CheckCircle className="h-4 w-4">
│   ├── <AlertTitle> (✓ Processing Complete)
│   ├── <AlertDescription> (Attendance Report for December 2025)
│   └── <div> (action buttons)
│       ├── <Button> (📥 Download Excel Report)
│       └── <Button variant="outline"> (🔄 Process New Report)
```

**shadcn Components Used:**
- `alert` (custom success variant with AlertTitle, AlertDescription)
- `button` (variants: default, outline)

### 6.2 Summary Cards Section

```
Component Structure:
├── <div className="grid grid-cols-4 gap-4">
│   ├── <Card>
│   │   └── <CardContent className="pt-6">
│   │       ├── <div> (icon: 📊)
│   │       ├── <p className="text-3xl font-bold"> (1000)
│   │       └── <p className="text-sm text-muted-foreground">
│   │           (Total Employees)
│   ├── <Card className="border-red-200">
│   │   └── <CardContent className="pt-6">
│   │       ├── <div> (icon: 🔴)
│   │       ├── <p className="text-3xl font-bold text-red-600"> (45)
│   │       └── <p className="text-sm text-muted-foreground">
│   │           (Critical Gaps)
│   ├── <Card className="border-yellow-200">
│   │   └── <CardContent className="pt-6">
│   │       ├── <div> (icon: ⚠️)
│   │       ├── <p className="text-3xl font-bold text-yellow-600"> (12)
│   │       └── <p className="text-sm text-muted-foreground">
│   │           (Warnings)
│   └── <Card className="border-green-200">
│       └── <CardContent className="pt-6">
│           ├── <div> (icon: ✅)
│           ├── <p className="text-3xl font-bold text-green-600"> (943)
│           └── <p className="text-sm text-muted-foreground">
│               (Clean Records)
```

**shadcn Components Used:**
- `card` (with CardContent, custom border colors)

### 6.3 Metadata Display

```
Component Structure:
├── <div className="text-sm text-muted-foreground">
│   ├── <p> (Date Range: December 1-31, 2025 (31 days))
│   └── <p> (Processed: January 21, 2026 at 10:35 AM)
├── <Separator>
```

**shadcn Components Used:**
- `separator`

### 6.4 Gap List Section (Collapsible)

```
Component Structure:
├── <Accordion type="single" collapsible defaultValue="critical">
│   ├── <AccordionItem value="critical">
│   │   ├── <AccordionTrigger>
│   │   │   └── <div>
│   │   │       ├── <span> (🔴 Critical Gaps (45 employees))
│   │   │       └── <Button variant="ghost" size="sm"> (Export)
│   │   └── <AccordionContent>
│   │       ├── <div> (search and filter)
│   │       │   ├── <Input placeholder="Search employees...">
│   │       │   └── <DropdownMenu>
│   │       │       ├── <DropdownMenuTrigger asChild>
│   │       │       │   └── <Button variant="outline"> (Filter ▼)
│   │       │       └── <DropdownMenuContent>
│   │       │           ├── <DropdownMenuItem> (All)
│   │       │           ├── <DropdownMenuItem> (Missing Data)
│   │       │           └── <DropdownMenuItem> (Pending Approval)
│   │       └── <div> (gap items list)
│   │           └── <Card> (repeated per employee)
│   │               └── <CardContent>
│   │                   ├── <div> (header with emp info)
│   │                   │   ├── <p> (Emp# 101312 - Akashnikhil V)
│   │                   │   └── <Button variant="ghost" size="sm">
│   │                   │       (View)
│   │                   ├── <div> (issue badge)
│   │                   │   └── <Badge variant="destructive">
│   │                   │       (Missing Data)
│   │                   ├── <p> (Dates: Dec 10, 12, 15, 18, 22)
│   │                   └── <p className="text-sm text-muted-foreground">
│   │                       (Manager: Vidya Sagar Karnati)
│   └── <AccordionItem value="warnings">
│       └── (similar structure for warnings with yellow theme)
```

**shadcn Components Used:**
- `accordion` (with AccordionItem, AccordionTrigger, AccordionContent)
- `input`
- `dropdown-menu` (with DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem)
- `card` (with CardContent)
- `badge` (variant: destructive for critical, custom yellow for warnings)
- `button` (variants: ghost, outline, size: sm)

### 6.5 Expanded Gap Details (Collapsible Card Content)

```
Component Structure:
├── <Collapsible>
│   ├── <CollapsibleTrigger asChild>
│   │   └── <Card> (gap item card)
│   └── <CollapsibleContent>
│       └── <div className="p-4 border-t">
│           ├── <div> (Calendar view of affected dates - custom)
│           ├── <div> (employee details)
│           │   ├── <p> (Email: employee@company.com)
│           │   └── <p> (Contact: +91 XXX XXX XXXX)
│           ├── <div> (action suggestions)
│           │   └── <Alert variant="info">
│           │       └── <AlertDescription>
│           │           (Action: Contact employee to apply leave...)
│           └── <Button variant="outline" size="sm">
│               (Copy Employee Details)
```

**shadcn Components Used:**
- `collapsible` (with CollapsibleTrigger, CollapsibleContent)
- `alert` (custom info variant with AlertDescription)
- `button` (variant: outline, size: sm)

### 6.6 Load More Pattern

```
Component Structure:
├── <div className="text-center mt-4">
│   └── <Button variant="outline"> (Show more...)
```

**shadcn Components Used:**
- `button` (variant: outline)

---

## 7. Error Pages Components

### 7.1 Generic Error Page

```
Component Structure:
├── <div className="flex items-center justify-center min-h-[60vh]">
│   └── <Card className="max-w-md text-center">
│       ├── <CardContent className="pt-6">
│       │   ├── <div> (⚠️ Large Icon)
│       │   ├── <CardTitle> (Oops! Something went wrong)
│       │   ├── <CardDescription>
│       │   │   (We encountered an unexpected error...)
│       │   ├── <Button> (← Back to Dashboard)
│       │   └── <div className="mt-4 text-xs text-muted-foreground">
│       │       ├── <p> (Error ID: ERR-20260121-1035-A4B2)
│       │       └── <p> (Time: January 21, 2026 at 10:35 AM)
```

**shadcn Components Used:**
- `card` (with CardContent, CardTitle, CardDescription)
- `button`

### 7.2 Processing Timeout Error

```
Component Structure:
├── <div className="flex items-center justify-center min-h-[60vh]">
│   └── <Card className="max-w-md text-center">
│       ├── <CardContent className="pt-6">
│       │   ├── <div> (⏱️ Clock Icon)
│       │   ├── <CardTitle> (Processing Timeout)
│       │   ├── <CardDescription>
│       │   │   (Processing took longer than expected...)
│       │   ├── <Alert variant="info">
│       │   │   └── <AlertDescription>
│       │   │       └── <ul>
│       │   │           ├── <li> (Retry with smaller date range)
│       │   │           ├── <li> (Check if files are corrupted)
│       │   │           └── <li> (Contact support if issue persists)
│       │   └── <div className="flex gap-2">
│       │       ├── <Button> (Try Again)
│       │       └── <Button variant="outline"> (Contact Support)
```

**shadcn Components Used:**
- `card` (with CardContent, CardTitle, CardDescription)
- `alert` (custom info variant with AlertDescription)
- `button` (variants: default, outline)

---

## 8. Shared Component Patterns

### 8.1 Toast Notifications

```
Component Structure:
└── <Toaster> (sonner or react-hot-toast)
    └── toast.success("File uploaded successfully")
    └── toast.error("Validation failed")
    └── toast.info("Processing started")
    └── toast.warning("Large file detected")
```

**shadcn Components Used:**
- `toast` (sonner implementation recommended)
- Install: `npx shadcn@latest add sonner`

**Usage Pattern:**
```typescript
import { toast } from "sonner"

// Success
toast.success("Report downloaded successfully")

// Error
toast.error("Failed to upload file")

// With action
toast("File uploaded", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo")
  }
})
```

### 8.2 Confirmation Dialog

```
Component Structure:
├── <AlertDialog>
│   ├── <AlertDialogTrigger asChild>
│   │   └── <Button> (Process New Report)
│   └── <AlertDialogContent>
│       ├── <AlertDialogHeader>
│       │   ├── <AlertDialogTitle> (Are you sure?)
│       │   └── <AlertDialogDescription>
│       │       (Current results will be cleared. Continue?)
│       └── <AlertDialogFooter>
│           ├── <AlertDialogCancel> (Cancel)
│           └── <AlertDialogAction> (Continue)
```

**shadcn Components Used:**
- `alert-dialog` (with AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction)

### 8.3 Tooltip for Help Text

```
Component Structure:
├── <TooltipProvider>
│   └── <Tooltip>
│       ├── <TooltipTrigger asChild>
│       │   └── <Button variant="ghost" size="icon">
│       │       (ℹ️ Info icon)
│       └── <TooltipContent>
│           └── <p> (Supported file formats: .xlsx only)
```

**shadcn Components Used:**
- `tooltip` (with TooltipProvider, TooltipTrigger, TooltipContent)

### 8.4 Loading Spinner

```
Component Structure:
├── <div className="flex items-center justify-center">
│   └── <Loader2 className="h-8 w-8 animate-spin">
```

**shadcn Components Used:**
- Lucide icon: `Loader2` (with Tailwind animate-spin)

### 8.5 Breadcrumb Navigation (Future)

```
Component Structure:
├── <Breadcrumb>
│   └── <BreadcrumbList>
│       ├── <BreadcrumbItem>
│       │   └── <BreadcrumbLink> (Dashboard)
│       ├── <BreadcrumbSeparator>
│       ├── <BreadcrumbItem>
│       │   └── <BreadcrumbLink> (New Report)
│       ├── <BreadcrumbSeparator>
│       └── <BreadcrumbItem>
│           └── <BreadcrumbPage> (Step 1)
```

**shadcn Components Used:**
- `breadcrumb` (with BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage)

---

## 9. Installation Checklist

### 9.1 Core Components to Install

**Phase 1: Foundation (Required for MVP)**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add alert
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add progress
npx shadcn@latest add dialog
npx shadcn@latest add sonner  # Toast notifications
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add dropdown-menu
```

**Phase 2: Forms & Selection (Required for MVP)**
```bash
npx shadcn@latest add form
npx shadcn@latest add radio-group
npx shadcn@latest add alert-dialog  # Confirmation dialogs
```

**Phase 3: Advanced Features (Required for MVP)**
```bash
npx shadcn@latest add accordion
npx shadcn@latest add collapsible
npx shadcn@latest add avatar
npx shadcn@latest add scroll-area
npx shadcn@latest add tooltip
```

**Phase 4: Future Enhancements**
```bash
npx shadcn@latest add tabs
npx shadcn@latest add checkbox
npx shadcn@latest add select
npx shadcn@latest add breadcrumb
npx shadcn@latest add calendar  # For date pickers in future
```

### 9.2 Additional Dependencies

**File Upload:**
```bash
npm install react-dropzone
# or
pnpm add react-dropzone
```

**Icons:**
```bash
# Already included with shadcn
# Uses lucide-react for icons
```

**Date Formatting:**
```bash
npm install date-fns
# or
pnpm add date-fns
```

**Excel Generation:**
```bash
npm install exceljs
# or
pnpm add exceljs
```

### 9.3 Configuration Files

**Ensure shadcn is initialized:**
```bash
npx shadcn@latest init
```

**Update `components.json` if needed:**
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## 10. Component Customization Guide

### 10.1 Custom Variants

**Success Alert (Green):**
```typescript
// Add to Alert component variants
<Alert className="border-green-200 bg-green-50 text-green-900">
  <CheckCircle className="h-4 w-4 text-green-600" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully</AlertDescription>
</Alert>
```

**Info Alert (Blue):**
```typescript
<Alert className="border-blue-200 bg-blue-50 text-blue-900">
  <Info className="h-4 w-4 text-blue-600" />
  <AlertDescription>Information message</AlertDescription>
</Alert>
```

**Warning Badge (Yellow):**
```typescript
<Badge className="bg-yellow-100 text-yellow-900 border-yellow-300">
  Warning
</Badge>
```

### 10.2 Custom Card Borders

**Critical Gap Card:**
```typescript
<Card className="border-l-4 border-l-red-500">
  <CardContent>
    {/* Gap content */}
  </CardContent>
</Card>
```

**Warning Card:**
```typescript
<Card className="border-l-4 border-l-yellow-500">
  <CardContent>
    {/* Warning content */}
  </CardContent>
</Card>
```

### 10.3 Gradient Background Card

**CTA Card:**
```typescript
<Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
  <CardContent>
    <Button className="bg-white text-blue-600 hover:bg-gray-100">
      Create New Report
    </Button>
  </CardContent>
</Card>
```

---

## 11. Component Organization Structure

### 11.1 Directory Structure

```
src/
├── components/
│   ├── ui/  (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── HeroCard.tsx
│   │   ├── CTACard.tsx
│   │   └── RecentReportsTable.tsx
│   ├── upload-wizard/
│   │   ├── ProgressStepper.tsx
│   │   ├── FileUploadDropzone.tsx
│   │   ├── PreviewTable.tsx
│   │   └── MasterDataSelector.tsx
│   ├── processing/
│   │   ├── ProcessingModal.tsx
│   │   └── ProcessingStatusList.tsx
│   ├── results/
│   │   ├── SuccessBanner.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── GapListSection.tsx
│   │   └── GapItemCard.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── LoadingSpinner.tsx
```

### 11.2 Component Import Pattern

```typescript
// Page component example
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroCard } from "@/components/dashboard/HeroCard"
import { CTACard } from "@/components/dashboard/CTACard"
import { RecentReportsTable } from "@/components/dashboard/RecentReportsTable"
```

---

## 12. Implementation Priority

### 12.1 Sprint 1: Core UI Foundation
**Week 1-2: Dashboard & Navigation**
- Install core shadcn components
- Implement Header with navigation
- Build Dashboard page with CTA
- Create Recent Reports table

**Components to Build:**
- `Header` (with dropdown-menu, avatar)
- `HeroCard` (with card)
- `CTACard` (with card, button)
- `RecentReportsTable` (with card, table, badge)

### 12.2 Sprint 2: Upload Wizard
**Week 3-4: Multi-step Upload Flow**
- Implement ProgressStepper
- Build FileUploadDropzone (Steps 1 & 2)
- Create PreviewTable component
- Build MasterDataSelector (Step 3)

**Components to Build:**
- `ProgressStepper` (custom with card)
- `FileUploadDropzone` (with card, button, alert)
- `PreviewTable` (with card, table)
- `MasterDataSelector` (with card, radio-group, button)

### 12.3 Sprint 3: Processing & Results
**Week 5-6: Processing Flow & Results Display**
- Implement ProcessingModal
- Build SummaryCards
- Create GapListSection with filtering
- Implement download functionality

**Components to Build:**
- `ProcessingModal` (with dialog, progress)
- `SummaryCards` (with card)
- `GapListSection` (with accordion, card, input, dropdown-menu, badge)
- `GapItemCard` (with collapsible, card, button)

### 12.4 Sprint 4: Polish & Error Handling
**Week 7-8: Edge Cases & UX Refinement**
- Implement error pages
- Add loading states (skeleton)
- Configure toast notifications
- Add tooltips and help text

**Components to Build:**
- `ErrorPage` (with card, button, alert)
- Loading states (with skeleton)
- Toast system (with sonner)
- Tooltips (with tooltip)

---

## 13. Testing Checklist

### 13.1 Component-Level Tests
- [ ] All shadcn components render correctly
- [ ] Button variants work as expected
- [ ] Card layouts are responsive
- [ ] Table displays data properly
- [ ] Form inputs validate correctly
- [ ] Modals open/close properly
- [ ] Accordions expand/collapse
- [ ] Toasts appear and dismiss

### 13.2 Interaction Tests
- [ ] File upload flow works end-to-end
- [ ] Progress stepper advances correctly
- [ ] Radio groups toggle properly
- [ ] Dropdowns filter correctly
- [ ] Confirmation dialogs work
- [ ] Error states display appropriately
- [ ] Loading states show during async operations

### 13.3 Accessibility Tests
- [ ] Keyboard navigation works throughout
- [ ] Screen reader labels are correct
- [ ] Focus management in modals
- [ ] Color contrast meets WCAG AA
- [ ] ARIA attributes are present

---

## 14. Quick Reference

### 14.1 Component to Screen Mapping

| Screen | Primary shadcn Components |
|--------|--------------------------|
| Dashboard | card, table, badge, button |
| Upload Step 1-2 | card, button, alert, progress, table |
| Upload Step 3 | card, radio-group, button |
| Processing | dialog, progress |
| Results | alert, card, accordion, input, dropdown-menu, badge, button, collapsible |
| Error Pages | card, button, alert |

### 14.2 Common Patterns Quick Access

| Pattern | shadcn Components |
|---------|------------------|
| Success Message | alert (green custom) + CheckCircle icon |
| Error Message | alert (variant: destructive) + AlertCircle icon |
| Loading State | skeleton OR Loader2 icon |
| Confirmation | alert-dialog |
| Notification | sonner (toast) |
| Help Text | tooltip |
| Status Indicator | badge |
| Expandable Section | accordion OR collapsible |

---

**END OF UI IMPLEMENTATION PLAN**

## Appendix: Complete Installation Command

```bash
# Install all required shadcn components at once
npx shadcn@latest add button card table badge alert input label progress dialog sonner separator skeleton dropdown-menu form radio-group alert-dialog accordion collapsible avatar scroll-area tooltip

# Install additional npm packages
pnpm add react-dropzone date-fns exceljs
```

This command installs all MVP-required shadcn/ui components in a single execution.
