"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
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
import { Input } from "@/components/ui/input"
import { Download, Search, Filter } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
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

interface Report {
    id: string
    name: string
    month: string
    processedDate: Date
    status: "completed" | "failed"
    fileSize: string
}

export function ReportsTable() {
    const [searchQuery, setSearchQuery] = useState("")

    // Mock data - will be replaced with API calls
    const allReports: Report[] = [
        {
            id: "1",
            name: "January 2026 Attendance",
            month: "January 2026",
            processedDate: new Date(2026, 0, 15),
            status: "completed",
            fileSize: "2.3 MB",
        },
        {
            id: "2",
            name: "December 2025 Attendance",
            month: "December 2025",
            processedDate: new Date(2025, 11, 12),
            status: "completed",
            fileSize: "2.1 MB",
        },
        {
            id: "3",
            name: "November 2025 Attendance",
            month: "November 2025",
            processedDate: new Date(2025, 10, 10),
            status: "completed",
            fileSize: "2.2 MB",
        },
        {
            id: "4",
            name: "October 2025 Attendance",
            month: "October 2025",
            processedDate: new Date(2025, 9, 8),
            status: "failed",
            fileSize: "-",
        },
    ]

    const filteredReports = allReports.filter(
        (report) =>
            report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.month.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDownload = (reportId: string) => {
        console.log("Downloading report:", reportId)
        // TODO: Implement actual download logic
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
                                <BreadcrumbPage>Reports</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">All Reports</h1>
                        <p className="text-muted-foreground mt-1">
                            View and download your attendance reports
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/reports/new">+ Create New Report</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredReports.length === 0 ? (
                            <div className="flex flex-col items-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                                <p className="text-muted-foreground mb-6">
                                    {searchQuery
                                        ? "Try adjusting your search criteria"
                                        : "Create your first report to get started"}
                                </p>
                                {!searchQuery && (
                                    <Button asChild>
                                        <Link href="/reports/new">Create New Report →</Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Report Name</TableHead>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Processed</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="font-medium">{report.name}</TableCell>
                                            <TableCell>{report.month}</TableCell>
                                            <TableCell>
                                                {formatDistanceToNow(report.processedDate, {
                                                    addSuffix: true,
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        report.status === "completed" ? "default" : "destructive"
                                                    }
                                                >
                                                    {report.status === "completed" ? "✓ Done" : "✗ Failed"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {report.fileSize}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {report.status === "completed" ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownload(report.id)}
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" disabled>
                                                        N/A
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
