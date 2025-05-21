import { normalFetch } from "utils/fetch";
import { toast } from "react-toastify";
import { useState, useCallback } from "react";
import { Room } from "@prisma/client";

interface GetAvailableRoomsPayload {
  checkIn: Date;
  checkOut: Date;
  excludeBookingId?: string;
}

export interface GetAvailableRoomsOptions {
  returnPromiseResult?: boolean;
  excludeBookingId?: string;
}

const useOnlyAvailableRoomsOnSpecificDate = () => {
  const [loading, setLoading] = useState(false);
  const [availableRoomsWithDate, setAvailableRoomsWithDate] = useState<Room[]>(
    []
  );

  const getAvailableRoomsWithDate = useCallback(
    async (
      checkIn: Date,
      checkOut: Date,
      options?: GetAvailableRoomsOptions
    ): Promise<Room[]> => {
      const shouldReturnPromise = options?.returnPromiseResult ?? false;
      const currentExcludeBookingId = options?.excludeBookingId;

      if (!shouldReturnPromise) {
        setLoading(true);
      }

      const payload: GetAvailableRoomsPayload = { checkIn, checkOut };
      if (currentExcludeBookingId) {
        payload.excludeBookingId = currentExcludeBookingId;
      }

      try {
        const response = await normalFetch(
          "/api/utils/getRoomsAvailableThisDate",
          "post",
          payload
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error from server" }));

          const errorMessage =
            errorData.message || "Failed to fetch available rooms.";
          console.error(
            "API Error in getAvailableRoomsWithDate:",
            errorMessage,
            errorData
          );

          if (!shouldReturnPromise) {
            setAvailableRoomsWithDate([]);
            toast.error(errorMessage);
          }
          return [];
        }

        const roomsAvailable: Room[] = await response.json();

        if (!shouldReturnPromise) {
          setAvailableRoomsWithDate(roomsAvailable);
        }
        return roomsAvailable;
      } catch {
        if (!shouldReturnPromise) {
          setAvailableRoomsWithDate([]);
          toast.error("Unknown error has occurred while fetching rooms.");
        }
        return [];
      } finally {
        if (!shouldReturnPromise) {
          setLoading(false);
        }
      }
    },
    []
  );

  return { getAvailableRoomsWithDate, loading, availableRoomsWithDate };
};

export default useOnlyAvailableRoomsOnSpecificDate;
