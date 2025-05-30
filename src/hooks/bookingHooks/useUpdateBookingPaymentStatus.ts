import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

const useUpdateBookingPaymentStatus = () => {
  const [loading, setLoading] = useState<boolean>();

  const updatePaymentStatus = async (
    bookingId: string,
    paymentStatus: string
  ) => {
    setLoading(true);
    try {
      const response = await normalFetch(
        `/api/book/paymentStatus/${bookingId}`,
        "put",
        { paymentStatus }
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
      toast.error("Unknown error while updating booking payment status");
    } finally {
      setLoading(false);
    }
  };

  return { updatePaymentStatus, loading };
};

export default useUpdateBookingPaymentStatus;
