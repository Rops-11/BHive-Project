import { StaticImageData } from "next/image";

export interface ImageFile {
  name: string;
  id?: string;
}

export interface Room {
  id?: string;
  roomType?: string;
  roomNumber?: string;
  isAvailable?: boolean;
  maxGuests?: number;
  roomRate?: number;
  images?: ImageFile[];
  amenities?: string[];
}

export interface Booking {
  id?: string;
  roomId?: string;
  dateBooked?: Date;
  checkIn?: Date;
  checkOut?: Date;
  mobileNumber?: string;
  email?: string;
  status?: "Reserved" | "Ongoing" | "Complete";
  paymentStatus?: "Paid" | "Partial";
  downPayment?: boolean;
  name?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  bookingType?: "Online" | "OTC";
  totalPrice?: number;
  room?: Room;
}

export interface EmailDetail {
  id: string | null | undefined;
  snippet: string | null | undefined;
  subject?: string | null | undefined;
  from?: string | null | undefined;
  date?: string | null | undefined;
  body?: string | null | undefined;
}

export interface RoomWithAmenities extends Room {
  amenities: string[];
}

export interface RoomCard {
  roomType: string;
  maxGuests: number;
  roomRate: string;
  amenities: string[];
}

export interface UnknownError {
  message: string;
}

export interface UnknownError {
  message: string;
}

export interface FacilityCard {
  title: string;
  description: string;
  image: StaticImageData;
}

export interface StickyContent {
  title: string;
  description: string;
  content?: React.ReactNode;
}
