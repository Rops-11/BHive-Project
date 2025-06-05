"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  startTransition,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
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
import { useRouter } from "next/navigation";

const zodFormRoomSchema = z
  .object({
    id: z.string().min(1, "Room ID is required"),
    roomNumber: z.string().min(1, "Room number is required"),
    roomType: z.string().min(1, "Room type is required"),
  })
  .passthrough();

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter your name.",
  }),
  mobileNumber: z.string().length(11, {
    message: "Please enter your mobile number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  room: z
    .union([zodFormRoomSchema, z.undefined()])
    .refine((value) => value !== undefined, {
      message: "Please pick a room to book.",
    }),
  dateRange: z
    .object({
      from: z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Check-in date must be today or in the future",
      }),
      to: z.date().min(new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Check-out date must be today or in the future",
      }),
    })
    .refine((data) => data.to > data.from, {
      message: "Check-out date must be after check-in date",
      path: ["to"],
    }),
  numberOfAdults: z.coerce
    .number({ invalid_type_error: "Please enter a number." })
    .min(1, { message: "At least 1 adult is required." }),
  numberOfChildren: z.coerce
    .number({ invalid_type_error: "Please enter a number." })
    .min(0, { message: "Number of children cannot be negative." }),
});

const BookingForm = ({ type = "Guest" }: { type?: "Admin" | "Guest" }) => {
  const {
    getAvailableRoomsWithDate,
    loading: roomsLoading,
    availableRoomsWithDate,
  } = useOnlyAvailableRoomsOnSpecificDate();

  const bookingContextHook = useContext<BookingContextType>(BookingContext);
  const setBookingContext = bookingContextHook?.setBookingContext;
  const bookingContextData = bookingContextHook?.bookingContext;
  const setSelectedRoomContext = bookingContextHook?.setSelectedRoom;
  const selectedRoomFromContext = bookingContextHook?.selectedRoom;

  const [termsAccepted, setTermsAccepted] = useState<boolean>(
    type === "Admin" ? true : false
  );

  const [isSubmittingWithCheck, setIsSubmittingWithCheck] = useState(false);
  const router = useRouter();

  const {
    queenBeeRooms,
    suites,
    familySuites,
    singleStandardRooms,
    singleDeluxeRooms,
    twinBeeRooms,
  } = useSeparateRoomsByType(availableRoomsWithDate || []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bookingContextData?.name || "",
      mobileNumber: bookingContextData?.mobileNumber || "",
      email: bookingContextData?.email || "",
      room: selectedRoomFromContext
        ? {
            id: selectedRoomFromContext.id,
            roomNumber: selectedRoomFromContext.roomNumber,
            roomType: selectedRoomFromContext.roomType,
            ...selectedRoomFromContext,
          }
        : undefined,
      dateRange: {
        from:
          bookingContextData?.checkIn ||
          new Date(new Date().setHours(0, 0, 0, 0)),
        to:
          bookingContextData?.checkOut ||
          new Date(new Date().setDate(new Date().getDate() + 1)),
      },
      numberOfAdults: bookingContextData?.numberOfAdults ?? undefined,
      numberOfChildren: bookingContextData?.numberOfChildren ?? undefined,
    },
  });

  const selectedDateRange = form.watch("dateRange");
  const formSelectedRoom = form.watch("room");

  const hasPerformedInitialRoomCheckLogic = useRef(false);
  const roomInitiallyFromContext = useRef(!!selectedRoomFromContext);

  useEffect(() => {
    const fromDate = selectedDateRange?.from;
    const toDate = selectedDateRange?.to;

    if (fromDate && toDate) {
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      if (toDate > fromDate && fromDate >= today) {
        hasPerformedInitialRoomCheckLogic.current = false;

        const formRoomId = form.getValues("room")?.id;
        const contextRoomId = selectedRoomFromContext?.id;
        const contextCheckInTime = bookingContextData?.checkIn?.getTime();
        const contextCheckOutTime = bookingContextData?.checkOut?.getTime();

        roomInitiallyFromContext.current = !!(
          formRoomId &&
          formRoomId === contextRoomId &&
          contextCheckInTime &&
          fromDate.getTime() === contextCheckInTime &&
          contextCheckOutTime &&
          toDate.getTime() === contextCheckOutTime
        );

        getAvailableRoomsWithDate(fromDate, toDate);
      }
    }
  }, [selectedDateRange, form, bookingContextData, selectedRoomFromContext]);

  useEffect(() => {
    if (roomsLoading) {
      return;
    }

    if (
      !hasPerformedInitialRoomCheckLogic.current &&
      availableRoomsWithDate &&
      availableRoomsWithDate.length === 0 &&
      !roomsLoading
    ) {
      hasPerformedInitialRoomCheckLogic.current = true;
      return;
    }
    hasPerformedInitialRoomCheckLogic.current = true;

    if (formSelectedRoom && availableRoomsWithDate) {
      const isRoomStillAvailable = availableRoomsWithDate.some(
        (room) => room.id === formSelectedRoom.id
      );

      if (!isRoomStillAvailable) {
        form.setValue(
          "room",
          undefined as unknown as z.infer<typeof formSchema>["room"],
          { shouldValidate: true, shouldDirty: true }
        );
        if (setSelectedRoomContext) {
          setSelectedRoomContext(undefined);
        }

        if (hasPerformedInitialRoomCheckLogic.current) {
          toast.info(
            "Your previously selected room is not available for the current dates. Please choose another room.",
            { autoClose: 4000 }
          );
        }

        if (roomInitiallyFromContext.current) {
          roomInitiallyFromContext.current = false;
        }
      }
    }
  }, [
    availableRoomsWithDate,
    roomsLoading,
    formSelectedRoom,
    form,
    setSelectedRoomContext,
  ]);

  const onSubmit: (
    values: z.infer<typeof formSchema>
  ) => Promise<void> = async (values: z.infer<typeof formSchema>) => {
    if (!values.room) {
      toast.error("Please select a room.");
      return;
    }
    if (!termsAccepted && type === "Guest") {
      toast.error(
        "Please read and accept the terms and conditions before continuing."
      );
      return;
    }

    setIsSubmittingWithCheck(true);

    try {
      const freshlyAvailableRooms = await getAvailableRoomsWithDate(
        values.dateRange.from,
        values.dateRange.to,
        { returnPromiseResult: true }
      );

      const isStillReallyAvailable = freshlyAvailableRooms.some(
        (room) => room.id === values.room!.id
      );

      if (!isStillReallyAvailable) {
        toast.error(
          "Sorry, the selected room just became unavailable. Please choose another room.",
          { autoClose: 5000 }
        );

        form.setValue(
          "room",
          undefined as unknown as z.infer<typeof formSchema>["room"],
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        );
        if (setSelectedRoomContext) {
          setSelectedRoomContext(undefined);
        }

        getAvailableRoomsWithDate(values.dateRange.from, values.dateRange.to);
        setIsSubmittingWithCheck(false);
        return;
      }

      const bookingData: Booking = {
        roomId: values.room.id,
        checkIn: values.dateRange.from,
        checkOut: values.dateRange.to,
        mobileNumber: values.mobileNumber,
        name: values.name,
        email: values.email,
        numberOfAdults: values.numberOfAdults,
        numberOfChildren: values.numberOfChildren,
      };

      startTransition(() => {
        if (setBookingContext) {
          if (type === "Admin") {
            setBookingContext({ ...bookingData, bookingType: "OTC" });
            router.push("/admin/book/invoice");
          } else {
            setBookingContext(bookingData);
            router.push("/book/invoice");
          }
        } else {
          toast.error("Booking context is not available.");
        }
      });
    } catch (error) {
      console.error(
        "Error during final availability check or submission:",
        error
      );
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmittingWithCheck(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full h-full pt-10 justify-between py-2">
        <div className="flex flex-col h-auto space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className="border-black"
                    type="text"
                    placeholder="Full Name"
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
                    placeholder="Mobile Number (e.g., 09XXXXXXXXX)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="border-black"
                    placeholder="your.email@example.com"
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
                          !field.value?.from && "text-muted-foreground"
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
                      onSelect={(selectedDateRangeValue) => {
                        if (
                          selectedDateRangeValue?.from &&
                          !selectedDateRangeValue.to
                        ) {
                          field.onChange({
                            from: selectedDateRangeValue.from,
                            to: undefined,
                          });
                        } else {
                          field.onChange(selectedDateRangeValue);
                        }
                      }}
                      numberOfMonths={2}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col md:flex-row w-full justify-between gap-4">
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem className="w-full md:w-5/12">
                  <FormLabel>Available Rooms</FormLabel>
                  <Select
                    value={field.value?.id || ""}
                    onValueChange={(selectedRoomId) => {
                      if (availableRoomsWithDate) {
                        const foundRoom = availableRoomsWithDate.find(
                          (r) => r.id === selectedRoomId
                        );
                        field.onChange(foundRoom || undefined);
                        if (setSelectedRoomContext) {
                          setSelectedRoomContext(foundRoom || undefined);
                        }
                      }
                    }}
                    disabled={
                      roomsLoading ||
                      !selectedDateRange?.from ||
                      !selectedDateRange?.to ||
                      selectedDateRange.to <= selectedDateRange.from
                    }>
                    <FormControl>
                      <SelectTrigger className="border-black w-full">
                        <SelectValue placeholder="Choose Your Room">
                          {field.value
                            ? `${field.value.roomNumber} - ${field.value.roomType}`
                            : "Choose Your Room"}
                          <div id="selectRoom"></div>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomsLoading ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Loading rooms...
                        </div>
                      ) : (
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
                          {!roomsLoading &&
                            (!availableRoomsWithDate ||
                              availableRoomsWithDate.length === 0) && (
                              <div className="p-2 text-sm text-muted-foreground">
                                No rooms available for the selected dates.
                              </div>
                            )}
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
                <FormItem className="w-full md:w-3/12">
                  <FormLabel>Adults</FormLabel>
                  <FormControl>
                    <Input
                      id="adult"
                      type="number"
                      min="1"
                      className="border-black"
                      placeholder="#"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
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
                <FormItem className="w-full md:w-3/12">
                  <FormLabel>Children</FormLabel>
                  <FormControl>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      className="border-black"
                      placeholder="#"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value)
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

        <div className="flex flex-col w-full space-y-5 justify-end pt-8">
          {type === "Guest" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="border-black"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              />
              <Label
                htmlFor="terms"
                className="cursor-pointer">
                I have read and accept the{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="underline underline-offset-2 text-blue-600 hover:text-blue-500 cursor-pointer">
                      terms and conditions
                    </span>
                  </DialogTrigger>
                  <DialogContent className="h-auto max-h-[80vh] flex flex-col">
                    <DialogTitle>
                      {" "}
                      BHive Hotel House Rules & Guidelines:{" "}
                    </DialogTitle>
                    <DialogDescription className="overflow-y-auto flex-grow pr-2">
                      Please read and adhere to the following house rules and
                      guidelines during your stay at BHive Hotel. These rules
                      are designed to ensure a safe, comfortable, and enjoyable
                      experience for all guests. Failure to comply may result in
                      penalties or eviction without refund.
                      <br />
                      <br />
                      1. Check-In & Check-Out: Standard check-in time is 2:00
                      PM, and check-out is 12:00 NN. Early check-in or late
                      check-out is subject to availability and extra charges.
                      <br />
                      <br />
                      2. Guest Responsibility: Guests are responsible for their
                      personal belongings. The hotel is not liable for lost or
                      stolen items.
                      <br />
                      <br />
                      3. Room Capacity & Extra Persons: Each room has a maximum
                      capacity. An extra charge of Php 600.00 applies per
                      additional guest.
                      <br />
                      <br />
                      4. Noise & Disturbances: Please be considerate. Loud music
                      or noise disturbing other guests is not allowed.
                      <br />
                      <br />
                      5. Smoking & Vaping Policy: Strictly prohibited. A penalty
                      of Php 3,000.00 applies per violation.
                      <br />
                      <br />
                      6. Pets & Prohibited Items: Pets are not allowed.
                      Hazardous items like explosives, firearms, and dangerous
                      chemicals are strictly prohibited.
                      <br />
                      <br />
                      7. Damage Charges: Guests will be charged for any damages
                      to hotel property, including stained beddings (Php
                      2,000.00).
                      <br />
                      <br />
                      8. Health & Safety Regulations: Guests must comply with
                      sanitation and distancing guidelines for public health
                      safety.
                      <br />
                      <br />
                      9. Booking Policies: Reservations require a 50% down
                      payment, which is non-refundable.
                      <br />
                      <br />
                      10. Privacy Policy: Personal data is collected and
                      processed in line with the Data Privacy Act of 2012.{" "}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
                .
              </Label>
            </div>
          )}
          <div className="flex flex-col md:flex-row w-full md:justify-evenly gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-5/12 border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => {
                router.back();
              }}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full md:w-5/12"
              disabled={
                isSubmittingWithCheck ||
                (type === "Guest" && !termsAccepted) ||
                (!form.formState.isValid && form.formState.isSubmitted)
              }>
              {isSubmittingWithCheck ? "Checking & Processing..." : "Proceed"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
