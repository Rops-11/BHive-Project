import { Booking } from "@/types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useCreateBooking = () => {
  const [bookingDetails, setBookingDetails] = useState<Booking>();
  const [loading, setLoading] = useState(false);

  const createBooking = async (bookingDetails: Booking) => {
    setLoading(true);
    try {
      const response = await normalFetch("/api/book", "post", bookingDetails);

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const bookingData = await response.json();
      setBookingDetails(bookingData);
      toast.success("Booking Successful");
    } catch (error) {
      console.error(error);
      toast.error("An Unknown Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, bookingDetails };
};

export default useCreateBooking;
