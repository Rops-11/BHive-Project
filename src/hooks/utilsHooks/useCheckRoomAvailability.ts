import { useState } from "react";
import useGetAllBookings from "../bookingHooks/useGetAllBookings";
import { isOverlappingWithAny } from "utils/utils";
import { toast } from "react-toastify";

// SHOULD BE USED IN THE LANDING PAGE FOR CHECKING THE AVAILABILITY OF THE ROOM AND DATE PROVIDED

const useCheckRoomAvailability = () => {
  const { bookings, loading: fetchBookingsLoading } = useGetAllBookings();
  const [loading, setLoading] = useState<boolean>(false);

  const checkAvailability = async (
    checkIn: Date,
    checkOut: Date,
    roomId: string
  ) => {
    setLoading(true);
    try {
      const bookingsWithSpecificRoom = bookings?.filter(
        (booking) => booking.roomId === roomId
      );

      const dateOverlaps = isOverlappingWithAny(
        { checkIn, checkOut },
        bookingsWithSpecificRoom!
      );

      if (dateOverlaps) {
        toast.info(
          "Room is not available on this specific date. Please try another room or another date."
        );
        return false;
      }

      toast.success("Room is available.");
      return true;
    } catch {
      toast.error("Unknown error has occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Use the fetchBookingsLoading to disable the button for a while for no conflicts
  return { loading, fetchBookingsLoading, checkAvailability };
};

export default useCheckRoomAvailability;
