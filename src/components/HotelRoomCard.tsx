"use client";

import Image from "next/image";
import LPthirdpic from "@/assets/LPthirdpic.jpg";

const roomData = [
  {
    name: "Single Bee",
    capacity: "Sleeps 1 person",
    price: "₱1,490 / night",
    amenities: ["Free Wi-Fi", "Complimentary Breakfast", "Air Conditioning", "Smart TV & Netflix"],
  },
  {
    name: "Twin Bee",
    capacity: "Sleeps 2 people",
    price: "₱1,890 / night",
    amenities: ["Free Wi-Fi", "Complimentary Breakfast", "Air Conditioning", "Smart TV & Netflix"],
  },
  {
    name: "Queen Bee",
    capacity: "Sleeps up to 4 people",
    price: "$1,890 / night",
    amenities: ["Free Wi-Fi", "Complimentary Breakfast", "Air Conditioning", "Smart TV & Netflix"],
  },
  {
    name: "BHive Suite",
    capacity: "Sleeps up to 6 people",
    price: "₱2,290 / night",
    amenities: ["Luxury Bedding", "Mini Bar", "Private Balcony", "Hot Tub"],
  },
  {
    name: "BHIVE Family Suite",
    capacity: "Sleeps up to 8 people",
    price: "₱2,690 / night",
    amenities: ["Spacious Living Area", "Full Kitchen", "Private Pool", "Game Console"],
  },
];

const HotelRoomCards = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      {roomData.map((room, index) => (
        <div
          key={index}
          className="w-[1374px] h-[256px] bg-white shadow-md rounded-xl flex overflow-hidden items-center"
        >
          {/* Left - Room Information */}
          <div className="w-2/3 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{room.name}</h2>
              <p className="text-gray-500">{room.capacity}</p>
              <p className="text-lg font-bold mt-2">{room.price}</p>
            </div>

            {/* Amenities */}
            <ul className="text-sm text-gray-600 space-y-1">
              {room.amenities.map((amenity, idx) => (
                <li key={idx}>✔ {amenity}</li>
              ))}
            </ul>

            {/* View More Button */}
            <button className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 w-fit">
              View More
            </button>
          </div>

          {/* Right - Room Image */}
          <div className="w-1/3 h-full relative">
            <Image
              src={LPthirdpic}
              alt={room.name}
              layout="fill"
              objectFit="cover"
              className="rounded-r-xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelRoomCards;
