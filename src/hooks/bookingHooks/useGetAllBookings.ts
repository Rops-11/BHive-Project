import { Booking } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useGetAllBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const getAllBookings = async () => {
    try {
      const response = await normalFetch("/api/book", "get");

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const bookings = await response.json();

      setBookings(bookings);
    } catch {
      toast.error("Unknown error has occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return { bookings, loading, getAllBookings };
};

export default useGetAllBookings;
