import { Booking } from "@/types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

interface UpdateBookingRoomAndDatesPayload {
  roomId: string;
  checkIn: string | Date;
  checkOut: string | Date;
}

const useUpdateBooking = () => {
  const [loading, setLoading] = useState(false);

  const updateNormalBooking = async (
    id: string,
    updatedBookingDetails: Booking
  ) => {
    try {
      setLoading(true);
      const response = await normalFetch(
        `/api/book/normal/${id}`,
        "put",
        updatedBookingDetails
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const success = await response.json();

      toast.success(success.message);
    } catch {
      toast.error("Unknown error has occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateRoomInBooking = async (
    bookingId: string,
    dataForUpdate: {
      roomId: string;
      checkIn: Date;
      checkOut: Date;
    }
  ) => {
    try {
      const payload: UpdateBookingRoomAndDatesPayload = {
        roomId: dataForUpdate.roomId,
        checkIn: dataForUpdate.checkIn.toISOString(),
        checkOut: dataForUpdate.checkOut.toISOString(),
      };

      const response = await normalFetch(
        `/api/book/room/${bookingId}`,
        "put",
        payload
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to parse error response" }));
        console.error("Error updating booking room/dates:", errorData);
        toast.error(
          errorData.message ||
            "Failed to update booking. Server returned an error."
        );
        return;
      }

      const successData = await response.json().catch(() => ({
        message: "Booking updated, but failed to parse success response",
      }));
      toast.success(
        successData.message || "Booking details updated successfully!"
      );
    } catch (error) {
      console.error("Client-side error updating booking room/dates:", error);
      toast.error(
        "An unknown client-side error occurred while updating the booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateNormalBooking, updateRoomInBooking, loading };
};

export default useUpdateBooking;
