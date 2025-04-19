// export interface Hotel {
//   id          :string
//   name        :string
//   description :string
//   location    :string
//   facts       :string[]
//   facilities  :Facility[]
//   rooms       :Room[]
// }

export interface Room {
  id?: string;
  roomType?: string;
  roomNumber?: string;
  isAvailable?: boolean;
  maxGuests?: number;
  roomRate?: number;
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
