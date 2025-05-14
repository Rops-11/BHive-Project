import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

export function RecentBookings() {
  const bookings = [
    {
      id: 1,
      name: "Regine Barte",
      rooms: "Twin Bee -2A",
      checkin: "01.12.2025",
      checkout: "01.12.2025",
      status: "confirmed",
    
    },
    {
      id: 2,
      name: "John Rofer Casio",
      rooms: "Twin Bee -2A",
      checkin: "01.12.2025",
      checkout: "01.12.2025",
      status: "confirmed",
    },
    {
      id: 3,
      name: "Nicholae sara",
      rooms: "Twin Bee -2A",
      checkin: "01.12.2025",
      checkout: "01.12.2025",
      status: "confirmed",
    
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>You have 12 bookings today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <User className="h-5 w-5" />
                </Avatar>
                <div>
                  <p className="font-medium">{booking.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.checkin} · {booking.checkout}
                  </p>
                </div>
              </div>
              <Badge
                variant={booking.status === "confirmed" ? "default" : "outline"}
                className={cn(
                  booking.status === "confirmed" ? "bg-black hover:bg-black/90 text-white" : "text-muted-foreground",
                )}
              >
                {booking.status === "confirmed" ? "Confirmed" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
