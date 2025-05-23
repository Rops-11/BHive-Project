import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Booking, Room } from "./types";

export interface BookingContextType {
  bookingContext?: Booking;
  setBookingContext?: React.Dispatch<React.SetStateAction<Booking>> | undefined;
  selectedRoom?: Room;
  setSelectedRoom?:
    | React.Dispatch<React.SetStateAction<Room | undefined>>
    | undefined;
}

export interface AuthContextValue {
  session: Session | undefined | null;
  setSession: (session: Session | undefined | null) => void;
  supabase: SupabaseClient;
  isLoading: boolean;
}
