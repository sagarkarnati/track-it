import { Suspense } from "react"
import { ProcessingView } from "@/components/processing/ProcessingView"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProcessingPage() {
    return (
        <Suspense fallback={<ProcessingFallback />}>
            <ProcessingView />
        </Suspense>
    )
}

function ProcessingFallback() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
            <Skeleton className="h-64 w-full max-w-2xl" />
        </div>
    )
}
