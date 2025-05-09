import { User } from "@supabase/supabase-js";
import { Booking } from "./types";

export interface BookingContextType {
  bookingContext?: Booking;
  setBookingContext?: React.Dispatch<React.SetStateAction<Booking>> | undefined;
}

export interface AuthContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
}
