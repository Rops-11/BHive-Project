"use client";
import HotelRoomCard from "@/components/Room/HotelRoomCard";
import RoomForm from "@/components/Room/RoomForm";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllRooms from "@/hooks/roomHooks/useGetAllRooms";
import React from "react";

const Rooms = () => {
  const { rooms, loading: roomsLoading } = useGetAllRooms();

  return (
    <div className="flex flex-col w-full h-auto justify-center items-center pt-30 pb-30">
      <RoomForm type="Add" />
      <div className="flex flex-col w-full h-auto space-y-5 items-center">
        {roomsLoading ? (
          <>
            <Skeleton className="w-4/5 h-100" />
            <Skeleton className="w-4/5 h-100" />
            <Skeleton className="w-4/5 h-100" />
          </>
        ) : (
          rooms?.map((room) => (
            <HotelRoomCard
              key={room.id}
              room={room}
              bgColor="bg-red-100"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;
