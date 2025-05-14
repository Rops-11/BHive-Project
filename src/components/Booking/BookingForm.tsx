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

const BookingForm = ({ router }: { router: AppRouterInstance }) => {
  const {
    getAvailableRoomsWithDate,
    loading: roomsLoading,
    availableRoomsWithDate,
  } = useOnlyAvailableRoomsOnSpecificDate();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const contextHook = useContext<BookingContextType>(BookingContext);
  const setBookingContext = contextHook?.setBookingContext;
  const setSelectedRoomContext = contextHook?.setSelectedRoom;

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
      email: "",
      room: undefined,
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1)),
      },
      numberOfAdults: undefined,
      numberOfChildren: undefined,
    },
  });

  const selectedDateRange = form.watch("dateRange");
  const selectedRoom = form.watch("room");

  useEffect(() => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      if (selectedDateRange.to > selectedDateRange.from) {
        getAvailableRoomsWithDate(selectedDateRange.from, selectedDateRange.to);
      }
    }
  }, [selectedDateRange]);

  useEffect(() => {
    if (selectedRoom && availableRoomsWithDate && !roomsLoading) {
      const isRoomStillAvailable = availableRoomsWithDate.some(
        (room) => room.id === selectedRoom.id
      );
      if (!isRoomStillAvailable) {
        //! form.setValue("room", undefined as any, {
        //!   shouldValidate: true,
        //!   shouldDirty: true,
        //! });
        form.setValue(
          "room",
          undefined as unknown as z.infer<typeof formSchema>["room"],
          { shouldValidate: true, shouldDirty: true }
        );

        if (setSelectedRoomContext) {
          setSelectedRoomContext(undefined);
        }
        toast.info(
          "Your previously selected room is not available for the new dates. Please choose another room.",
          { autoClose: 4000 }
        );
      }
    }
  }, [
    availableRoomsWithDate,
    roomsLoading,
    selectedRoom,
    form,
    setSelectedRoomContext,
  ]);

  useEffect(() => {
    const dateToday = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(dateToday.getDate() + 1);
    if (!availableRoomsWithDate) {
      getAvailableRoomsWithDate(dateToday, tomorrow);
    }
  }, [availableRoomsWithDate, getAvailableRoomsWithDate]);

  const onSubmit: (
    values: z.infer<typeof formSchema>
  ) => Promise<void> = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const bookingData: Booking = {
          roomId: values.room!.id,
          checkIn: values.dateRange.from,
          checkOut: values.dateRange.to,
          mobileNumber: values.mobileNumber,
          name: values.name,
          email: values.email,
          numberOfAdults: values.numberOfAdults,
          numberOfChildren: values.numberOfChildren,
        };
        if (termsAccepted) {
          if (setBookingContext) {
            setBookingContext(bookingData);
            router.push("/book/invoice");
          } else {
            toast.error("Booking context is not available.");
          }
        } else {
          toast.error(
            "Please read and accept the terms and conditions before continuing."
          );
        }
      } catch (error) {
        console.error("Booking submission error:", error);
        toast.error("An error occurred during booking. Please try again.");
      }
    });
  };

  return (
    <Card className="flex lg:w-7/16 w-full h-full p-6">
      <CardHeader className="flex w-full justify-center items-center">
        <CardTitle className="text-2xl font-bold">Book Your Hotel</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full">
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
                          onSelect={(selectedDateRange) => {
                            field.onChange(selectedDateRange);
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
                            if (foundRoom) {
                              field.onChange(foundRoom);
                              if (setSelectedRoomContext) {
                                setSelectedRoomContext(foundRoom);
                              }
                            } else {
                              field.onChange(undefined);
                              if (setSelectedRoomContext) {
                                setSelectedRoomContext(undefined);
                              }
                            }
                          }
                        }}>
                        <FormControl>
                          <SelectTrigger className="border-black w-full">
                            <SelectValue placeholder="Choose Your Room">
                              {field.value
                                ? `${field.value.roomNumber} - ${field.value.roomType}`
                                : "Choose Your Room"}
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
                      <DialogTitle>Terms and Conditions</DialogTitle>
                      <DialogDescription className="overflow-y-auto flex-grow pr-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Aperiam deserunt ut consequatur aliquam velit porro
                        dolores enim quasi sit aliquid hic nisi numquam nobis,
                        tenetur quod ipsum optio! Aliquid, autem. Corrupti quod
                        veritatis, totam ad ipsa architecto officiis eaque amet?
                        Placeat impedit omnis nam sint labore deserunt harum
                        consectetur, atque quod nemo animi magnam ad et minus
                        itaque mollitia neque? Dolorem animi adipisci ipsam, cum
                        maxime vel facere omnis iure quia, labore mollitia,
                        voluptatem nulla cumque pariatur veniam provident
                        tempore architecto reprehenderit sed voluptates iusto
                        sequi possimus nesciunt! Dignissimos, ex. Alias, ipsam
                        et aperiam accusamus soluta ducimus voluptate,
                        exercitationem quas odio quod deserunt minus animi.
                        Exercitationem sequi, assumenda id ipsa dignissimos
                        commodi sed! Enim debitis pariatur ex, accusantium sint
                        at? Sit tempora placeat natus eaque repellendus sapiente
                        quas corporis distinctio a magni, consequuntur laborum
                        suscipit inventore, in amet asperiores laboriosam itaque
                        numquam, veniam deserunt nam? Ipsum eum saepe reiciendis
                        inventore? Officiis cupiditate corporis et dolor est
                        veritatis modi officia necessitatibus totam, voluptatem,
                        iusto velit qui aut molestias recusandae non repellendus
                        harum magnam placeat delectus commodi atque odit. Sint,
                        similique placeat! Quo, inventore aperiam. In
                        laboriosam, sed inventore nam tempore laborum maiores
                        debitis, ullam expedita doloremque quas repellendus id
                        explicabo aspernatur non quisquam eum assumenda, alias
                        cumque quod harum sapiente ut. Animi inventore sapiente
                        beatae dicta dolore voluptatum, rerum nemo nulla,
                        explicabo possimus laboriosam nam alias, doloremque quas
                        repudiandae maxime veniam corrupti amet perspiciatis
                        iure? Esse at neque sunt temporibus possimus. Iure
                        deleniti facilis sit laudantium? Neque odio ipsa
                        voluptatem, quaerat, itaque, consequuntur delectus eum
                        mollitia minima ullam magni distinctio est officiis
                        commodi maiores natus ratione? Enim doloribus magni
                        dicta deserunt? Minima cum eaque a mollitia inventore,
                        adipisci veritatis consectetur amet voluptatum vero
                        neque repellendus ea accusamus autem laborum. Incidunt,
                        eveniet sint in repellat exercitationem ex aliquam
                        assumenda. Ratione, incidunt magnam.
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                  .
                </Label>
              </div>
              <div className="flex w-full justify-evenly gap-4">
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
                    form.formState.isSubmitting ||
                    !termsAccepted ||
                    (!form.formState.isValid && form.formState.isSubmitted)
                  }>
                  {form.formState.isSubmitting ? "Processing..." : "Proceed"}
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
