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
import useGetAllRooms from "@/hooks/roomHooks/useGetAllRooms";

const Rooms = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const {
    getAvailableRoomsWithDate,
    availableRoomsWithDate,
    loading: availableRoomsByDateLoading,
  } = useOnlyAvailableRoomsOnSpecificDate();

  const {
    rooms: allRooms,
    loading: initialAllRoomsLoading,
    fetchAllRooms: refetchAllRooms,
  } = useGetAllRooms();

  const [displayedRooms, setDisplayedRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fromDate = dateRange?.from;

    if (fromDate) {
      if (availableRoomsWithDate) {
        setDisplayedRooms(availableRoomsWithDate);
      } else if (!availableRoomsByDateLoading) {
        setDisplayedRooms([]);
      }
    } else {
      if (allRooms) {
        setDisplayedRooms(allRooms);
      } else if (!initialAllRoomsLoading) {
        setDisplayedRooms([]);
      }
    }
  }, [
    dateRange,
    allRooms,
    availableRoomsWithDate,
    initialAllRoomsLoading,
    availableRoomsByDateLoading,
  ]);

  const handleDataRefresh = useCallback(async () => {
    if (typeof refetchAllRooms === "function") {
      await refetchAllRooms();
    } else {
      console.warn(
        "refetchAllRooms function is not available from useGetAllRooms hook. Full data refresh might not occur."
      );
    }

    const fromDate = dateRange?.from;
    const toDate = dateRange?.to;

    if (fromDate) {
      const effectiveToDate =
        toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 1));

      await getAvailableRoomsWithDate(fromDate, effectiveToDate);
    }
  }, [refetchAllRooms, dateRange, getAvailableRoomsWithDate]);

  const groupedRooms: Record<string, Room[]> = {};
  displayedRooms.forEach((room) => {
    const type = room.roomType || "Unknown";
    if (!groupedRooms[type]) {
      groupedRooms[type] = [];
    }
    groupedRooms[type].push(room);
  });

  const showSkeletons =
    (!dateRange?.from && initialAllRoomsLoading) ||
    (!!dateRange?.from && availableRoomsByDateLoading);

  return (
    <div className="flex flex-col w-full min-h-screen items-center space-y-8 pt-24 px-4 lg:px-16 pb-5">
      <Card className="flex flex-col md:flex-row p-4 w-full max-w-7xl gap-4 items-stretch md:items-end">
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
            onFormSubmitSuccess={handleDataRefresh}
          />
        </div>

        <div className="w-full md:w-auto flex-shrink-0 self-center md:self-end">
          <UpdateRoomRateDialog />
        </div>
      </Card>

      <div className="w-full h-auto space-y-20 max-w-7xl">
        {showSkeletons ? (
          <>
            <Skeleton className="w-full h-60 rounded-lg" />
            <Skeleton className="w-full h-60 rounded-lg" />
            <Skeleton className="w-full h-60 rounded-lg" />
          </>
        ) : Object.keys(groupedRooms).length > 0 ? (
          Object.entries(groupedRooms).map(([roomType, roomsInGroup]) => (
            <div
              key={roomType}
              className="px-4 lg:px-8 space-y-3">
              <h2 className="text-3xl font-bold text-[#D29D30]">
                {roomType} Rooms
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {roomsInGroup.map((room) => (
                  <HotelRoomCard
                    key={room.id}
                    room={room}
                    role="Admin"
                    refetchRooms={handleDataRefresh}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          !initialAllRoomsLoading &&
          !availableRoomsByDateLoading && (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">No rooms found.</p>
              {dateRange?.from && (
                <p className="text-sm text-gray-400">
                  Try adjusting the date filter or adding new rooms.
                </p>
              )}
              {!dateRange?.from && (
                <p className="text-sm text-gray-400">
                  There are no rooms in the system. Try adding new rooms.
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Rooms;
