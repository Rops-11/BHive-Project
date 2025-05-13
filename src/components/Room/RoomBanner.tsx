"use client";
import Image from "next/image";
import LPthirdpic from "@/assets/LPthirdpic.jpg";

const RoomBanner = () => {
  return (
    <div className="relative overflow-hidden h-screen">
      <Image
        src={LPthirdpic}
        alt="Room Banner"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
        className="absolute inset-0"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold">
        <p className="w-[70%] lg:w-full md:text-6xl text-5xl">Cozy Accommodations at Bhive Hotel</p>

        <p className="mt-4 text-xl font-normal opacity-80">
          Your Perfect Stay, Just a Click Away.
        </p>
      </div>
    </div>
  );
};

export default RoomBanner;
