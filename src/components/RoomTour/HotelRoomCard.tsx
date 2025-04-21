"use client";

import Image from "next/image";
import LPthirdpic from "@/assets/LPthirdpic.jpg";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RoomCard } from "@/types/types";

// Define custom arrow props interface
interface CustomArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const roomData: RoomCard[] = [
  {
    roomType: "Single Bee",
    maxGuests: 1,
    roomRate: "₱1,490 / night",
    amenities: [
      "Free Wi-Fi",
      "Complimentary Breakfast",
      "Air Conditioning",
      "Smart TV & Netflix",
    ],
  },
  {
    roomType: "Twin Bee",
    maxGuests: 2,
    roomRate: "₱1,890 / night",
    amenities: [
      "Free Wi-Fi",
      "Complimentary Breakfast",
      "Air Conditioning",
      "Smart TV & Netflix",
    ],
  },
  {
    roomType: "Queen Bee",
    maxGuests: 2,
    roomRate: "₱1,890 / night",
    amenities: [
      "Free Wi-Fi",
      "Complimentary Breakfast",
      "Air Conditioning",
      "Smart TV & Netflix",
    ],
  },
  {
    roomType: "BHive Suite",
    maxGuests: 2,
    roomRate: "₱2,290 / night",
    amenities: ["Luxury Bedding", "Mini Bar", "Private Balcony", "Hot Tub"],
  },
  {
    roomType: "BHIVE Family Suite",
    maxGuests: 3,
    roomRate: "₱2,690 / night",
    amenities: [
      "Spacious Living Area",
      "Full Kitchen",
      "Private Pool",
      "Game Console",
    ],
  },
];

const HotelRoomCards = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomCard | undefined>();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="flex flex-col items-center gap-6 mb-10">
      {roomData.map((room, index) => (
        <motion.div
          key={index}
          className="w-[1374px] h-[256px] bg-white shadow-md rounded-xl flex overflow-hidden items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}>
          {/* Left - Room Info */}
          <div className="w-2/3 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{room.roomType}</h2>
              <p className="text-gray-500">
                Sleeps up to {room.maxGuests} people.
              </p>
              <p className="text-lg font-bold mt-2">{room.roomRate}</p>
            </div>

            <ul className="text-sm text-gray-600 space-y-1 mt-2">
              {room.amenities.map((amenity, idx) => (
                <li key={idx}>✔ {amenity}</li>
              ))}
            </ul>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 w-fit"
                  onClick={() => setSelectedRoom(room)}>
                  View More
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-full h-[90vh] rounded-xl p-6 overflow-y-auto scrollbar-hide">
                <DialogTitle className="sr-only">
                  Room Details: {selectedRoom?.roomType}
                </DialogTitle>

                <div className=" mt-10 grid grid-cols-1 gap-6">
                  {/* Image Carousel */}
                  <div className="relative h-[400px] w-full">
                    <Slider {...settings}>
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          className="relative w-full h-[400px]">
                          <Image
                            src={LPthirdpic}
                            alt={`Room Image ${num}`}
                            fill
                            style={{
                              objectFit: "cover",
                              borderRadius: "0.75rem",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>

                  {/* Room Info */}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedRoom?.roomType}
                    </h2>
                    <p className="text-gray-500 mb-1">
                      {selectedRoom?.maxGuests} PAX
                    </p>
                    <p className="text-lg font-semibold mb-4">
                      {selectedRoom?.roomRate}
                    </p>
                    <h3 className="font-medium text-lg">Amenities:</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-1 mb-4">
                      {selectedRoom?.amenities.map(
                        (item: string, i: number) => (
                          <li key={i}>{item}</li>
                        )
                      )}
                    </ul>

                    <div className="flex gap-4">
                      <button
                        onClick={() => alert("Booking flow goes here")}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium">
                        Book Now
                      </button>
                      <button
                        onClick={() => alert("Contact form goes here")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium">
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right - Room Image */}
          <div className="w-1/3 h-full relative">
            <Image
              src={LPthirdpic}
              alt={room.roomType}
              layout="fill"
              objectFit="cover"
              className="rounded-r-xl"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Custom Arrow Components with proper typing
function SampleNextArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
      onClick={onClick}>
      <ChevronRight size={20} />
    </button>
  );
}

function SamplePrevArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
      onClick={onClick}>
      <ChevronLeft size={20} />
    </button>
  );
}

export default HotelRoomCards;
