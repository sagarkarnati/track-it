import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface HeroCardProps {
  userName: string
  lastReportDate?: Date
  lastReportMonth?: string
}

export function HeroCard({ userName, lastReportDate, lastReportMonth }: HeroCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Welcome Back, {userName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastReportDate && lastReportMonth ? (
          <p className="text-muted-foreground">
            Last report: {lastReportMonth} ({formatDistanceToNow(lastReportDate, { addSuffix: true })})
          </p>
        ) : (
          <p className="text-muted-foreground">
            Ready to process your first attendance report
          </p>
        )}
      </CardContent>
    </Card>
  )
}
