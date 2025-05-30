import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { normalFetch } from "utils/fetch";

interface CheckAvailabilityParams {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  excludeBookingId?: string;
}

interface CheckAvailabilityResponse {
  isAvailable: boolean;
  message?: string;
}

interface UseCheckRoomAvailabilityReturn {
  checkRoomIsAvailable: (
    params: CheckAvailabilityParams
  ) => Promise<CheckAvailabilityResponse>;
  isLoading: boolean;
}

const useCheckRoomAvailability = (): UseCheckRoomAvailabilityReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const checkRoomIsAvailable = useCallback(
    async (
      params: CheckAvailabilityParams
    ): Promise<CheckAvailabilityResponse> => {
      setIsLoading(true);
      try {
        const payload = {
          ...params,
          checkIn: params.checkIn.toISOString(),
          checkOut: params.checkOut.toISOString(),
        };

        const response = await normalFetch(
          "/api/book/checkAvailability",
          "post",
          payload
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "An unknown error occurred" }));
          const errorMessage =
            errorData.message ||
            `Failed to check room availability (status: ${response.status}).`;
          console.error(
            "API Error in checkRoomIsAvailable:",
            errorMessage,
            errorData
          );
          toast.error(errorMessage);
          return { isAvailable: false, message: errorMessage };
        }

        const data: CheckAvailabilityResponse = await response.json();
        return data;
      } catch (error) {
        console.error("Network or other error in checkRoomIsAvailable:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "A network error occurred while checking availability.";
        toast.error(errorMessage);
        return { isAvailable: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { checkRoomIsAvailable, isLoading };
};

export default useCheckRoomAvailability;
