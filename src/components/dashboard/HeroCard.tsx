import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDistanceToNow, format } from "date-fns"
import { Clock, CheckCircle2, TrendingUp } from "lucide-react"

interface HeroCardProps {
  userName: string
  lastReportDate?: Date
  lastReportMonth?: string
}

export function HeroCard({ userName, lastReportDate, lastReportMonth }: HeroCardProps) {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{greeting},</p>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {userName}
            </CardTitle>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Active</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {lastReportDate && lastReportMonth ? (
            <>
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Report Processed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lastReportMonth} • {formatDistanceToNow(lastReportDate, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    All Systems Ready
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ready to process new reports
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ready to Get Started
                </p>
                <p className="text-xs text-muted-foreground">
                  Process your first attendance report and track employee data efficiently
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
