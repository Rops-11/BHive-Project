"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/Admin/Dashboard/statsCards"
import { BookingCalendar } from "@/components/Admin/Dashboard/Calendar"
import { RecentBookings } from "@/components/Admin/Dashboard/recentBookings"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6 bg-muted/50">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="quick-access">Quick Access</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-6">
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2">
          <BookingCalendar />
          <RecentBookings />
        </div>
      </TabsContent>
      <TabsContent value="bookings">
        <div className="text-center py-10 text-muted-foreground">Bookings content will appear here</div>
      </TabsContent>
      <TabsContent value="history">
        <div className="text-center py-10 text-muted-foreground">History content will appear here</div>
      </TabsContent>
      <TabsContent value="quick-access">
        <div className="text-center py-10 text-muted-foreground">Quick Access content will appear here</div>
      </TabsContent>
    </Tabs>
  )
}
