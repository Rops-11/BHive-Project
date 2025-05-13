"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import BookingsTable from "@/components/Admin/BookingsTable"
import BookingCalendar from "@/components/Admin/BookingCalendar"
import RoomManagement from "@/components/Admin/RoomManagement"

export default function BookingDashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 pt-20">
          <SidebarInset>
            <div className="flex flex-col h-full">
              <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                <div className="flex items-center gap-4 w-full">
                  <form className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search bookings..." className="pl-8 rounded-lg bg-background" />
                  </form>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Booking
                  </Button>
                </div>
              </div>
              <main className="flex-1 overflow-auto p-6">
                <Tabs defaultValue="bookings" className="h-full">
                  <div className="flex items-center justify-between mb-6">
                    <TabsList>
                      <TabsTrigger value="bookings">Bookings</TabsTrigger>
                      <TabsTrigger value="calendar">Calendar</TabsTrigger>
                      <TabsTrigger value="rooms">Room Management</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="bookings" className="h-full">
                    <div className="h-full w-full overflow-auto">
                      <BookingsTable />
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar" className="h-full">
                    <div className="h-full w-full overflow-auto">
                      <BookingCalendar />
                    </div>
                  </TabsContent>

                  <TabsContent value="rooms" className="h-full">
                    <RoomManagement />
                  </TabsContent>
                </Tabs>
              </main>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
