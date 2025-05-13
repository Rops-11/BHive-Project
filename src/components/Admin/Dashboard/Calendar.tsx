import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function BookingCalendar() {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const prevMonthDays = [27, 28, 29, 30]
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Calendar</CardTitle>
        <CardDescription>View and manage all bookings in calendar view</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">May 2025</h3>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 text-center">
          {days.map((day) => (
            <div key={day} className="py-2 text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {prevMonthDays.map((day) => (
            <div key={`prev-${day}`} className="py-2 text-sm text-muted-foreground/50">
              {day}
            </div>
          ))}
          {currentMonthDays.slice(0, 10).map((day) => (
            <div
              key={`current-${day}`}
              className={cn(
                "py-2 text-sm",
                day === 1 && "font-medium",
                day === 2 && "font-medium",
                day === 3 && "font-medium",
              )}
            >
              {day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
