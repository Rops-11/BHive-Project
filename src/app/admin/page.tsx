"use client"

import type React from "react"
import { User, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { DashboardTabs } from "@/components/Admin/Dashboard/dashboardTabs"
import AdminHeader from "@/components/Admin/AdminHeader"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <AdminHeader />
      <main className="flex-1 p-6 md:p-10">
        <DashboardTabs />
      </main>
    </div>
  )
}


//sample nii
function RecentBookings() {
  const bookings = [
    {
      id: 1,
      name: "Olivia Martin",
      service: "Spa Treatment",
      time: "2:00 PM",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Jackson Lee",
      service: "Room Booking",
      time: "3:30 PM",
      status: "pending",
    },
    {
      id: 3,
      name: "Isabella Nguyen",
      service: "Restaurant",
      time: "7:00 PM",
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
                    {booking.service} · {booking.time}
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
