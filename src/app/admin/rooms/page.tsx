"use client";

import React, { useEffect, useState, useCallback } from "react";
import HotelRoomCard from "@/components/Room/HotelRoomCard";
import RoomFiltererByDate from "@/components/Room/RoomFiltererByDate";
import UpdateRoomRateDialog from "@/components/Room/UpdateRoomRateDialog";
import RoomFormPopover from "@/components/Room/RoomFormPopover";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import { Room } from "@/types/types";

const Rooms = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const {
    getAvailableRoomsWithDate,
    availableRoomsWithDate,
    loading: roomsLoading,
  } = useOnlyAvailableRoomsOnSpecificDate();

  const refetchRooms = useCallback(() => {
    const fromDate = dateRange?.from;
    const toDate = dateRange?.to;

    if (fromDate && toDate) {
      getAvailableRoomsWithDate(fromDate, toDate);
    } else if (fromDate && !toDate) {
      const nextDay = new Date(fromDate);
      nextDay.setDate(fromDate.getDate() + 1);
      getAvailableRoomsWithDate(fromDate, nextDay);
    } else {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      getAvailableRoomsWithDate(today, tomorrow);
    }
  }, [dateRange, getAvailableRoomsWithDate]);

  useEffect(() => {
    refetchRooms();
  }, []);

  // Group rooms by roomType
  const groupedRooms: Record<string, Room[]> = {};
  availableRoomsWithDate.forEach((room) => {
    const type = room.roomType || "Unknown";
    if (!groupedRooms[type]) {
      groupedRooms[type] = [];
    }
    groupedRooms[type].push(room);
  });

  return (
    <div className="flex flex-col w-full min-h-screen items-center space-y-8 pt-24 px-4 lg:px-16">
      <Card className="flex flex-col md:flex-row p-4 w-full max-w-7xl gap-4 items-stretch md:items-end">
        <div className="flex-grow w-full">
          <RoomFiltererByDate
            dateRange={dateRange}
            setDateRange={setDateRange}
            getAvailableRoomsWithDate={getAvailableRoomsWithDate}
          />
        </div>

        <div className="flex flex-shrink-0 w-full sm:w-auto">
          <RoomFormPopover type="Add" onFormSubmitSuccess={refetchRooms} />
        </div>

        <div className="w-full md:w-auto flex-shrink-0 self-center md:self-end">
          <UpdateRoomRateDialog />
        </div>
      </Card>

      <div className="w-full h-auto mt-10 space-y-20 max-w-7xl">
        {roomsLoading ? (
          <>
            <Skeleton className="w-full h-60 rounded-lg" />
            <Skeleton className="w-full h-60 rounded-lg" />
            <Skeleton className="w-full h-60 rounded-lg" />
          </>
        ) : (
          Object.entries(groupedRooms).map(([roomType, rooms]) => (
            <div key={roomType} className="px-4 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-[#D29D30]">{roomType} Rooms</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {rooms.map((room) => (
                  <HotelRoomCard
                    key={room.id}
                    room={room}
                    role="Admin"
                    refetchRooms={refetchRooms}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;
