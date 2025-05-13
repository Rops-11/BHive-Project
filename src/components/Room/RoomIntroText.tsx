import React from "react";
import RoomPicture from "@/assets/SingleTwin.jpg"
import Image from "next/image";

export const RoomIntroText = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-40 max-w-6xl mx-auto mt-64 mb-64 px-4">
      {/* Text Section */}
      <div className="w-3/8">
        <h2 className="text-4xl font-bold text-[#D29D30] mb-4">
          Rooms
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
        Step into our beehive-inspired haven, where every room is a cozy cell in a vibrant hive. Discover unique spaces designed for comfort, connection, and a touch of nature’s charm.
        </p>
      </div>

      {/* Image Section */}
      <div className="w-2/4">
        <Image
          src={RoomPicture}
          alt="Hotel Facilities"
          className="rounded-lg w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};
