import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useUpdateBookingStatus = () => {
  const [loading, setLoading] = useState<boolean>();

  const updateStatus = async (bookingId: string, status: string) => {
    setLoading(true);
    try {
      const response = await normalFetch(
        `/api/book/status/${bookingId}`,
        "put",
        { status }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const success = await response.json();

      toast.success(success.message);
    } catch (error) {
      console.error(error);
      toast.error("Unknown error while updating booking status");
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
};

export default useUpdateBookingStatus;
