"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Sample data for bookings
const bookings = [
  {
    id: "B001",
    guestName: "peter pan",
    roomName: "DELUXE BEE-2C",
    checkIn: "2025-05-14",
    checkOut: "2025-05-16",
    status: "Confirmed",
    totalAmount: "2,450.00PHP",
  },
  {
    id: "B002",
    guestName: " Reggggggggg",
    roomName: "Family -3-B",
    checkIn: "2025-05-15",
    checkOut: "2025-05-17",
    status: "Pending",
    totalAmount: "2,800.00PHP",
  },
  {
    id: "B003",
    guestName: "RORRROROROR",
    roomName: "SINGLE -1A",
    checkIn: "2025-05-16",
    checkOut: "2025-05-20",
    status: "Confirmed",
    totalAmount: "2,450.00PHP",
  },
  {
    id: "B004",
    guestName: "Nicholaeee",
    roomName: "QUEEN BEE -2A",
    checkIn: "2025-05-18",
    checkOut: "2025-05-22",
    status: "Cancelled",
    totalAmount: "1890.00PHP",
  },
]

export default function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Calendar</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="deluxe">Deluxe Suites</SelectItem>
              <SelectItem value="standard">Standard Rooms</SelectItem>
              <SelectItem value="executive">Executive Suites</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            <div className="w-full mt-6">
              <h3 className="text-lg font-semibold mb-4">Bookings for {date?.toLocaleDateString()}</h3>
              <div className="space-y-3">
                {bookings
                  .filter(
                    (booking) =>
                      new Date(booking.checkIn).toDateString() === date?.toDateString() ||
                      new Date(booking.checkOut).toDateString() === date?.toDateString(),
                  )
                  .map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{booking.guestName}</p>
                            <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              Check {new Date(booking.checkIn).toDateString() === date?.toDateString() ? "In" : "Out"}
                            </p>
                            <Badge
                              variant={
                                booking.status === "Confirmed"
                                  ? "default"
                                  : booking.status === "Pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {!bookings.some(
                  (booking) =>
                    new Date(booking.checkIn).toDateString() === date?.toDateString() ||
                    new Date(booking.checkOut).toDateString() === date?.toDateString(),
                ) && <p className="text-muted-foreground text-center py-4">No bookings for this date</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
