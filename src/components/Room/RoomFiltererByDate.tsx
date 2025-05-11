import React from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import RoomForm from "./RoomFormPopover";
import { DateRange } from "react-day-picker";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const RoomFiltererByDate = ({
  dateRange,
  setDateRange,
  getAvailableRoomsWithDate,
  role = "Guest",
}: {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  getAvailableRoomsWithDate: (
    checkIn: Date,
    checkOut: Date
  ) => Promise<never[] | undefined>;
  role?: "Guest" | "Admin";
}) => {
  return (
    <Card className="flex flex-row p-4 md:w-4/5 lg:w-3/4 xl:w-2/3 space-x-2 justify-between items-end">
      <div className="flex flex-col w-full space-y-1">
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
      {role === "Admin" && (
        <div className="flex w-[14%]">
          <RoomForm
            type="Add"
          />
        </div>
      )}
    </Card>
  );
};

export default RoomFiltererByDate;
