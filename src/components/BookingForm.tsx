"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import useGetAvailableRooms from "@/hooks/roomHooks/useGetAvailableRooms";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "./Loading";
import useSeparateRoomsByType from "@/hooks/roomHooks/useSeparateRoomsByType";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NextRouter, useRouter } from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import useCreateBooking from "@/hooks/bookingHooks/useCreateBooking";
import { Booking } from "@/types/types";
import { Spinner } from "react-activity";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter your name.",
  }),
  mobileNumber: z.string().length(11, {
    message: "Please enter your mobile number.",
  }),
  roomId: z.string().min(1, {
    message: "Please pick a room to book.",
  }),
  dateRange: z.object({
    from: z.date().min(new Date(), {
      message: "Check-in date must be in the future",
    }),
    to: z.date().min(new Date(), {
      message: "Check-out date must be in the future",
    }),
  }),
  numberOfAdults: z
    .number()
    .min(1, { message: "Please enter the number of adults checking in." }),
  numberOfChildren: z
    .number()
    .min(0, { message: "Please enter the number of children checking in." }),
});

const BookingForm = ({ router }: { router: AppRouterInstance }) => {
  const { roomsAvailable } = useGetAvailableRooms();

  const { createBooking, loading: bookingLoading } = useCreateBooking();

  const {
    queenBeeRooms,
    suites,
    familySuites,
    singleStandardRooms,
    singleDeluxeRooms,
    twinBeeRooms,
  } = useSeparateRoomsByType(roomsAvailable!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      roomId: "",
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1)), // Default to next day checkout
      },
      numberOfAdults: 1,
      numberOfChildren: 0,
    },
  });

  const onSubmit: (
    values: z.infer<typeof formSchema>
  ) => Promise<void> = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const bookingData: Booking = {
          roomId: values.roomId,
          checkIn: values.dateRange.from,
          checkOut: values.dateRange.to,
          mobileNumber: values.mobileNumber,
          name: values.name,
          numberOfAdults: values.numberOfAdults,
          numberOfChildren: values.numberOfChildren,
        };
        createBooking(bookingData);
      } catch (error) {
        toast.error("An error occurred during booking");
      }
    });
  };

  // if (error) return <div>ERROR</div>;

  return (
    <Card className="flex md:w-7/16 w-full h-full p-6 bg-amber-400/30 backdrop-filter backdrop-blur-md">
      <CardHeader className="flex w-full justify-center items-center">
        <CardTitle className="text-2xl font-bold">Book Your Hotel</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full pt-10 justify-between py-2">
            <div className="flex flex-col h-auto space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="border-black"
                        type="name"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="border-black"
                        placeholder="Mobile Number (example: 09XXXXXXXXX)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-between">
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem className="w-5/12">
                      <FormLabel>Available Rooms</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-black w-full">
                            <SelectValue placeholder="Choose Your Room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Queen Bee Rooms</SelectLabel>
                            {queenBeeRooms?.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.id!}>
                                {room.roomType} - {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Suites</SelectLabel>
                            {suites?.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.id!}>
                                {room.roomType} - {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Family Suites</SelectLabel>
                            {familySuites?.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.id!}>
                                {room.roomType} - {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Single Standard Rooms</SelectLabel>
                            {singleStandardRooms?.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.id!}>
                                {room.roomType} - {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Single Deluxe Rooms</SelectLabel>
                            {singleDeluxeRooms?.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.id!}>
                                {room.roomType} - {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Twin Bee Rooms</SelectLabel>
                            {twinBeeRooms?.map((room) => (
                              <SelectItem
                                key={room.id}
                                value={room.id!}>
                                {room.roomType} - {room.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfAdults"
                  render={({ field }) => (
                    <FormItem className="w-3/12">
                      <FormLabel>Number of Adults</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-black"
                          placeholder="#"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfChildren"
                  render={({ field }) => (
                    <FormItem className="w-3/12">
                      <FormLabel>Number of Children</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="border-black"
                          placeholder="#"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Time of Stay</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal border-black bg-transparent",
                              !field.value && "text-muted-foreground"
                            )}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          disabled={(date) =>
                            date < new Date(Date.now() - 864e5)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full justify-evenly">
              <Button
                disabled={bookingLoading}
                className="w-7/16 bg-red-700 hover:bg-red-600"
                onClick={() => {
                  router.back();
                }}>
                Cancel
              </Button>
              <Button
                disabled={bookingLoading}
                type="submit"
                className="w-7/16">
                {bookingLoading ? (
                  <Spinner
                    size={10}
                    animating={bookingLoading}
                    color="#000000"
                  />
                ) : (
                  "Book Now"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
