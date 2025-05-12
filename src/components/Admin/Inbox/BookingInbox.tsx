import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Inbox, Search } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import useGetAllBookings from "@/hooks/bookingHooks/useGetAllBookings";
import BookingCard from "./BookingCard";
import { Booking } from "@/types/types";

const BookingInbox = () => {
  const { bookings, loading } = useGetAllBookings();
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input

  const filteredBookings = bookings
    ? bookings.filter((booking: Booking) =>
        (booking.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getEmptyStateMessage = () => {
    if (loading) {
      return null;
    }
    if (bookings && bookings.length > 0 && filteredBookings.length === 0) {
      return "No bookings found matching your search.";
    }
    if (bookings && bookings.length === 0) {
      return "No bookings at the moment.";
    }
    return null;
  };

  const emptyStateMessage = getEmptyStateMessage();

  return (
    <div className="flex flex-col w-full overflow-y-scroll h-full space-y-4 flex-grow">
      <Card className="shrink-0">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center mb-4">
            Booking Inbox
          </CardTitle>
          <div className="flex flex-col sm:flex-row w-full gap-3 items-center  mx-auto">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="string"
                placeholder="Filter by booker name..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={loading}
              />
            </div>
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading && (
        <div className="text-center py-10">
          <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">Loading bookings...</p>
        </div>
      )}

      {!loading && emptyStateMessage && (
        <div className="text-center py-10">
          <Inbox className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">{emptyStateMessage}</p>
        </div>
      )}

      {!loading && filteredBookings.length > 0 && (
        <div className="w-full flex-grow space-y-4 overflow-y-auto pb-10">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingInbox;
