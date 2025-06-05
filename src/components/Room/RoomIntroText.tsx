import React from "react";
import RoomPicture from "@/assets/SingleTwin.jpg";
import Image from "next/image";

interface RoomIntroTextProps {
  title?: string
  body?: string
  titleColor?: string;
  bodyColor?: string;
}

export const RoomIntroText = ({
  title = "Rooms",
  body =  "Step into our beehive-inspired haven, where every room is a cozy cell in a vibrant hive. Discover unique spaces designed for comfort, connection, and an appreciation of beehive-inspired design.",
  titleColor = "text-[#D29D30]",
  bodyColor = "text-gray-600",
}: RoomIntroTextProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-20 max-w-6xl mx-auto mt-32 lg:mt-64 mb-64   px-16 lg:px-32">
      {/* Text Section */}
      <div className="lg:w-1/2">
        <h2 className={`text-4xl font-bold ${titleColor} mb-4`}>
          {title}
        </h2>
        <p className={`text-lg ${bodyColor} leading-relaxed`}>
          {body}
        </p>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2">
        <Image
          src={RoomPicture} // Replace with your image path
          alt="Hotel Facilities"
          className="rounded-lg w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};
