"use client";
import Image from "next/image";
import LPthirdpic from "@/assets/FacilitiesBanner.png";

const FacilityBanner = () => {
  return (
    <div className="relative overflow-hidden h-screen">
      <Image
        src={LPthirdpic}
        alt="Room Banner"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
        className="absolute inset-0 brightness-80"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold px-4 text-center">
        <div className="bg-yellow-600 bg-opacity-70 px-6 py-4 rounded-lg">
          <p className="md:text-6xl text-5xl">Facilities at Bhive Hotel</p>
        </div>

        <div className="mt-4 bg-yellow-700 bg-opacity-60 px-4 py-2 rounded-md">
          <p className="text-xl font-normal opacity-90">
            All the things you need are here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacilityBanner;
