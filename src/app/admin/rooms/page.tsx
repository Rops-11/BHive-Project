"use client";
import HotelRoomCard from "@/components/Room/HotelRoomCard";
import RoomForm from "@/components/Room/RoomForm";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAllRooms from "@/hooks/roomHooks/useGetAllRooms";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
      <Card className="flex flex-row p-4 w-4/5 justify-between items-end">
        <div className="flex flex-col w-[85%] space-y-1">
          <Label>Date for Rooms:</Label>
          <Popover>
            <PopoverTrigger
              className="flex"
              asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "flex w-full justify-start text-left font-normal border-black bg-transparent",
                  !dateRange && "text-muted-foreground"
                )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(selectedDateRange) => {
                  setDateRange(selectedDateRange);
                  if (selectedDateRange?.from && selectedDateRange?.to) {
                    getAvailableRoomsWithDate(
                      selectedDateRange.from,
                      selectedDateRange.to
                    );
                  }
                }}
                numberOfMonths={2}
                disabled={(date) => date < new Date(Date.now() - 864e5)}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex w-[14%]">
          <RoomForm type="Add" />
        </div>
      </Card>
      <div className="flex flex-col w-full h-auto space-y-5 items-center">
        {roomsLoading ? (
          <>
            <Skeleton className="w-4/5 h-40" />
            <Skeleton className="w-4/5 h-40" />
            <Skeleton className="w-4/5 h-40" />
          </>
        ) : (
          availableRoomsWithDate?.map((room) => (
            <HotelRoomCard
              key={room.id}
              room={room}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms;
