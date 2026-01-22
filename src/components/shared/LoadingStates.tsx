import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-6">
      <div className="grid gap-6 max-w-7xl mx-auto w-full">
        {/* Hero Card Skeleton */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-px" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </CardContent>
        </Card>

        {/* CTA Card Skeleton */}
        <Skeleton className="h-64 w-full rounded-xl" />

        {/* Table Skeleton */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ReportListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function UploadWizardSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="max-w-7xl mx-auto w-full">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 space-y-8">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-11 w-24" />
              <Skeleton className="h-11 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
