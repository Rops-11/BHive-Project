import { User, Clock, Calendar } from "lucide-react"
import { StatsCard } from "@/components/Admin/Dashboard/statsCard"

export function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Bookings"
        value="1,234"
        change="+20.1% from last month"
        icon={<User className="h-4 w-4 text-muted-foreground" />}
        positive={true}
      />
      <StatsCard
        title="Over the counter Bookings"
        value="23"
        change="-4% from last month"
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        positive={false}
      />
      <StatsCard
        title="Today's Bookings"
        value="12"
        change="+8% from yesterday"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        positive={true}
      />
    </div>
  )
}
