import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, ArrowRight, Sparkles } from "lucide-react"

export function CTACard() {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />

      {/* Animated overlay pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

      <CardContent className="relative pt-10 pb-12 px-8 text-center">
        {/* Icon with glow effect */}
        <div className="mb-6 inline-flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
            <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
              <FileSpreadsheet className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-white" />
          <span className="text-xs font-medium text-white">Quick Start</span>
        </div>

        {/* Title */}
        <CardTitle className="text-3xl font-bold mb-3 text-white tracking-tight">
          Create Attendance Report
        </CardTitle>

        {/* Description */}
        <CardDescription className="text-blue-50 mb-8 text-base max-w-md mx-auto">
          Upload your files and process attendance data in minutes with automated validation and insights
        </CardDescription>

        {/* CTA Button */}
        <Button
          size="lg"
          asChild
          className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 h-12 px-8 font-semibold"
        >
          <Link href="/reports/new" className="inline-flex items-center gap-2">
            Create New Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
