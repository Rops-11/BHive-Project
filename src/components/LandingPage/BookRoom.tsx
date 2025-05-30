"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Search } from "lucide-react";
import { format, addDays, isBefore, isEqual, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookingContext } from "../providers/BookProvider";
import { BookingContextType } from "@/types/context";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import useSeparateRoomsByType from "@/hooks/roomHooks/useSeparateRoomsByType";
import { Room } from "@/types/types";

export default function BookRoom() {
  const router = useRouter();
  const bookingContextHook = useContext<BookingContextType>(BookingContext);

  const setBookingContext = bookingContextHook?.setBookingContext;
  const setSelectedRoomContext = bookingContextHook?.setSelectedRoom;

  const memoizedToday = useMemo(() => startOfDay(new Date()), []);
  const initialTomorrow = useMemo(
    () => addDays(memoizedToday, 1),
    [memoizedToday]
  );

  const [checkIn, setCheckIn] = useState<Date | undefined>(memoizedToday);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialTomorrow);
  const [selectedRoomState, setSelectedRoomState] = useState<Room | undefined>(
    undefined
  );
  const [dateError, setDateError] = useState<string | null>(null);

  const {
    getAvailableRoomsWithDate,
    loading: roomsLoading,
    availableRoomsWithDate,
  } = useOnlyAvailableRoomsOnSpecificDate();

  const {
    queenBeeRooms,
    suites,
    familySuites,
    singleStandardRooms,
    singleDeluxeRooms,
    twinBeeRooms,
  } = useSeparateRoomsByType(availableRoomsWithDate || []);

  useEffect(() => {
    if (!setBookingContext || !setSelectedRoomContext) {
      console.warn("Booking context setters not available.");
    }

    if (checkIn && checkOut) {
      const checkInDate = startOfDay(checkIn);
      const checkOutDate = startOfDay(checkOut);

      if (
        isBefore(checkOutDate, checkInDate) ||
        isEqual(checkOutDate, checkInDate)
      ) {
        setDateError("Check-out date must be after check-in date");
        return;
      }

      if (isBefore(checkInDate, memoizedToday)) {
        setDateError("Check-in date cannot be in the past");
        return;
      }

      setDateError(null);

      getAvailableRoomsWithDate(checkInDate, checkOutDate);
    } else {
      setDateError(null);
    }
  }, [
    checkIn,
    checkOut,
    memoizedToday,
    setBookingContext,
    setSelectedRoomContext,
  ]);

  useEffect(() => {
    if (selectedRoomState && availableRoomsWithDate && !roomsLoading) {
      const isStillAvailable = availableRoomsWithDate.some(
        (room) => room.id === selectedRoomState.id
      );
      if (!isStillAvailable) {
        setSelectedRoomState(undefined);
        if (setSelectedRoomContext) {
          setSelectedRoomContext(undefined);
        }
      }
    }

    if (dateError && selectedRoomState) {
      setSelectedRoomState(undefined);
      if (setSelectedRoomContext) {
        setSelectedRoomContext(undefined);
      }
    }
  }, [
    availableRoomsWithDate,
    roomsLoading,
    selectedRoomState,
    setSelectedRoomContext,
    dateError,
  ]);

  const handleSearch = async () => {
    if (dateError || !checkIn || !checkOut) {
      return;
    }

    if (setBookingContext && setSelectedRoomContext) {
      setBookingContext({
        checkIn,
        checkOut,
      });
      setSelectedRoomContext(selectedRoomState);
    }

    router.push("/book");
  };

  const handleCheckInSelect = (date: Date | undefined) => {
    const newCheckIn = date ? startOfDay(date) : undefined;
    setCheckIn(newCheckIn);

    if (
      newCheckIn &&
      checkOut &&
      (isBefore(startOfDay(checkOut), newCheckIn) ||
        isEqual(startOfDay(checkOut), newCheckIn))
    ) {
      setCheckOut(addDays(newCheckIn, 1));
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOut(date ? startOfDay(date) : undefined);
  };

  return (
    <div className="bg-white rounded-lg md:rounded-full shadow-lg max-w-6xl mx-auto mt-8 flex flex-wrap items-center justify-between px-4 py-3 md:py-2 space-y-4 md:space-y-0 md:flex-nowrap">
      <div className="flex-1 min-w-[150px] group relative flex flex-col px-1 md:px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-left w-full">
                <span className="text-xs text-gray-500 font-medium flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                  Check in
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-0 text-left font-semibold text-sm text-gray-800 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                      {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={handleCheckInSelect}
                      initialFocus
                      disabled={(date) =>
                        isBefore(startOfDay(date), memoizedToday)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select check-in date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="hidden md:block h-6 w-px bg-gray-200 mx-1 md:mx-2" />

      <div className="flex-1 min-w-[150px] group relative flex flex-col px-1 md:px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-left w-full">
                <span className="text-xs text-gray-500 font-medium flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                  Check out
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-auto p-0 text-left font-semibold text-sm text-gray-800 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                        dateError && "text-red-500"
                      )}>
                      {checkOut
                        ? format(checkOut, "MMM d, yyyy")
                        : "Select date"}
                      {dateError && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="ml-1">⚠️</TooltipTrigger>
                            <TooltipContent className="bg-red-500 text-white">
                              <p>{dateError}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={handleCheckOutSelect}
                      initialFocus
                      disabled={(date) => {
                        const day = startOfDay(date);
                        if (checkIn) {
                          return (
                            !isBefore(startOfDay(addDays(checkIn, 1)), day) &&
                            !isEqual(startOfDay(addDays(checkIn, 1)), day)
                          );
                        }

                        return (
                          !isBefore(addDays(memoizedToday, 1), day) &&
                          !isEqual(addDays(memoizedToday, 1), day)
                        );
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select check-out date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="hidden md:block h-6 w-px bg-gray-200 mx-1 md:mx-2" />

      <div className="flex-1 min-w-[220px] md:min-w-[280px] px-1 md:px-2">
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <span className="text-xs text-gray-500 font-medium flex items-center mb-0.5">
              Room Type
            </span>
            <Select
              value={selectedRoomState?.id || ""}
              onValueChange={(selectedRoomId) => {
                if (availableRoomsWithDate) {
                  const foundRoom = availableRoomsWithDate.find(
                    (r) => r.id === selectedRoomId
                  );
                  setSelectedRoomState(foundRoom);
                  if (setSelectedRoomContext) {
                    setSelectedRoomContext(foundRoom);
                  }
                } else {
                  setSelectedRoomState(undefined);
                  if (setSelectedRoomContext) {
                    setSelectedRoomContext(undefined);
                  }
                }
              }}
              disabled={roomsLoading || !checkIn || !checkOut || !!dateError}>
              <SelectTrigger className="h-auto p-0 border-0 text-sm font-semibold text-gray-800 focus:ring-0 hover:bg-transparent data-[placeholder]:text-gray-500">
                <SelectValue placeholder="Choose Room Type">
                  {selectedRoomState
                    ? `${selectedRoomState.roomNumber} - ${selectedRoomState.roomType}`
                    : "Choose Room Type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roomsLoading ? (
                  <div className="p-2 text-sm text-muted-foreground flex items-center justify-center">
                    Loading rooms...
                  </div>
                ) : (
                  <>
                    {(!availableRoomsWithDate ||
                      availableRoomsWithDate.length === 0) &&
                      !dateError && (
                        <div className="p-2 text-sm text-muted-foreground">
                          No rooms for these dates.
                        </div>
                      )}
                    {dateError && (
                      <div className="p-2 text-sm text-red-500">
                        Please select valid dates.
                      </div>
                    )}
                    {!dateError &&
                      availableRoomsWithDate &&
                      availableRoomsWithDate.length > 0 && (
                        <>
                          {queenBeeRooms && queenBeeRooms.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Queen Bee Rooms</SelectLabel>
                              {queenBeeRooms.map((room) => (
                                <SelectItem
                                  key={room.id}
                                  value={room.id!}>
                                  {room.roomNumber} - {room.roomType}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          {suites && suites.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Suites</SelectLabel>
                              {suites.map((room) => (
                                <SelectItem
                                  key={room.id}
                                  value={room.id!}>
                                  {room.roomNumber} - {room.roomType}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          {familySuites && familySuites.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Family Suites</SelectLabel>
                              {familySuites.map((room) => (
                                <SelectItem
                                  key={room.id}
                                  value={room.id!}>
                                  {room.roomNumber} - {room.roomType}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          {singleStandardRooms &&
                            singleStandardRooms.length > 0 && (
                              <SelectGroup>
                                <SelectLabel>Single Standard</SelectLabel>
                                {singleStandardRooms.map((room) => (
                                  <SelectItem
                                    key={room.id}
                                    value={room.id!}>
                                    {room.roomNumber} - {room.roomType}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            )}
                          {singleDeluxeRooms &&
                            singleDeluxeRooms.length > 0 && (
                              <SelectGroup>
                                <SelectLabel>Single Deluxe</SelectLabel>
                                {singleDeluxeRooms.map((room) => (
                                  <SelectItem
                                    key={room.id}
                                    value={room.id!}>
                                    {room.roomNumber} - {room.roomType}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            )}
                          {twinBeeRooms && twinBeeRooms.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Twin Bee Rooms</SelectLabel>
                              {twinBeeRooms.map((room) => (
                                <SelectItem
                                  key={room.id}
                                  value={room.id!}>
                                  {room.roomNumber} - {room.roomType}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                        </>
                      )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="px-1 md:px-2 w-full md:w-auto mt-3 md:mt-0">
        <Button
          onClick={handleSearch}
          disabled={!!dateError || roomsLoading || !checkIn || !checkOut}
          className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-500 text-white rounded-full px-5 py-3 text-sm md:text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2">
          <Search className="mr-2 h-4 w-4" />
          Start Booking
        </Button>
      </div>
    </div>
  );
}
