import { Booking } from "./types";

export interface BookingContextType {
  bookingContext?: Booking;
  setBookingContext?: React.Dispatch<React.SetStateAction<Booking>> | undefined;
}
