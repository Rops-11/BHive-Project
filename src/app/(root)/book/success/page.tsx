"use client";

import { useBooking } from "@/components/providers/BookProvider";
import Loading from "@/components/ui/Loading";
import useCreateBooking from "@/hooks/bookingHooks/useCreateBooking";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const BookingSuccessPage = () => {
  const { createBooking, loading } = useCreateBooking();
  const { bookingContext } = useBooking();

  const handleCreateBooking = async () => {
    try {
      await createBooking(bookingContext!);
    } catch {
      toast.error("Unknown error occurred while saving booking.");
    }
  };
  useEffect(() => {
    handleCreateBooking();
  }, []);

  return <Loading loading={loading} />;
};

export default BookingSuccessPage;
