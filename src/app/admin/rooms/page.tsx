"use client";

import HotelRoomCard from "@/components/Room/HotelRoomCard";
import RoomFiltererByDate from "@/components/Room/RoomFiltererByDate";
import UpdateRoomRateDialog from "@/components/Room/UpdateRoomRateDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useDeleteRoom from "@/hooks/roomHooks/useDeleteRoom";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import React, { useEffect, useState, useCallback } from "react";
import { DateRange } from "react-day-picker";

import { Card } from "@/components/ui/card";
import RoomFormPopover from "@/components/Room/RoomFormPopover";

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

  return (
    <div className="flex flex-col w-full min-h-screen items-center space-y-5 pt-24">
      <Card className="flex flex-col md:flex-row p-4 w-full max-w-4xl gap-4 items-stretch md:items-end">
        <div className="flex-grow w-full">
          <RoomFiltererByDate
            dateRange={dateRange}
            setDateRange={setDateRange}
            getAvailableRoomsWithDate={getAvailableRoomsWithDate}
          />
        </div>

        <div className="flex flex-shrink-0 w-full sm:w-auto">
          <RoomFormPopover
            type="Add"
            onFormSubmitSuccess={refetchRooms}
          />
        </div>

        <div className="w-full md:w-auto flex-shrink-0 self-center md:self-end">
          <UpdateRoomRateDialog />
        </div>
      </Card>

      <div className="flex flex-col h-auto w-full max-w-4xl space-y-6 items-center">
        {roomsLoading ? (
          <>
            <Skeleton className="w-full h-60 rounded-lg" />
            <Skeleton className="w-full h-60 rounded-lg" />
            <Skeleton className="w-full h-60 rounded-lg" />
          </>
        ) : (
          availableRoomsWithDate.map((room) => (
            <HotelRoomCard
              key={room.id}
              room={room}
              role="Admin"
              refetchRooms={refetchRooms}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;
