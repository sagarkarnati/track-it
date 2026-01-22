"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { ProgressSteps } from "./ProgressSteps"
import { FileDropzone } from "./FileDropzone"
import { FilePreview, type FilePreviewData } from "./FilePreview"
import { FileValidator, type ValidationResult } from "@/lib/file-validator"
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
    const [cosecValidation, setCosecValidation] = useState<ValidationResult | null>(null)
    const [bbhrValidation, setBbhrValidation] = useState<ValidationResult | null>(null)
    const [isValidating, setIsValidating] = useState(false)
    const [reportMonth, setReportMonth] = useState("")
    const [reportName, setReportName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleCosecFileSelect = async (file: File) => {
        setCosecFile(file)
        setIsValidating(true)
        setError(null)
        
        try {
            const validation = await FileValidator.validateCosecFile(file)
            setCosecValidation(validation)
            
            if (!validation.isValid) {
                setError("COSEC file validation failed. Please check the file and try again.")
            }
        } catch (err: any) {
            setError(`Failed to validate COSEC file: ${err.message}`)
            setCosecValidation(null)
        } finally {
            setIsValidating(false)
        }
    }

    const handleBbhrFileSelect = async (file: File) => {
        setBbhrFile(file)
        setIsValidating(true)
        setError(null)
        
        try {
            const validation = await FileValidator.validateBBHRFile(file)
            setBbhrValidation(validation)
            
            if (!validation.isValid) {
                setError("BBHR file validation failed. Please check the file and try again.")
            }
        } catch (err: any) {
            setError(`Failed to validate BBHR file: ${err.message}`)
            setBbhrValidation(null)
        } finally {
            setIsValidating(false)
        }
    }

    const handleNext = () => {
        setError(null)

        // Validation for Step 1
        if (currentStep === 1) {
            if (!cosecFile || !bbhrFile) {
                setError("Please upload both required files")
                return
            }
            if (!cosecValidation?.isValid || !bbhrValidation?.isValid) {
                setError("Please fix file validation errors before proceeding")
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

    const handleCosecFileRemove = () => {
        setCosecFile(null)
        setCosecValidation(null)
        setError(null)
    }

    const handleBbhrFileRemove = () => {
        setBbhrFile(null)
        setBbhrValidation(null)
        setError(null)
    }

    const handleProcess = async () => {
        setError(null)
        setIsProcessing(true)

        try {
            // Step 1: Create report
            const createResponse = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: reportName,
                    month: reportMonth,
                }),
            })

            if (!createResponse.ok) {
                throw new Error('Failed to create report')
            }

            const { report } = await createResponse.json()

            // Step 2: Upload files
            const formData = new FormData()
            formData.append('cosecFile', cosecFile!)
            formData.append('bbhrFile', bbhrFile!)

            const uploadResponse = await fetch(`/api/reports/${report.id}/upload`, {
                method: 'POST',
                body: formData,
            })

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload files')
            }

            // Step 3: Trigger processing
            const processResponse = await fetch(`/api/reports/${report.id}/process`, {
                method: 'POST',
            })

            if (!processResponse.ok) {
                throw new Error('Failed to start processing')
            }

            // Redirect to processing page
            router.push(`/reports/processing?id=${report.id}`)
        } catch (err: any) {
            setError(err.message || 'Failed to process report')
            setIsProcessing(false)
        }
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
            <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
                <div className="max-w-7xl mx-auto w-full">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-3xl font-bold tracking-tight">Create New Attendance Report</CardTitle>
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

                            {/* Validation Loading */}
                            {isValidating && (
                                <Alert className="mb-6">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <AlertDescription>Validating file... Please wait.</AlertDescription>
                                </Alert>
                            )}

                            {/* Step 1: Upload Files */}
                            {currentStep === 1 && (
                                <div className="space-y-8 mt-8">
                                    <div className="space-y-4">
                                        <FileDropzone
                                            label="COSEC Dump File"
                                            description="Upload the COSEC attendance dump file (.xlsx, .xls)"
                                            accept={{
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                                                "application/vnd.ms-excel": [".xls"],
                                            }}
                                            selectedFile={cosecFile}
                                            onFileSelect={handleCosecFileSelect}
                                            onFileRemove={handleCosecFileRemove}
                                        />
                                        
                                        {cosecValidation && (
                                            <FilePreview data={cosecValidation} fileType="COSEC" />
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <FileDropzone
                                            label="BBHR Time Off Schedule"
                                            description="Upload the BBHR time off schedule file (.xlsx, .xls)"
                                            accept={{
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                                                "application/vnd.ms-excel": [".xls"],
                                            }}
                                            selectedFile={bbhrFile}
                                            onFileSelect={handleBbhrFileSelect}
                                            onFileRemove={handleBbhrFileRemove}
                                        />
                                        
                                        {bbhrValidation && (
                                            <FilePreview data={bbhrValidation} fileType="BBHR" />
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Configure */}
                            {currentStep === 2 && (
                                <div className="space-y-6 mt-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="reportMonth" className="text-base font-semibold">Report Month *</Label>
                                        <Input
                                            id="reportMonth"
                                            type="month"
                                            value={reportMonth}
                                            onChange={(e) => setReportMonth(e.target.value)}
                                            placeholder="Select month"
                                            className="h-11"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Select the month for this attendance report
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reportName" className="text-base font-semibold">Report Name *</Label>
                                        <Input
                                            id="reportName"
                                            type="text"
                                            value={reportName}
                                            onChange={(e) => setReportName(e.target.value)}
                                            placeholder="e.g., January 2026 Attendance"
                                            className="h-11"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Give this report a descriptive name
                                        </p>
                                    </div>
                                </div>
                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <div className="space-y-6 mt-8">
                                    <div className="rounded-xl border-2 bg-slate-50 dark:bg-slate-900 p-8 space-y-6">
                                        <h3 className="font-bold text-xl">Review Report Details</h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b">
                                                <span className="text-sm font-semibold text-muted-foreground">Report Name:</span>
                                                <span className="text-sm font-semibold">{reportName}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b">
                                                <span className="text-sm font-semibold text-muted-foreground">Report Month:</span>
                                                <span className="text-sm font-semibold">{reportMonth}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b">
                                                <span className="text-sm font-semibold text-muted-foreground">COSEC File:</span>
                                                <span className="text-sm font-medium">{cosecFile?.name}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b">
                                                <span className="text-sm font-semibold text-muted-foreground">BBHR File:</span>
                                                <span className="text-sm font-medium">{bbhrFile?.name}</span>
                                            </div>

                                            {cosecValidation && (
                                                <div className="flex justify-between py-3 border-b">
                                                    <span className="text-sm font-semibold text-muted-foreground">Total Data Rows:</span>
                                                    <span className="text-sm font-semibold">{(cosecValidation.rowCount + bbhrValidation!.rowCount).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <AlertDescription className="text-blue-900 dark:text-blue-100">
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
                                    disabled={currentStep === 1 || isProcessing || isValidating}
                                    className="h-11 px-6"
                                >
                                    Back
                                </Button>

                                {currentStep < 3 ? (
                                    <Button 
                                        onClick={handleNext} 
                                        disabled={isProcessing || isValidating}
                                        className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        Next →
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleProcess} 
                                        disabled={isProcessing || isValidating}
                                        className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Process Report"
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div  </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
