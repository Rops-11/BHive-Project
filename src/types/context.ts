import { Booking, Room } from "./types";

export interface BookingContextType {
  bookingContext?: Booking;
  setBookingContext?: React.Dispatch<React.SetStateAction<Booking>> | undefined;
  selectedRoom?: Room;
  setSelectedRoom?: React.Dispatch<React.SetStateAction<Room | undefined>> | undefined;
}

export interface AuthContextValue {
  fullName: string | null;
  setFullNameState: React.Dispatch<React.SetStateAction<string | null>>;
}
