"use client";

import React from "react";
import CheckRoomAvailability from "@/components/Booking/CheckRoomAvailability";
import RoomBanner from "@/components/Room/RoomBanner";
import HotelRoomCard from "@/components/Room/HotelRoomCard";
import useGetAllRooms from "@/hooks/roomHooks/useGetAllRooms";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/LandingPage/footer";

const RoomsPage = () => {
  const { rooms, loading: roomsLoading } = useGetAllRooms();

  return (
    <div>
      <RoomBanner />
      <CheckRoomAvailability />
      <div className="flex flex-col w-full h-auto space-y-3 items-center">
        {roomsLoading ? (
          <>
            <Skeleton className="w-4/5 h-70" />
            <Skeleton className="w-4/5 h-70" />
            <Skeleton className="w-4/5 h-70" />
          </>
        ) : (
          rooms?.map((room) => (
            <HotelRoomCard
              key={room.id}
              room={room}
            />
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
