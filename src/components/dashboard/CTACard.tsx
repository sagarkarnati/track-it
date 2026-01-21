import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"

export function CTACard() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-none text-white">
      <CardContent className="pt-6 pb-8 px-8 text-center">
        <div className="mb-4">
          <FileSpreadsheet className="h-16 w-16 mx-auto" />
        </div>
        <CardTitle className="text-2xl mb-2 text-white">
          NEW ATTENDANCE REPORT
        </CardTitle>
        <CardDescription className="text-blue-50 mb-6">
          Process attendance data for the current month
        </CardDescription>
        <Button 
          size="lg" 
          asChild
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          <Link href="/reports/new">
            Create New Report →
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
