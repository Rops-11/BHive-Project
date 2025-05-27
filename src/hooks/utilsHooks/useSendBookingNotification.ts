import { useState, useCallback } from "react";
import { normalFetch } from "utils/fetch";
import { z } from "zod";

export const bookingNotificationPayloadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roomId: z.string().min(1),
  verified: z.boolean(),
  checkIn: z.string(),
});

export type BookingNotificationPayload = z.infer<
  typeof bookingNotificationPayloadSchema
>;

export type ZodFieldErrors = Record<string, string[] | undefined>;

export type ErrorDetails =
  | ZodFieldErrors
  | Record<string, unknown>
  | string
  | null;

export interface UseSendBookingNotificationOptions {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: string, details?: ErrorDetails) => void;
}

interface UseSendBookingNotificationReturn {
  sendNotification: (payload: BookingNotificationPayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const useSendBookingNotification = (
  options?: UseSendBookingNotificationOptions
): UseSendBookingNotificationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sendNotification = useCallback(
    async (payload: BookingNotificationPayload) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const validationResult =
        bookingNotificationPayloadSchema.safeParse(payload);
      if (!validationResult.success) {
        const errorMessage = "Invalid payload data.";
        const errorDetails = validationResult.error.flatten().fieldErrors;
        console.error(errorMessage, errorDetails);
        setError(errorMessage);
        options?.onError?.(errorMessage, errorDetails);
        setIsLoading(false);
        return;
      }

      try {
        const response = await normalFetch(
          "/api/utils/sendEmail",
          "post",
          payload
        );

        const responseData = await response.json();

        if (!response.ok) {
          const apiErrorMessage =
            responseData.message ||
            `Request failed with status ${response.status}`;
          console.error("API Error:", apiErrorMessage, responseData.errors);
          setError(apiErrorMessage);
          options?.onError?.(apiErrorMessage, responseData.errors);
        } else {
          setSuccessMessage(
            responseData.message || "Notification sent successfully!"
          );
          options?.onSuccess?.(responseData);
        }
      } catch (e: unknown) {
        let errorMessage =
          "An unexpected error occurred while sending the notification.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        console.error("Fetch Error:", errorMessage, e);
        setError(errorMessage);
        options?.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return { sendNotification, isLoading, error, successMessage };
};

export default useSendBookingNotification;
