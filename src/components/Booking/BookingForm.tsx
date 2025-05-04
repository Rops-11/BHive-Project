"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSeparateRoomsByType from "@/hooks/roomHooks/useSeparateRoomsByType";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Booking } from "@/types/types";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BookingContextType } from "@/types/context";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import { BookingContext } from "../providers/BookProvider";
import useCreateBooking from "@/hooks/bookingHooks/useCreateBooking";

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
  const {
    getAvailableRoomsWithDate,
    loading: roomsLoading,
    availableRoomsWithDate,
  } = useOnlyAvailableRoomsOnSpecificDate();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const { setBookingContext } = useContext<BookingContextType>(BookingContext);
  const { createBooking } = useCreateBooking();

  const {
    queenBeeRooms,
    suites,
    familySuites,
    singleStandardRooms,
    singleDeluxeRooms,
    twinBeeRooms,
  } = useSeparateRoomsByType(availableRoomsWithDate!);

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

  useEffect(() => {
    const dateToday = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(dateToday.getDate() + 1);
    getAvailableRoomsWithDate(dateToday, tomorrow);
  }, []);

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
        if (termsAccepted) {
          setBookingContext!(bookingData);
          createBooking(bookingData);
          router.push("/book/invoice");
        } else
          toast.error(
            "Please read and accept the terms and conditions before continuing."
          );
      } catch {
        toast.error("An error occurred during booking");
      }
    });
  };

  return (
    <Card className="flex md:w-7/16 w-full h-full p-6">
      <CardHeader className="flex w-full justify-center items-center">
        <CardTitle className="text-2xl font-bold">Book Your Hotel</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full h-full pt-10 justify-between py-2">
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
                          onSelect={(selectedDateRange) => {
                            field.onChange(selectedDateRange);
                            if (
                              selectedDateRange?.from &&
                              selectedDateRange?.to
                            ) {
                              getAvailableRoomsWithDate(
                                selectedDateRange.from,
                                selectedDateRange.to
                              );
                            }
                          }}
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
              <div className="flex w-full justify-between">
                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem className="w-5/12">
                      <FormLabel>Available Rooms on Date Provided</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-black w-full">
                            <SelectValue placeholder="Choose Your Room" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {!roomsLoading ? (
                            <>
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
                            </>
                          ) : (
                            <>
                              <Label className="p-2">
                                Please wait a moment for the rooms to load. If
                                it takes too long, please refresh.
                              </Label>
                            </>
                          )}
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
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value)
                            );
                          }}
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
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseInt(e.target.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col w-full space-y-5 justify-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="border-black"
                  checked={termsAccepted}
                  onCheckedChange={() => setTermsAccepted(!termsAccepted)}
                />
                <Dialog>
                  <Label className="gap-1">
                    Accept{" "}
                    <DialogTrigger asChild>
                      <div className="underline underline-offset-2 text-blue-500 hover:text-blue-500/80">
                        terms and conditions.
                      </div>
                    </DialogTrigger>
                  </Label>
                  <DialogContent className="h-2/3">
                    <DialogTitle>Terms and Conditions</DialogTitle>
                    <DialogDescription className="overflow-y-scroll">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aenean bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam. Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Aenean
                      bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam.Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Aenean
                      bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam.Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Aenean
                      bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam.Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Aenean
                      bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam.Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Aenean
                      bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam.Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit. Aenean
                      bibendum, neque vel egestas ultrices, augue tellus
                      sagittis erat, vitae luctus quam eros ac mi. Nunc vehicula
                      nibh vitae justo convallis, eu elementum ligula lacinia.
                      Aenean laoreet, dui eget finibus accumsan, orci risus
                      ultricies augue, a sollicitudin orci nisl non est. Vivamus
                      at dictum nisi, eu lacinia tortor. Aliquam dignissim
                      ligula tempor leo aliquam, condimentum vehicula enim
                      faucibus. Pellentesque vitae nulla porta, blandit felis
                      et, posuere augue. Phasellus rhoncus cursus nulla vitae
                      volutpat. Quisque efficitur lacus ac fringilla pulvinar.
                      Integer erat odio, blandit et neque et, eleifend bibendum
                      lorem. Sed egestas metus sit amet rhoncus dignissim.
                      Praesent orci enim, bibendum ut mauris a, sagittis finibus
                      neque. Pellentesque habitant morbi tristique senectus et
                      netus et malesuada fames ac turpis egestas. Maecenas
                      lacinia elementum nibh non sodales. Phasellus semper
                      auctor ante efficitur vestibulum. Donec ut libero
                      efficitur, interdum arcu sed, sagittis ligula. Ut odio
                      felis, feugiat id commodo eu, commodo a diam.
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex w-full justify-evenly">
                <Button
                  className="w-7/16 bg-red-700 hover:bg-red-600"
                  onClick={() => {
                    router.back();
                  }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-7/16">
                  Proceed
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
