"use client"

import { useState } from "react"
import { Calendar, Filter, Hotel, RefreshCcw } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookingCard } from "@/components/Admin/Dashboard/BookingCard"
import { Skeleton } from "@/components/ui/skeleton"

const ongoingBookings = [
  { id: "1", customerName: "John Smith", guests: 2, paymentStatus: "Paid" },
  { id: "2", customerName: "Sarah Johnson", guests: 1, paymentStatus: "Paid" },
  { id: "3", customerName: "Michael Brown", guests: 3, paymentStatus: "Pending" },
]

const expectingBookings = [
  { id: "4", customerName: "Emily Davis", guests: 2, paymentStatus: "Paid" },
  { id: "5", customerName: "Robert Wilson", guests: 4, paymentStatus: "Paid" },
  { id: "6", customerName: "Jennifer Lee", guests: 1, paymentStatus: "Paid" },
  { id: "7", customerName: "David Miller", guests: 2, paymentStatus: "Pending" },
]

const newBookings = [
  { id: "8", customerName: "Jessica Taylor", guests: 2, paymentStatus: "Paid" },
  { id: "9", customerName: "Thomas Anderson", guests: 1, paymentStatus: "Pending" },
]

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterValue, setFilterValue] = useState("all")

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const totalBookings = ongoingBookings.length + expectingBookings.length + newBookings.length
  const occupancyRate = Math.round((ongoingBookings.length / 20) * 100)

  return (
    <div className="w-full bg-background min-h-screen">
      <main className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="Today">Today&apos;s Bookings</SelectItem>
                <SelectItem value="OTC">Over the counter</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <CardDescription>All active and upcoming</CardDescription>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBookings}</div>
              <div className="text-xs text-muted-foreground mt-1">+{newBookings.length} new today</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <CardDescription>Current room usage</CardDescription>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Hotel className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{occupancyRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">{20 - ongoingBookings.length} rooms available</div>
              <div className="mt-4">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${occupancyRate}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ongoing" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="ongoing" className="relative">
                Ongoing
                <Badge className="ml-2 px-1.5 h-5 absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  {ongoingBookings.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="expecting" className="relative">
                Expecting
                <Badge className="ml-2 px-1.5 h-5 absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  {expectingBookings.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="new" className="relative">
                New
                <Badge className="ml-2 px-1.5 h-5 absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  {newBookings.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ongoing" className="space-y-4">
            {isRefreshing
              ? Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              : ongoingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
          </TabsContent>

          <TabsContent value="expecting" className="space-y-4">
            {isRefreshing
              ? Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              : expectingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            {isRefreshing
              ? Array(2).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))
              : newBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
