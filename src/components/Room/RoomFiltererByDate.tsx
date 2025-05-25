"use client";

import React from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import RoomFormPopover from "./RoomFormPopover";
import { DateRange } from "react-day-picker";
import { Room } from "@/types/types";
import { GetAvailableRoomsOptions } from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";

const RoomFiltererByDate = ({
  dateRange,
  setDateRange,
  getAvailableRoomsWithDate,
}: {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  getAvailableRoomsWithDate: (
    checkIn: Date,
    checkOut: Date,
    options?: GetAvailableRoomsOptions
  ) => Promise<Room[]>;
}) => {
  return (
    <div className="flex flex-col sm:flex-row w-full gap-3 items-stretch sm:items-end">
      <div className="flex flex-col w-full space-y-1.5 sm:flex-grow">
        <Label
          htmlFor="date-range-picker-trigger"
          className="text-sm font-medium">
          Date for Rooms:
        </Label>
        <Popover>
          <PopoverTrigger
            asChild
            id="date-range-picker-trigger">
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
                !dateRange && "text-muted-foreground"
              )}>
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {" "}
                {}
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
              </span>
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
                } else if (selectedDateRange?.from && !selectedDateRange?.to) {
                }
              }}
              numberOfMonths={2}
              disabled={(date) =>
                date < new Date(new Date().setDate(new Date().getDate() - 1))
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default RoomFiltererByDate;
