"use client";

import { BookingContextType } from "@/types/context";
import { ReactNode, useState, createContext } from "react";

export const BookingContext = createContext({});

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingContext, setBookingContext] = useState<BookingContextType>();
  return (
    <BookingContext.Provider value={{ bookingContext, setBookingContext }}>
      {children}
    </BookingContext.Provider>
  );
}
