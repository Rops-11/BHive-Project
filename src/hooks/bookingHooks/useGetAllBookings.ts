import { Booking } from "@/types/types";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useGetAllBookings = () => {
  const [bookings, setBookings] = useState<Booking[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await normalFetch("/api/book", "get");

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(
          errorData.message ||
            `Failed to fetch bookings (Status: ${response.status})`
        );
        setError(
          errorData.message ||
            `Failed to fetch bookings (Status: ${response.status})`
        );
        setBookings([]);
        return;
      }

      const fetchedBookings: Booking[] = await response.json();
      setBookings(fetchedBookings);
    } catch (err) {
      console.error("Error fetching all bookings:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error has occurred.";
      toast.error(errorMessage);
      setError(errorMessage);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  return { bookings, loading, error, getAllBookings: fetchAllBookings };
};

export default useGetAllBookings;
