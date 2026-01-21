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
