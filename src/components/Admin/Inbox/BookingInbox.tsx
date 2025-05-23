"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Inbox, Search } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useGetAllBookings from "@/hooks/bookingHooks/useGetAllBookings";
import BookingCard from "./BookingCard";
import { Booking } from "@/types/types";
import { toast } from "react-toastify";

const REFRESH_INTERVAL = 300000; //! This is 5 mins.

type BookingFilterOptionValue =
  | "upcoming"
  | "all"
  | "statusOngoing"
  | "statusReserved"
  | "statusComplete";

const filterOptions: Array<{ value: BookingFilterOptionValue; label: string }> =
  [
    { value: "upcoming", label: "Upcoming & Current" },
    { value: "all", label: "All Bookings" },
    { value: "statusOngoing", label: "Status: Ongoing" },
    { value: "statusReserved", label: "Status: Reserved" },
    { value: "statusComplete", label: "Status: Complete" },
  ];

const BookingInbox = () => {
  const {
    bookings,
    loading,
    getAllBookings: refetchBookings,
  } = useGetAllBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<BookingFilterOptionValue>("upcoming");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const handleFetchBookings = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
    } else {
      toast.info("Auto-refreshing bookings...");
    }
    await refetchBookings();
  };

  useEffect(() => {
    if (isInitialLoad && !loading) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, loading]);

  useEffect(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    const id = setInterval(() => {
      handleFetchBookings(true);
    }, REFRESH_INTERVAL);
    intervalIdRef.current = id;

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  const filteredBookings = bookings
    ? bookings
        .filter((booking: Booking) => {
          if (!booking) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          switch (activeFilter) {
            case "upcoming":
              if (!booking.checkIn) return false;
              const checkInDate = new Date(booking.checkIn);
              checkInDate.setHours(0, 0, 0, 0);
              return checkInDate >= today;
            case "statusOngoing":
              return booking.status === "Ongoing";
            case "statusReserved":
              return booking.status === "Reserved";
            case "statusComplete":
              return booking.status === "Complete";
            case "all":
            default:
              return true;
          }
        })
        .filter((booking: Booking) =>
          (booking.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const onManualRefreshClick = () => {
    if (isInitialLoad) setIsInitialLoad(false);
    handleFetchBookings(false);
  };

  const getEmptyStateMessage = () => {
    if (loading && isInitialLoad) {
      return null;
    }

    if (bookings && bookings.length > 0 && filteredBookings.length === 0) {
      const currentFilterLabel =
        filterOptions
          .find((opt) => opt.value === activeFilter)
          ?.label.toLowerCase() || "current view";
      if (searchTerm.trim() !== "") {
        return `No bookings match "${searchTerm}" for ${currentFilterLabel}.`;
      }
      return `No bookings found for ${currentFilterLabel}.`;
    }

    if (!loading && (!bookings || bookings.length === 0)) {
      return "No bookings at the moment.";
    }

    return null;
  };

  const emptyStateMessage = getEmptyStateMessage();

  return (
    <div className="flex flex-col w-full h-full space-y-4 flex-grow">
      <Card className="shrink-0">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-4">
            Booking Inbox
          </CardTitle>
          <div className="flex flex-col sm:flex-row w-full gap-3 items-center mx-auto">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter by booker name..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={loading && isInitialLoad}
              />
            </div>

            <Select
              value={activeFilter}
              onValueChange={(value) =>
                setActiveFilter(value as BookingFilterOptionValue)
              }
              disabled={loading && isInitialLoad}>
              <SelectTrigger className="w-full sm:w-auto sm:min-w-[200px] shrink-0">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto shrink-0"
              onClick={onManualRefreshClick}
              disabled={loading}>
              {loading && !isInitialLoad ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh"
              )}
            </Button>

            <Button
              type="button"
              size="lg"
              variant="outline"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setSearchTerm("")}
              disabled={(loading && isInitialLoad) || searchTerm === ""}>
              Clear Search
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading && isInitialLoad && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">Loading bookings...</p>
        </div>
      )}

      {!isInitialLoad && emptyStateMessage && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">{emptyStateMessage}</p>
        </div>
      )}

      {!isInitialLoad && !emptyStateMessage && filteredBookings.length > 0 && (
        <div className="w-full flex-grow space-y-4 h-full overflow-y-scroll pb-10">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              refetchBookings={refetchBookings}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingInbox;
