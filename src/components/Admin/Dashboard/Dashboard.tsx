"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, Filter, Hotel, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { Booking } from "@/types/types";
import useGetAllBookings from "@/hooks/bookingHooks/useGetAllBookings";
import { isFuture, parseISO, startOfDay } from "date-fns";
import BookingCard from "../BookingCard";

const getStartOfDay = (date: string | Date | undefined): Date | null => {
  if (!date) return null;
  return startOfDay(typeof date === "string" ? parseISO(date) : date);
};

export function Dashboard() {
  const [filterValue, setFilterValue] = useState("all");
  const {
    bookings: allBookingsData,
    loading,
    error,
    getAllBookings: refetchAllBookings,
  } = useGetAllBookings();

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching bookings: ${error}`);
    }
  }, [error]);

  const handleRefresh = () => {
    refetchAllBookings();
  };

  const processedBookings = useMemo(() => {
    if (!allBookingsData) {
      return { ongoing: [], expecting: [], new: [], filteredForTabs: [] };
    }
    const todayStart = startOfDay(new Date());

    let filteredByDropdown = allBookingsData;
    if (filterValue !== "all") {
      filteredByDropdown = allBookingsData.filter((booking) => {
        if (filterValue === "Today") {
          const checkInDay = getStartOfDay(booking.checkIn);
          return checkInDay && checkInDay.getTime() === todayStart.getTime();
        }
        if (filterValue === "OTC") return booking.bookingType === "OTC";
        if (filterValue === "Online") return booking.bookingType === "Online";
        return true;
      });
    }

    const ongoing: Booking[] = [];
    const expecting: Booking[] = [];
    const newBookingsForTab: Booking[] = [];

    filteredByDropdown.forEach((booking) => {
      const checkInDate = getStartOfDay(booking.checkIn);
      const checkOutDate = getStartOfDay(booking.checkOut);
      const dateBookedComparable = getStartOfDay(booking.dateBooked);

      if (
        dateBookedComparable &&
        dateBookedComparable.getTime() === todayStart.getTime()
      ) {
        newBookingsForTab.push(booking);
      }

      if (
        booking.status === "Ongoing" ||
        (checkInDate &&
          checkOutDate &&
          checkInDate <= todayStart &&
          checkOutDate >= todayStart &&
          booking.status !== "Cancelled")
      ) {
        ongoing.push(booking);
      } else if (
        checkInDate &&
        isFuture(checkInDate) &&
        booking.status !== "Cancelled"
      ) {
        expecting.push(booking);
      }
    });

    return {
      ongoing,
      expecting,
      new: newBookingsForTab,
      filteredForTabs: filteredByDropdown,
    };
  }, [allBookingsData, filterValue]);

  const { ongoing, expecting, new: newCategorized } = processedBookings;

  const totalBookingsForDisplay = useMemo(
    () => processedBookings.filteredForTabs.length,
    [processedBookings.filteredForTabs]
  );

  const newBookingsCountForStat = useMemo(() => {
    if (!allBookingsData) return 0;
    const todayStart = startOfDay(new Date());
    return allBookingsData.filter((b) => {
      const dateBookedComparable = getStartOfDay(b.dateBooked);
      return (
        dateBookedComparable &&
        dateBookedComparable.getTime() === todayStart.getTime()
      );
    }).length;
  }, [allBookingsData]);

  const occupancyRate = useMemo(() => {
    if (!allBookingsData) return 0;
    const todayStart = startOfDay(new Date());
    const currentlyOngoingCount = allBookingsData.filter((b) => {
      const checkInDate = getStartOfDay(b.checkIn);
      const checkOutDate = getStartOfDay(b.checkOut);
      return (
        b.status === "Ongoing" ||
        (checkInDate &&
          checkOutDate &&
          checkInDate <= todayStart &&
          checkOutDate >= todayStart &&
          b.status !== "Cancelled")
      );
    }).length;

    const totalRooms = 20;
    return totalRooms > 0
      ? Math.round((currentlyOngoingCount / totalRooms) * 100)
      : 0;
  }, [allBookingsData]);

  const renderBookingList = (
    bookingsToList: Booking[],
    isLoadingFlag: boolean,
    skeletonCount: number
  ) => {
    if (isLoadingFlag) {
      return Array(skeletonCount)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={`skel-${i}-${Math.random()}`}
            className="h-24 w-full rounded-lg"
          />
        ));
    }
    if (!bookingsToList || bookingsToList.length === 0) {
      return (
        <div className="text-sm text-muted-foreground text-center py-4">
          No bookings in this category for the current filter.
        </div>
      );
    }
    return bookingsToList.map((booking) => (
      <BookingCard
        key={booking.id}
        booking={booking}
        refetchBookings={refetchAllBookings}
      />
    ));
  };

  return (
    <div className="w-full bg-background min-h-screen">
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Select
              value={filterValue}
              onValueChange={setFilterValue}
              disabled={loading}>
              <SelectTrigger className="w-[200px]">
                <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
                <SelectValue placeholder="Filter by type/date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="Today">Today&apos;s Check-ins</SelectItem>
                <SelectItem value="OTC">Over the Counter</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}>
              <RefreshCcw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="sr-only">Refresh data</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading && !allBookingsData ? (
                <Skeleton className="h-8 w-1/2 my-1" />
              ) : (
                <div className="text-2xl font-bold">
                  {totalBookingsForDisplay}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                +{newBookingsCountForStat} new bookings (booked today)
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <Hotel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading && !allBookingsData ? (
                <Skeleton className="h-8 w-1/4 my-1" />
              ) : (
                <div className="text-2xl font-bold">{occupancyRate}%</div>
              )}
              <div className="text-xs text-muted-foreground">
                {allBookingsData ? (
                  20 -
                  allBookingsData.filter((b) => {
                    const checkInDate = getStartOfDay(b.checkIn);
                    const checkOutDate = getStartOfDay(b.checkOut);
                    const todayStart = startOfDay(new Date());
                    return (
                      b.status === "Ongoing" ||
                      (checkInDate &&
                        checkOutDate &&
                        checkInDate <= todayStart &&
                        checkOutDate >= todayStart &&
                        b.status !== "Cancelled")
                    );
                  }).length
                ) : (
                  <span>
                    <Skeleton className="h-4 w-12 inline-block" />
                  </span>
                )}{" "}
                rooms available
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="ongoing"
          className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger
              value="ongoing"
              data-testid="checked-in"
              className="relative">
              Checked In
              {!loading && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs absolute -top-2 -right-2">
                  {ongoing.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="expecting"
              data-testid="arriving"
              className="relative">
              Arriving
              {!loading && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs absolute -top-2 -right-2">
                  {expecting.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="new"
              data-testid="new-bookings"
              className="relative">
              New (Booked Today)
              {!loading && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs absolute -top-2 -right-2">
                  {newCategorized.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="ongoing"
            className="space-y-4">
            {renderBookingList(ongoing, loading, 3)}
          </TabsContent>
          <TabsContent
            value="expecting"
            className="space-y-4">
            {renderBookingList(expecting, loading, 4)}
          </TabsContent>
          <TabsContent
            value="new"
            className="space-y-4">
            {renderBookingList(newCategorized, loading, 2)}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
