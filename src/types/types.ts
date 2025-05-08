import { StaticImageData } from "next/image";

interface ImageFile {
  name: string;
}

export interface Room {
  id?: string;
  roomType?: string;
  roomNumber?: string;
  isAvailable?: boolean;
  maxGuests?: number;
  roomRate?: number;
  images?: ImageFile[];
}

export interface Booking {
  id?: string;
  roomId?: string;
  dateBooked?: Date;
  checkIn?: Date;
  checkOut?: Date;
  mobileNumber?: string;
  status?: string;
  name?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  shift?: string;
  totalPrice?: number;
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
