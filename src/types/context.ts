import { Booking } from "./types";

export interface BookingContextType {
  bookingContext?: Booking;
  setBookingContext?: React.Dispatch<React.SetStateAction<Booking>> | undefined;
}

export interface AuthContextValue {
  fullName: string | null;
  setFullNameState: React.Dispatch<React.SetStateAction<string | null>>;
}
