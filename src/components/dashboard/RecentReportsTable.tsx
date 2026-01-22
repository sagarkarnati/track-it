"use client"

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
import { Download, FileSpreadsheet, Calendar, ArrowRight } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

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
      <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <CardContent className="flex flex-col items-center py-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 mb-6">
            <FileSpreadsheet className="h-16 w-16 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold mb-2 tracking-tight">No reports yet</h3>
          <p className="text-muted-foreground mb-8 text-center max-w-sm">
            Create your first attendance report to start tracking and analyzing employee data
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link href="/reports/new" className="inline-flex items-center gap-2">
              Create New Report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your latest attendance reports and processing history
          </p>
        </div>
        <Button variant="ghost" asChild className="group">
          <Link href="/reports" className="inline-flex items-center gap-2">
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Report Period</TableHead>
                  <TableHead className="font-semibold">Processed</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.slice(0, 5).map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{report.month}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(report.processedDate, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(report.processedDate, { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={report.status === "completed" ? "default" : "destructive"}
                        className={report.status === "completed" 
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800" 
                          : ""
                        }
                      >
                        {report.status === "completed" ? "Completed" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDownload(report.id)}
                        className="font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
