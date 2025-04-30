"use client";
import Image from "next/image";
import LPthirdpic from "@/assets/LPthirdpic.jpg";

const FacilityBanner = () => {
  return (
    <div className="relative overflow-hidden h-screen ">
      <Image
        src={LPthirdpic}
        alt="Room Banner"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
        className="absolute inset-0 brightness-70"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-6xl font-semibold">
        <p>Facilities at Bhive Hotel</p>

        <p className="mt-4 text-xl font-normal opacity-80">
          All the things you need are here.
        </p>
      </div>
    </div>
  );
};

export default FacilityBanner;
