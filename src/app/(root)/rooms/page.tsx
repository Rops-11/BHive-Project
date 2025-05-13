"use client";

import React from "react";
import RoomBanner from "@/components/Room/RoomBanner";
import HotelRoomCard from "@/components/Room/HotelRoomCard";
import useGetAllRooms from "@/hooks/roomHooks/useGetAllRooms";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/LandingPage/footer";
import { Room } from "@/types/types";
import { RoomIntroText } from "@/components/Room/RoomIntroText";

const RoomsPage = () => {
  const { rooms, loading: roomsLoading } = useGetAllRooms();

  // Group rooms by roomType safely
  const groupedRooms: Record<string, Room[]> = {};

  rooms?.forEach((room) => {
    const type = room.roomType || "Unknown";
    if (!groupedRooms[type]) {
      groupedRooms[type] = [];
    }
    groupedRooms[type].push(room);
  });

  return (
    <div>
      <RoomBanner />
      <RoomIntroText />
      <div className="w-full h-auto mt-10 space-y-20">
        {roomsLoading ? (
          <>
            <Skeleton className="w-full h-60" />
            <Skeleton className="w-full h-60" />
            <Skeleton className="w-full h-60" />
          </>
        ) : (
          Object.entries(groupedRooms).map(([roomType, rooms]) => (
            <div key={roomType} className="px-16 lg:px-32">
              <h2 className="text-3xl font-bold mb-8 text-[#D29D30]">{roomType} Rooms</h2>
              <div className="grid grid-cols-2 gap-8 max-w-8xl mx-auto">
                {rooms.map((room) => (
                  <HotelRoomCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-gray-200 py-4 md:py-4 items-center mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default RoomsPage;
