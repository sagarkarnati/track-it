"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
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

type ProcessingStatus = "processing" | "completed" | "failed"

export function ProcessingView() {
    const router = useRouter()
    const [status, setStatus] = useState<ProcessingStatus>("processing")
    const [progress, setProgress] = useState(0)
    const [currentTask, setCurrentTask] = useState("Initializing...")

    useEffect(() => {
        // Simulate processing steps
        const tasks = [
            { label: "Reading COSEC file...", duration: 1000 },
            { label: "Reading BBHR file...", duration: 1000 },
            { label: "Validating data...", duration: 1500 },
            { label: "Processing attendance records...", duration: 2000 },
            { label: "Generating report...", duration: 1500 },
            { label: "Finalizing...", duration: 1000 },
        ]

        let currentProgress = 0
        let taskIndex = 0

        const processNextTask = () => {
            if (taskIndex < tasks.length) {
                const task = tasks[taskIndex]
                setCurrentTask(task.label)

                setTimeout(() => {
                    currentProgress += 100 / tasks.length
                    setProgress(Math.min(currentProgress, 100))
                    taskIndex++
                    processNextTask()
                }, task.duration)
            } else {
                // Randomly simulate success or failure (90% success rate)
                const isSuccess = Math.random() > 0.1
                setStatus(isSuccess ? "completed" : "failed")
            }
        }

        processNextTask()
    }, [])

    const handleDownload = () => {
        // TODO: Implement actual download
        console.log("Downloading report...")
    }

    const handleRetry = () => {
        router.push("/reports/new")
    }

    const handleGoToDashboard = () => {
        router.push("/")
    }

    if (status === "completed") {
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
                                    <BreadcrumbPage>Processing</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl">Report Generated Successfully!</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Your attendance report has been processed and is ready for download.
                                </AlertDescription>
                            </Alert>

                            <div className="flex gap-3">
                                <Button onClick={handleDownload} className="flex-1">
                                    Download Report
                                </Button>
                                <Button variant="outline" onClick={handleGoToDashboard}>
                                    Go to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    }

    if (status === "failed") {
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
                                    <BreadcrumbPage>Processing</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-2xl">Processing Failed</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    There was an error processing your files. This could be due to:
                                    <ul className="list-disc ml-5 mt-2 space-y-1">
                                        <li>Invalid file format</li>
                                        <li>Missing required columns</li>
                                        <li>Data validation errors</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>

                            <div className="flex gap-3">
                                <Button onClick={handleRetry} className="flex-1">
                                    Try Again
                                </Button>
                                <Button variant="outline" onClick={handleGoToDashboard}>
                                    Go to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
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
                                <BreadcrumbPage>Processing</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                            </div>
                            <CardTitle className="text-2xl">Processing Your Report</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{currentTask}</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Please don't close this page while we process your files.
                                This may take a few moments.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </>
        </div >
    )
}
