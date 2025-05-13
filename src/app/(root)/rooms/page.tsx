"use client";

import React from "react";
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
      <div className="flex flex-col w-full h-auto mt-10 space-y-3 items-center">
        {roomsLoading ? (
          <>
            <Skeleton className="md:w-4/5 lg:w-3/4 xl:w-2/3 h-60" />
            <Skeleton className="md:w-4/5 lg:w-3/4 xl:w-2/3 h-60" />
            <Skeleton className="md:w-4/5 lg:w-3/4 xl:w-2/3 h-60" />
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