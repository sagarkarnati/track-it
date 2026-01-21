"use client"

import { HeroCard } from "@/components/dashboard/HeroCard"
import { CTACard } from "@/components/dashboard/CTACard"
import { RecentReportsTable } from "@/components/dashboard/RecentReportsTable"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  // Mock data - will be replaced with API calls
  const userName = "HR Manager"
  const lastReportDate = new Date(2024, 11, 15) // December 15, 2024
  const lastReportMonth = "December 2024"

  const mockReports = [
    {
      id: "1",
      month: "December 2024",
      processedDate: new Date(2024, 11, 15),
      status: "completed" as const,
    },
    {
      id: "2",
      month: "November 2024",
      processedDate: new Date(2024, 10, 12),
      status: "completed" as const,
    },
    {
      id: "3",
      month: "October 2024",
      processedDate: new Date(2024, 9, 10),
      status: "completed" as const,
    },
  ]

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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4">
          {/* Hero Section */}
          <HeroCard
            userName={userName}
            lastReportDate={lastReportDate}
            lastReportMonth={lastReportMonth}
          />

          {/* CTA Section */}
          <CTACard />

          {/* Recent Reports Section */}
          <RecentReportsTable
            reports={mockReports}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </>
  )
}
