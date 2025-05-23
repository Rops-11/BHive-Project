"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Search, Users, Home } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BookRoom() {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    addDays(new Date(), 1)
  );
  const [rooms, setRooms] = useState<number>(1);
  const [guests, setGuests] = useState<number>(2);
  const [dateError, setDateError] = useState<string | null>(null);

  // Validate dates
  useEffect(() => {
    if (checkIn && checkOut) {
      if (isBefore(checkOut, checkIn)) {
        setDateError("Check-out date must be after check-in date");
      } else if (isBefore(checkIn, new Date())) {
        setDateError("Check-in date cannot be in the past");
      } else {
        setDateError(null);
      }
    }
  }, [checkIn, checkOut]);

  const handleSearch = () => {
    if (dateError) return;

    // Navigate to /rooms
    router.push("/rooms");
  };

  return (
    <div className="bg-white rounded-full shadow-lg max-w-6xl mx-auto mt-8 flex flex-wrap items-center justify-between px-4 py-2 space-y-4 md:space-y-0 md:flex-nowrap">
      {/* Check-in */}
      <div className="flex-1 min-w-[150px] group relative flex flex-col px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-left">
                <span className="text-xs text-gray-500 font-medium flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                  Check in
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 text-left font-semibold text-sm text-gray-800 hover:bg-transparent"
                    >
                      {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
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

      {/* Divider */}
      <div className="hidden md:block h-6 w-px bg-gray-200 mx-2" />

      {/* Check-out */}
      <div className="flex-1 min-w-[150px] group relative flex flex-col px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-left">
                <span className="text-xs text-gray-500 font-medium flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1 text-gray-400" />
                  Check out
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-auto p-0 text-left font-semibold text-sm text-gray-800 hover:bg-transparent",
                        dateError && "text-red-500"
                      )}
                    >
                      {checkOut
                        ? format(checkOut, "MMM d, yyyy")
                        : "Select date"}
                      {dateError && " ⚠️"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      initialFocus
                      disabled={(date) =>
                        checkIn ? isBefore(date, checkIn) : false
                      }
                    />
                    {dateError && (
                      <p className="text-xs text-red-500 p-2">{dateError}</p>
                    )}
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

      {/* Divider */}
      <div className="hidden md:block h-6 w-px bg-gray-200 mx-2" />

      {/* Rooms & Guests */}
      <div className="flex-1 min-w-[200px] px-2">
        <span className="text-xs text-gray-500 font-medium flex items-center mb-0.5">
          <Users className="h-3 w-3 mr-1 text-gray-400" />
          Guests
        </span>
        <div className="flex items-center space-x-2">
          <Select
            value={rooms.toString()}
            onValueChange={(value) => setRooms(Number(value))}
          >
            <SelectTrigger className="h-auto w-auto border-0 p-0 text-sm font-semibold text-gray-800 focus:ring-0">
              <SelectValue>
                <span className="flex items-center">
                  <Home className="h-4 w-4 mr-1 text-gray-600" />
                  {rooms} {rooms === 1 ? "Room" : "Rooms"}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Room" : "Rooms"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-400 font-bold px-1">·</span>

          <Select
            value={guests.toString()}
            onValueChange={(value) => setGuests(Number(value))}
          >
            <SelectTrigger className="h-auto w-auto border-0 p-0 text-sm font-semibold text-gray-800 focus:ring-0">
              <SelectValue>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-600" />
                  {guests} {guests === 1 ? "Guest" : "Guests"}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="px-2 w-full md:w-auto mt-2 md:mt-0">
        <Button
          onClick={handleSearch}
          disabled={!!dateError}
          className="w-full md:w-auto bg-yellow-700 hover:bg-yellow-500 text-white rounded-full px-6 py-3 text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
