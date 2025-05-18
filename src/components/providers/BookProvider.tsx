"use client";

import { BookingContextType } from "@/types/context";
import { Booking, Room } from "@/types/types";
import { ReactNode, useState, createContext, useContext } from "react";

export const BookingContext = createContext({});

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingContext, setBookingContext] = useState<Booking>();
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  return (
    <BookingContext.Provider
      value={{
        bookingContext,
        setBookingContext,
        selectedRoom,
        setSelectedRoom,
      }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
