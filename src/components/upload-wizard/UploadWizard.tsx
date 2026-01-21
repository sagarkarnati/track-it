"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ProgressSteps } from "./ProgressSteps"
import { FileDropzone } from "./FileDropzone"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const steps = [
    {
        id: 1,
        title: "Upload Files",
        description: "Select input files",
    },
    {
        id: 2,
        title: "Configure",
        description: "Set report details",
    },
    {
        id: 3,
        title: "Review",
        description: "Confirm and process",
    },
]

export function UploadWizard() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [cosecFile, setCosecFile] = useState<File | null>(null)
    const [bbhrFile, setBbhrFile] = useState<File | null>(null)
    const [reportMonth, setReportMonth] = useState("")
    const [reportName, setReportName] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleNext = () => {
        setError(null)

        // Validation for Step 1
        if (currentStep === 1) {
            if (!cosecFile || !bbhrFile) {
                setError("Please upload both required files")
                return
            }
        }

        // Validation for Step 2
        if (currentStep === 2) {
            if (!reportMonth || !reportName) {
                setError("Please fill in all required fields")
                return
            }
        }

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        setError(null)
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleProcess = async () => {
        setError(null)

        // TODO: Implement actual file processing API call
        console.log("Processing files:", {
            cosecFile: cosecFile?.name,
            bbhrFile: bbhrFile?.name,
            reportMonth,
            reportName,
        })

        // Simulate processing
        setTimeout(() => {
            router.push("/reports/processing")
        }, 1000)
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/reports">Reports</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>New Report</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Attendance Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Steps */}
                        <ProgressSteps steps={steps} currentStep={currentStep} />

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Step 1: Upload Files */}
                        {currentStep === 1 && (
                            <div className="space-y-6 mt-12">
                                <FileDropzone
                                    label="COSEC Dump File"
                                    description="Upload the COSEC attendance dump file (.xlsx, .xls, .csv)"
                                    accept={{
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                                        "application/vnd.ms-excel": [".xls"],
                                        "text/csv": [".csv"],
                                    }}
                                    selectedFile={cosecFile}
                                    onFileSelect={setCosecFile}
                                    onFileRemove={() => setCosecFile(null)}
                                />

                                <FileDropzone
                                    label="BBHR Time Off Schedule"
                                    description="Upload the BBHR time off schedule file (.xlsx, .xls, .csv)"
                                    accept={{
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                                        "application/vnd.ms-excel": [".xls"],
                                        "text/csv": [".csv"],
                                    }}
                                    selectedFile={bbhrFile}
                                    onFileSelect={setBbhrFile}
                                    onFileRemove={() => setBbhrFile(null)}
                                />
                            </div>
                        )}

                        {/* Step 2: Configure */}
                        {currentStep === 2 && (
                            <div className="space-y-6 mt-12">
                                <div className="space-y-2">
                                    <Label htmlFor="reportMonth">Report Month *</Label>
                                    <Input
                                        id="reportMonth"
                                        type="month"
                                        value={reportMonth}
                                        onChange={(e) => setReportMonth(e.target.value)}
                                        placeholder="Select month"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Select the month for this attendance report
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reportName">Report Name *</Label>
                                    <Input
                                        id="reportName"
                                        type="text"
                                        value={reportName}
                                        onChange={(e) => setReportName(e.target.value)}
                                        placeholder="e.g., January 2026 Attendance"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Give this report a descriptive name
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 3 && (
                            <div className="space-y-6 mt-12">
                                <div className="rounded-lg border p-6 space-y-4">
                                    <h3 className="font-semibold text-lg">Review Report Details</h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm font-medium">Report Name:</span>
                                            <span className="text-sm">{reportName}</span>
                                        </div>

                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm font-medium">Report Month:</span>
                                            <span className="text-sm">{reportMonth}</span>
                                        </div>

                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm font-medium">COSEC File:</span>
                                            <span className="text-sm">{cosecFile?.name}</span>
                                        </div>

                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-sm font-medium">BBHR File:</span>
                                            <span className="text-sm">{bbhrFile?.name}</span>
                                        </div>
                                    </div>

                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Please review the details carefully before processing. This action will
                                            generate the attendance report based on the uploaded files.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                            >
                                Back
                            </Button>

                            {currentStep < 3 ? (
                                <Button onClick={handleNext}>
                                    Next →
                                </Button>
                            ) : (
                                <Button onClick={handleProcess}>
                                    Process Report
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
