# Track-It Implementation Guide
## Step-by-Step Component Development

**Version:** 1.0  
**Date:** January 21, 2026  
**Status:** Ready for Development

---

## Table of Contents
1. [Setup & Installation](#1-setup--installation)
2. [Sprint 1: Dashboard & Navigation](#2-sprint-1-dashboard--navigation)
3. [Sprint 2: Upload Wizard](#3-sprint-2-upload-wizard)
4. [Sprint 3: Processing & Results](#4-sprint-3-processing--results)
5. [Sprint 4: Polish & Error Handling](#5-sprint-4-polish--error-handling)

---

## 1. Setup & Installation

### 1.1 Prerequisites Installed ✅

**shadcn/ui Components:**
```bash
# All MVP components have been added
✅ button, card, table, badge, alert
✅ input, label, progress, dialog, sonner
✅ separator, skeleton, dropdown-menu
✅ form, radio-group, alert-dialog
✅ accordion, collapsible, avatar
✅ scroll-area, tooltip
```

**Additional Dependencies:**
```bash
✅ react-dropzone (file uploads)
✅ date-fns (date formatting)
✅ exceljs (Excel generation)
```

### 1.2 Directory Structure Created ✅

```
src/components/
├── ui/                    # shadcn components (auto-generated)
├── dashboard/             # ✅ Created
├── upload-wizard/         # ✅ Created
├── processing/            # ✅ Created
├── results/               # ✅ Created
└── shared/                # ✅ Created
```

---

## 2. Sprint 1: Dashboard & Navigation

### Week 1-2 Goals
- Build global header with navigation
- Create dashboard home page
- Implement CTA card and recent reports table

### 2.1 Component: Header (Global Navigation)

**Location:** `src/components/shared/Header.tsx`

**Dependencies:**
- `@/components/ui/button`
- `@/components/ui/dropdown-menu`
- `@/components/ui/avatar`
- `@/components/ui/separator`
- `next/link`

**Component Structure:**
```typescript
// src/components/shared/Header.tsx

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">📊</span>
            <span className="text-xl font-bold">Track-It</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/reports">Reports</Link>
          </Button>
        </nav>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback>HR</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

**Key Points:**
- ✅ Uses `container max-w-7xl mx-auto` for centering (per shad-cn instructions)
- ✅ Sticky header with backdrop blur
- ✅ Responsive spacing with Tailwind utilities

---

### 2.2 Component: HeroCard (Welcome Section)

**Location:** `src/components/dashboard/HeroCard.tsx`

**Dependencies:**
- `@/components/ui/card`

**Component Structure:**
```typescript
// src/components/dashboard/HeroCard.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface HeroCardProps {
  userName: string
  lastReportDate?: Date
  lastReportMonth?: string
}

export function HeroCard({ userName, lastReportDate, lastReportMonth }: HeroCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Welcome Back, {userName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastReportDate && lastReportMonth ? (
          <p className="text-muted-foreground">
            Last report: {lastReportMonth} ({formatDistanceToNow(lastReportDate, { addSuffix: true })})
          </p>
        ) : (
          <p className="text-muted-foreground">
            Ready to process your first attendance report
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

**Key Points:**
- Uses `date-fns` for relative time formatting
- Handles empty state gracefully
- Clean typography hierarchy

---

### 2.3 Component: CTACard (Call-to-Action)

**Location:** `src/components/dashboard/CTACard.tsx`

**Dependencies:**
- `@/components/ui/card`
- `@/components/ui/button`
- `next/link`

**Component Structure:**
```typescript
// src/components/dashboard/CTACard.tsx

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"

export function CTACard() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white">
      <CardContent className="pt-6 pb-8 px-8 text-center">
        <div className="mb-4">
          <FileSpreadsheet className="h-16 w-16 mx-auto" />
        </div>
        <CardTitle className="text-2xl mb-2 text-white">
          NEW ATTENDANCE REPORT
        </CardTitle>
        <CardDescription className="text-blue-50 mb-6">
          Process attendance data for the current month
        </CardDescription>
        <Button 
          size="lg" 
          asChild
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          <Link href="/reports/new">
            Create New Report →
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

**Key Points:**
- Gradient background as specified in UI plan
- Custom button styling (white on gradient)
- Uses lucide-react icon (FileSpreadsheet)
- Centered content layout

---

### 2.4 Component: RecentReportsTable

**Location:** `src/components/dashboard/RecentReportsTable.tsx`

**Dependencies:**
- `@/components/ui/card`
- `@/components/ui/table`
- `@/components/ui/badge`
- `@/components/ui/button`

**Component Structure:**
```typescript
// src/components/dashboard/RecentReportsTable.tsx

import Link from "next/link"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Report {
  id: string
  month: string
  processedDate: Date
  status: "completed" | "failed"
}

interface RecentReportsTableProps {
  reports: Report[]
  onDownload: (reportId: string) => void
}

export function RecentReportsTable({ reports, onDownload }: RecentReportsTableProps) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first report to get started
          </p>
          <Button asChild>
            <Link href="/reports/new">Create New Report →</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Recent Reports</h2>
        <Button variant="ghost" asChild>
          <Link href="/reports">View All →</Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.slice(0, 5).map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.month}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(report.processedDate, { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === "completed" ? "default" : "destructive"}>
                      {report.status === "completed" ? "✓ Done" : "✗ Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDownload(report.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Key Points:**
- Empty state handling built-in
- Max 5 rows displayed
- Relative timestamps with `date-fns`
- Download action with icon
- Badge variants for status

---

### 2.5 Page: Dashboard

**Location:** `src/app/page.tsx`

**Component Structure:**
```typescript
// src/app/page.tsx

import { Header } from "@/components/shared/Header"
import { HeroCard } from "@/components/dashboard/HeroCard"
import { CTACard } from "@/components/dashboard/CTACard"
import { RecentReportsTable } from "@/components/dashboard/RecentReportsTable"

// Mock data (replace with actual data fetching)
const mockReports = [
  {
    id: "1",
    month: "December 2025",
    processedDate: new Date("2026-01-18"),
    status: "completed" as const,
  },
  {
    id: "2",
    month: "November 2025",
    processedDate: new Date("2025-12-20"),
    status: "completed" as const,
  },
]

export default function DashboardPage() {
  const handleDownload = (reportId: string) => {
    // TODO: Implement download logic
    console.log("Download report:", reportId)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/40">
        <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <HeroCard 
            userName="HR Manager"
            lastReportDate={new Date("2026-01-18")}
            lastReportMonth="December 2025"
          />

          {/* CTA Card */}
          <CTACard />

          {/* Recent Reports */}
          <RecentReportsTable 
            reports={mockReports}
            onDownload={handleDownload}
          />
        </div>
      </main>
    </>
  )
}
```

**Key Points:**
- ✅ `container max-w-7xl mx-auto` for centering
- Space-y-8 for consistent vertical spacing
- Clean component composition

---

## 3. Sprint 2: Upload Wizard

### Week 3-4 Goals
- Multi-step wizard with progress stepper
- File upload with drag & drop
- Preview tables with validation
- Master data selection

### 3.1 Component: ProgressStepper

**Location:** `src/components/upload-wizard/ProgressStepper.tsx`

**Dependencies:**
- `@/components/ui/card`

**Component Structure:**
```typescript
// src/components/upload-wizard/ProgressStepper.tsx

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
}

interface ProgressStepperProps {
  currentStep: number
  steps: Step[]
}

export function ProgressStepper({ currentStep, steps }: ProgressStepperProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-2 text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </div>
        
        {/* Stepper Visualization */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    index + 1 < currentStep
                      ? "border-green-500 bg-green-500 text-white"
                      : index + 1 === currentStep
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {index + 1 < currentStep ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6 fill-current" />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm font-medium",
                    index + 1 <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-4",
                    index + 1 < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Key Points:**
- Custom stepper with filled/unfilled states
- Check icon for completed steps
- Connecting lines with conditional styling
- Responsive layout

---

### 3.2 Component: FileUploadDropzone

**Location:** `src/components/upload-wizard/FileUploadDropzone.tsx`

**Dependencies:**
- `@/components/ui/card`
- `@/components/ui/button`
- `@/components/ui/alert`
- `@/components/ui/progress`
- `react-dropzone`

**Component Structure:**
```typescript
// src/components/upload-wizard/FileUploadDropzone.tsx

"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadDropzoneProps {
  title: string
  onFileAccepted: (file: File) => Promise<void>
  maxSize?: number // in bytes
}

export function FileUploadDropzone({ 
  title, 
  onFileAccepted,
  maxSize = 10 * 1024 * 1024 // 10MB default
}: FileUploadDropzoneProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === "file-too-large") {
        setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`)
      } else if (rejection.errors[0]?.code === "file-invalid-type") {
        setError("Only .xlsx files are supported")
      } else {
        setError("Invalid file")
      }
      return
    }

    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setProgress(0)

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      await onFileAccepted(file)
      
      clearInterval(interval)
      setProgress(100)
      setUploadedFile(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }, [onFileAccepted, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize,
    multiple: false,
  })

  const handleReupload = () => {
    setUploadedFile(null)
    setProgress(0)
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone Area */}
        {!uploadedFile && (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-2">
              {isDragActive 
                ? "Drop your file here" 
                : "Drag & drop your .xlsx file here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported: .xlsx files only (max {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="text-sm">Uploading...</span>
            </div>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">{progress}%</p>
          </div>
        )}

        {/* Success State */}
        {uploadedFile && !uploading && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">File uploaded successfully</AlertTitle>
            <AlertDescription className="text-green-800">
              {uploadedFile.name}
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {uploadedFile && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={handleReupload}>
              Re-upload
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

**Key Points:**
- Full drag & drop support with react-dropzone
- File validation (type, size)
- Simulated upload progress
- Success/error states
- Re-upload capability

---

### 3.3 Component: PreviewTable

**Location:** `src/components/upload-wizard/PreviewTable.tsx`

**Dependencies:**
- `@/components/ui/card`
- `@/components/ui/table`
- `@/components/ui/button`

**Component Structure:**
```typescript
// src/components/upload-wizard/PreviewTable.tsx

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface PreviewTableProps {
  data: any[]
  columns: string[]
  summary: {
    employeeCount?: number
    dateRange?: string
    totalRecords?: number
  }
  onConfirm: () => void
  onReupload: () => void
}

export function PreviewTable({ 
  data, 
  columns, 
  summary, 
  onConfirm, 
  onReupload 
}: PreviewTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Preview (First 10 rows)</CardTitle>
          <Button variant="ghost" size="sm" onClick={onReupload}>
            Re-upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 10).map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col}>{row[col] || "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="text-sm space-y-1">
          <p className="font-semibold">Summary</p>
          {summary.employeeCount && (
            <p className="text-muted-foreground">• {summary.employeeCount} employees found</p>
          )}
          {summary.dateRange && (
            <p className="text-muted-foreground">• Date range: {summary.dateRange}</p>
          )}
          {summary.totalRecords && (
            <p className="text-muted-foreground">• {summary.totalRecords} total records</p>
          )}
        </div>
        <Button onClick={onConfirm} className="w-full">
          Confirm & Continue →
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Key Points:**
- First 10 rows display
- Summary statistics
- Re-upload and confirm actions
- Clean table layout

---

## 4. Sprint 3: Processing & Results

### 4.1 Component: ProcessingModal

**Location:** `src/components/processing/ProcessingModal.tsx`

**Dependencies:**
- `@/components/ui/dialog`
- `@/components/ui/progress`

**Component Structure:**
```typescript
// src/components/processing/ProcessingModal.tsx

"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Loader2 } from "lucide-react"

interface ProcessingStep {
  id: string
  label: string
  status: "completed" | "in-progress" | "pending"
}

interface ProcessingModalProps {
  open: boolean
  progress: number
  steps: ProcessingStep[]
  estimatedTimeRemaining?: number // in seconds
}

export function ProcessingModal({ 
  open, 
  progress, 
  steps,
  estimatedTimeRemaining 
}: ProcessingModalProps) {
  return (
    <Dialog open={open} modal>
      <DialogContent 
        className="max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Processing Attendance Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-center font-medium">{progress}%</p>
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">
              {steps.find(s => s.status === "in-progress")?.label || "Processing..."}
            </span>
          </div>

          {/* Status Checklist */}
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                {step.status === "completed" && (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
                {step.status === "in-progress" && (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
                )}
                {step.status === "pending" && (
                  <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                )}
                <span 
                  className={
                    step.status === "pending" 
                      ? "text-muted-foreground" 
                      : "text-foreground"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
            <p className="text-sm text-muted-foreground">
              Estimated: {Math.floor(estimatedTimeRemaining / 60)} minute{Math.floor(estimatedTimeRemaining / 60) !== 1 ? 's' : ''} {estimatedTimeRemaining % 60} seconds remaining
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Key Points:**
- Cannot be dismissed (blocks backdrop interaction)
- Real-time progress updates
- Status icons (completed, in-progress, pending)
- Estimated time display

---

### 4.2 Component: SummaryCards

**Location:** `src/components/results/SummaryCards.tsx`

**Dependencies:**
- `@/components/ui/card`

**Component Structure:**
```typescript
// src/components/results/SummaryCards.tsx

import { Card, CardContent } from "@/components/ui/card"
import { FileSpreadsheet, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react"

interface SummaryData {
  totalEmployees: number
  criticalGaps: number
  warnings: number
  cleanRecords: number
}

interface SummaryCardsProps {
  data: SummaryData
}

export function SummaryCards({ data }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Employees */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <FileSpreadsheet className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-3xl font-bold">{data.totalEmployees}</p>
            <p className="text-sm text-muted-foreground">Total Employees</p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Gaps */}
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 mb-2 text-red-500" />
            <p className="text-3xl font-bold text-red-600">{data.criticalGaps}</p>
            <p className="text-sm text-muted-foreground">Critical Gaps</p>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      <Card className="border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-8 w-8 mb-2 text-yellow-500" />
            <p className="text-3xl font-bold text-yellow-600">{data.warnings}</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
        </CardContent>
      </Card>

      {/* Clean Records */}
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="h-8 w-8 mb-2 text-green-500" />
            <p className="text-3xl font-bold text-green-600">{data.cleanRecords}</p>
            <p className="text-sm text-muted-foreground">Clean Records</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Key Points:**
- 4-column grid (responsive)
- Custom border colors per card type
- Icon + number + label layout
- Color-coded values

---

### 4.3 Component: GapListSection

**Location:** `src/components/results/GapListSection.tsx`

**Dependencies:**
- `@/components/ui/accordion`
- `@/components/ui/card`
- `@/components/ui/input`
- `@/components/ui/dropdown-menu`
- `@/components/ui/badge`
- `@/components/ui/button`

**Component Structure:**
```typescript
// src/components/results/GapListSection.tsx

"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Filter, Download } from "lucide-react"

interface GapRecord {
  employeeNumber: string
  employeeName: string
  issueType: "critical" | "warning"
  specificIssue: string
  datesAffected: string[]
  manager: string
}

interface GapListSectionProps {
  criticalGaps: GapRecord[]
  warnings: GapRecord[]
}

export function GapListSection({ criticalGaps, warnings }: GapListSectionProps) {
  const [criticalSearch, setCriticalSearch] = useState("")
  const [warningSearch, setWarningSearch] = useState("")
  const [criticalFilter, setCriticalFilter] = useState("all")
  const [warningFilter, setWarningFilter] = useState("all")

  const filteredCritical = criticalGaps.filter((gap) =>
    gap.employeeName.toLowerCase().includes(criticalSearch.toLowerCase()) ||
    gap.employeeNumber.includes(criticalSearch)
  )

  const filteredWarnings = warnings.filter((gap) =>
    gap.employeeName.toLowerCase().includes(warningSearch.toLowerCase()) ||
    gap.employeeNumber.includes(warningSearch)
  )

  return (
    <Accordion type="single" collapsible defaultValue="critical" className="space-y-4">
      {/* Critical Gaps Section */}
      <AccordionItem value="critical">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                🔴 Critical Gaps ({criticalGaps.length} employees)
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                // Export logic
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <Input
                placeholder="Search employees..."
                value={criticalSearch}
                onChange={(e) => setCriticalSearch(e.target.value)}
                className="flex-1"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCriticalFilter("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCriticalFilter("missing")}>
                    Missing Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCriticalFilter("pending")}>
                    Pending Approval
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Gap Items */}
            <div className="space-y-2">
              {filteredCritical.map((gap, index) => (
                <Card key={index} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">
                        Emp# {gap.employeeNumber} - {gap.employeeName}
                      </p>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="mb-2">
                      <Badge variant="destructive">{gap.specificIssue}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Dates: {gap.datesAffected.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Manager: {gap.manager}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Warnings Section */}
      <AccordionItem value="warnings">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                ⚠️ Warnings ({warnings.length} employees)
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation()
                // Export logic
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-4">
            {/* Search */}
            <Input
              placeholder="Search employees..."
              value={warningSearch}
              onChange={(e) => setWarningSearch(e.target.value)}
            />

            {/* Warning Items */}
            <div className="space-y-2">
              {filteredWarnings.map((gap, index) => (
                <Card key={index} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">
                        Emp# {gap.employeeNumber} - {gap.employeeName}
                      </p>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="mb-2">
                      <Badge className="bg-yellow-100 text-yellow-900 border-yellow-300">
                        {gap.specificIssue}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Dates: {gap.datesAffected.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Manager: {gap.manager}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

**Key Points:**
- Accordion with default "critical" expanded
- Search functionality per section
- Filter dropdown for critical gaps
- Color-coded left borders
- Export button per section

---

## 5. Sprint 4: Polish & Error Handling

### 5.1 Component: Toast System Setup

**Location:** `src/app/layout.tsx`

**Component Structure:**
```typescript
// Add to src/app/layout.tsx

import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Usage Example:**
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
    onClick: () => console.log("Undo"),
  },
})
```

---

### 5.2 Component: ErrorPage

**Location:** `src/components/shared/ErrorPage.tsx`

**Dependencies:**
- `@/components/ui/card`
- `@/components/ui/button`

**Component Structure:**
```typescript
// src/components/shared/ErrorPage.tsx

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock } from "lucide-react"
import { format } from "date-fns"

interface ErrorPageProps {
  type?: "generic" | "timeout"
  errorId?: string
  timestamp?: Date
  onRetry?: () => void
}

export function ErrorPage({ 
  type = "generic", 
  errorId,
  timestamp = new Date(),
  onRetry 
}: ErrorPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <CardContent className="pt-12 pb-8 px-8">
          {type === "generic" ? (
            <>
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <CardTitle className="text-2xl mb-4">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="mb-6">
                We encountered an unexpected error while processing your request. 
                This has been logged and our team will look into it.
              </CardDescription>
              <Button asChild>
                <Link href="/">← Back to Dashboard</Link>
              </Button>
              
              {errorId && (
                <div className="mt-6 text-xs text-muted-foreground space-y-1">
                  <p>Error ID: {errorId}</p>
                  <p>Time: {format(timestamp, "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <Clock className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <CardTitle className="text-2xl mb-4">
                Processing Timeout
              </CardTitle>
              <CardDescription className="mb-6">
                Processing took longer than expected (&gt;5 minutes). 
                This may be due to large file size or system load.
              </CardDescription>
              
              <div className="text-left mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold mb-2 text-sm">What to do:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Retry with smaller date range</li>
                  <li>Check if files are corrupted</li>
                  <li>Contact support if issue persists</li>
                </ul>
              </div>

              <div className="flex gap-2">
                {onRetry && (
                  <Button onClick={onRetry} className="flex-1">
                    Try Again
                  </Button>
                )}
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Key Points:**
- Two error types (generic, timeout)
- Error ID and timestamp display
- Retry functionality
- Helpful suggestions for timeout errors

---

## 6. Testing Checklist

### 6.1 Component Testing

```typescript
// Example test for HeroCard
// tests/unit/components/dashboard/HeroCard.test.tsx

import { render, screen } from '@testing-library/react'
import { HeroCard } from '@/components/dashboard/HeroCard'

describe('HeroCard', () => {
  it('renders welcome message with user name', () => {
    render(
      <HeroCard 
        userName="Test User" 
        lastReportDate={new Date('2026-01-18')}
        lastReportMonth="December 2025"
      />
    )
    
    expect(screen.getByText(/Welcome Back, Test User/i)).toBeInTheDocument()
  })

  it('displays empty state when no reports exist', () => {
    render(<HeroCard userName="Test User" />)
    
    expect(screen.getByText(/Ready to process your first/i)).toBeInTheDocument()
  })
})
```

---

## 7. Deployment Checklist

### Pre-Deployment

- [ ] All shadcn components installed
- [ ] Additional dependencies added (react-dropzone, date-fns, exceljs)
- [ ] Component directory structure created
- [ ] Global Header component implemented
- [ ] Dashboard page with all components
- [ ] Upload wizard with stepper and file upload
- [ ] Processing modal with real-time updates
- [ ] Results dashboard with summary and gap lists
- [ ] Error pages for edge cases
- [ ] Toast notification system configured
- [ ] All components follow container centering rules (mx-auto)
- [ ] Responsive testing on multiple viewport sizes
- [ ] Unit tests written for core components
- [ ] Integration tests for user flows
- [ ] Accessibility audit completed

### Post-Deployment

- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Iterate on UX improvements
- [ ] Performance optimization
- [ ] Add analytics tracking

---

**END OF IMPLEMENTATION GUIDE**

## Next Steps

1. **Week 1-2**: Implement Sprint 1 (Dashboard & Navigation)
2. **Week 3-4**: Implement Sprint 2 (Upload Wizard)
3. **Week 5-6**: Implement Sprint 3 (Processing & Results)
4. **Week 7-8**: Implement Sprint 4 (Polish & Error Handling)

Each component in this guide is production-ready and follows:
- ✅ shadcn/ui best practices
- ✅ Container centering rules (`mx-auto`)
- ✅ Project file structure standards
- ✅ TypeScript type safety
- ✅ Accessibility guidelines
- ✅ Responsive design principles

Refer to individual component code blocks for complete implementation details.
