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
  id: string;
  roomType: string;
  roomNumber: string;
  isAvailable: boolean;
  maxGuests: number;
  roomRate: number;
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
