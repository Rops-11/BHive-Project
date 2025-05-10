"use client";
import HotelRoomCard from "@/components/Room/HotelRoomCard";
import RoomFiltererByDate from "@/components/Room/RoomFiltererByDate";
import { Skeleton } from "@/components/ui/skeleton";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const Rooms = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const {
    getAvailableRoomsWithDate,
    availableRoomsWithDate,
    loading: roomsLoading,
  } = useOnlyAvailableRoomsOnSpecificDate();

  useEffect(() => {
    const dateToday = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(dateToday.getDate() + 1);
    getAvailableRoomsWithDate(dateToday, tomorrow);
  }, []);

  return (
    <div className="flex flex-col w-full h-auto justify-center items-center pt-30 pb-30 space-y-6">
      <RoomFiltererByDate
        dateRange={dateRange}
        setDateRange={setDateRange}
        getAvailableRoomsWithDate={getAvailableRoomsWithDate}
        role="Admin"
      />
      <div className="flex flex-col w-full h-auto space-y-5 items-center">
        {roomsLoading ? (
          <>
            <Skeleton className="md:w-4/5 lg:w-3/4 xl:w-2/3 h-60" />
            <Skeleton className="md:w-4/5 lg:w-3/4 xl:w-2/3 h-60" />
            <Skeleton className="md:w-4/5 lg:w-3/4 xl:w-2/3 h-60" />
          </>
        ) : (
          availableRoomsWithDate?.map((room) => (
            <HotelRoomCard
              key={room.id}
              room={room}
              role="Admin"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;
