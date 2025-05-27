"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Booking } from "@/types/types";
import { normalFetch } from "utils/fetch";

type CreateBookingPayload = Omit<
  Booking,
  "id" | "dateBooked" | "room" | "paymentProofUrl"
> & {
  roomId: string;
  file?: File | null;
  paymentStatus?: string;
};

const useCreateBooking = () => {
  const [bookingDetails, setBookingDetails] = useState<Booking | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const createBooking = async (payload: CreateBookingPayload) => {
    setLoading(true);

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "file") {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        }
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
      const response = await normalFetch("/api/book", "post", formData);

      if (!response.ok) {
        const errorData = await response.json();
        let message = "Failed to create booking.";
        if (errorData && errorData.message) {
          message = errorData.message;
          if (errorData.details) message += ` Details: ${errorData.details}`;
          if (errorData.missing)
            message += ` Missing fields: ${errorData.missing.join(", ")}`;
        } else if (typeof errorData === "string") {
          message = errorData;
        } else if (response.statusText) {
          message = response.statusText;
        }

        return;
      }

      const newBookingData: Booking = await response.json();
      setBookingDetails(newBookingData);
    } catch (e: any) {
      console.error("Error in createBooking hook:", e);
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, bookingDetails, error, setError };
};

export default useCreateBooking;
