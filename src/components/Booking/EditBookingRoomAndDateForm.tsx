"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { startTransition, useEffect, useState } from "react";
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
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { format as formatDate } from "date-fns";
import { Booking, Room as RoomType } from "@/types/types";
import useOnlyAvailableRoomsOnSpecificDate from "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate";
import useUpdateBooking from "@/hooks/bookingHooks/useUpdateBooking";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";

const toInputDateString = (date: Date | undefined | null): string => {
  if (!date) return "";
  try {
    return formatDate(date, "yyyy-MM-dd");
  } catch (e) {
    console.error("Invalid date passed to toInputDateString:", date, e);
    return "";
  }
};

const fromInputDateString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;

  const date = new Date(dateString + "T00:00:00Z");
  if (isNaN(date.getTime())) {
    return undefined;
  }
  return date;
};

const zodFormRoomSchema = z
  .object({
    id: z.string().min(1, "Room ID is required"),
    roomNumber: z.string().min(1, "Room number is required"),
    roomType: z.string().min(1, "Room type is required"),
  })
  .passthrough();

type FormRoomType = z.infer<typeof zodFormRoomSchema>;

const editRoomDateFormSchema = z.object({
  room: z.union([zodFormRoomSchema, z.undefined()]).optional(),
  dateRange: z
    .object({
      from: z
        .date({ invalid_type_error: "Valid check-in date required." })
        .min(new Date(new Date().setHours(0, 0, 0, 0)), {
          message: "Check-in date must be today or in the future",
        })
        .optional()
        .nullable(),
      to: z
        .date({ invalid_type_error: "Valid check-out date required." })
        .min(new Date(new Date().setHours(0, 0, 0, 0)), {
          message: "Check-out date must be today or in the future",
        })
        .optional()
        .nullable(),
    })
    .refine(
      (data) => {
        if (data.from && data.to) {
          return data.to > data.from;
        }
        return true;
      },
      {
        message: "Check-out date must be after check-in date.",
        path: ["to"],
      }
    )
    .refine((data) => !!data.from, {
      message: "Check-in date is required.",
      path: ["from"],
    })
    .refine((data) => !!data.to, {
      message: "Check-out date is required.",
      path: ["to"],
    }),
});

type EditRoomDateFormValues = z.infer<typeof editRoomDateFormSchema>;

interface EditBookingRoomAndDateFormProps {
  booking: Booking & { room?: RoomType };
  onUpdateSuccess?: () => void;
}

const KEEP_ORIGINAL_ROOM_VALUE = "__KEEP_ORIGINAL_ROOM__";

const EditBookingRoomAndDateForm: React.FC<EditBookingRoomAndDateFormProps> = ({
  booking,
  onUpdateSuccess,
}) => {
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [currentBookingIdForInit, setCurrentBookingIdForInit] = useState<
    string | undefined
  >();

  const {
    getAvailableRoomsWithDate,
    loading: roomsLoading,
    availableRoomsWithDate,
  } = useOnlyAvailableRoomsOnSpecificDate();

  const { updateRoomInBooking, loading: updateLoading } = useUpdateBooking();

  const {
    queenBeeRooms,
    suites,
    familySuites,
    singleStandardRooms,
    singleDeluxeRooms,
    twinBeeRooms,
  } = useSeparateRoomsByType(availableRoomsWithDate || []);

  const form = useForm<EditRoomDateFormValues>({
    resolver: zodResolver(editRoomDateFormSchema),
    defaultValues: {
      room: undefined,
      dateRange: {
        from: booking?.checkIn ? new Date(booking.checkIn) : undefined,
        to: booking?.checkOut ? new Date(booking.checkOut) : undefined,
      },
    },
    mode: "onChange",
  });

  const { reset, watch, setValue, handleSubmit, control, formState, trigger } =
    form;

  useEffect(() => {
    if (booking && booking.id !== currentBookingIdForInit) {
      setIsFormInitialized(false);
      setCurrentBookingIdForInit(booking.id);

      const checkInDate = booking.checkIn
        ? new Date(booking.checkIn)
        : undefined;
      const checkOutDate = booking.checkOut
        ? new Date(booking.checkOut)
        : undefined;

      reset({
        room: undefined,
        dateRange: { from: checkInDate, to: checkOutDate },
      });

      if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
        getAvailableRoomsWithDate(checkInDate, checkOutDate, {
          excludeBookingId: booking.id,
        })
          .catch((err) => {
            console.error("EFFECT 1 (Initial Load): Room fetch error:", err);
          })
          .finally(() => {
            setIsFormInitialized(true);
          });
      } else {
        setIsFormInitialized(true);
      }
    } else if (!booking && currentBookingIdForInit) {
      setCurrentBookingIdForInit(undefined);
      setIsFormInitialized(false);
      reset({ room: undefined, dateRange: { from: undefined, to: undefined } });
    }
  }, [booking, reset, getAvailableRoomsWithDate, currentBookingIdForInit]);

  const selectedDateFrom = watch("dateRange.from");
  const selectedDateTo = watch("dateRange.to");
  const formRoomValue = watch("room");

  useEffect(() => {
    if (!isFormInitialized || !booking?.id) {
      return;
    }

    if (
      selectedDateFrom &&
      selectedDateTo &&
      selectedDateTo > selectedDateFrom
    ) {
      getAvailableRoomsWithDate(selectedDateFrom, selectedDateTo, {
        excludeBookingId: booking.id,
      }).catch((err) =>
        console.error("EFFECT 2 (User Date Change): Room fetch error:", err)
      );
    } else if (selectedDateFrom || selectedDateTo) {
    }
  }, [
    selectedDateFrom,
    selectedDateTo,
    isFormInitialized,
    getAvailableRoomsWithDate,
    booking?.id,
  ]);

  useEffect(() => {
    if (
      !isFormInitialized ||
      !formRoomValue ||
      !availableRoomsWithDate ||
      roomsLoading
    ) {
      return;
    }
    const isRoomStillAvailable = availableRoomsWithDate.some(
      (r) => r.id === formRoomValue.id
    );
    if (!isRoomStillAvailable) {
      setValue("room", undefined, { shouldValidate: true, shouldDirty: true });
      toast.info(
        "The previously selected new room is no longer available for these dates. Selection cleared.",
        { autoClose: 4000 }
      );
    }
  }, [
    availableRoomsWithDate,
    roomsLoading,
    formRoomValue,
    setValue,
    isFormInitialized,
  ]);

  const onSubmitHandler = async (values: EditRoomDateFormValues) => {
    if (!booking || !booking.id || !booking.roomId) {
      toast.error(
        "Original booking information is incomplete (missing ID or RoomID)."
      );
      return;
    }
    if (!values.dateRange.from || !values.dateRange.to) {
      toast.error("Please select valid check-in and check-out dates.");
      form.trigger(["dateRange.from", "dateRange.to"]);
      return;
    }

    startTransition(async () => {
      try {
        const payloadRoomId = values.room ? values.room.id : booking.roomId!;
        const payload = {
          roomId: payloadRoomId,
          checkIn: values.dateRange.from!,
          checkOut: values.dateRange.to!,
        };

        const fetchedRoomsForFinalCheck = await getAvailableRoomsWithDate(
          payload.checkIn,
          payload.checkOut,
          {
            excludeBookingId: booking.id!,
            returnPromiseResult: true,
          }
        );
        const finalRoomCheckList: RoomType[] = fetchedRoomsForFinalCheck || [];

        const isChosenRoomAvailable = finalRoomCheckList.some(
          (r) => r.id === payload.roomId
        );

        if (!isChosenRoomAvailable) {
          const roomDetailForToast = values.room
            ? `${values.room.roomNumber} - ${values.room.roomType}`
            : booking.room
            ? `${booking.room.roomNumber} - ${booking.room.roomType}`
            : `ID ${payload.roomId.substring(0, 6)}`;

          toast.error(
            `Room ${roomDetailForToast} is not available for the selected new dates. Please choose another room or adjust dates.`
          );
          return;
        }

        await updateRoomInBooking(booking.id!, payload);
        if (onUpdateSuccess) onUpdateSuccess();
        location.reload();
      } catch (error) {
        console.error("Form submission error:", error);
        let errorMessage = "An error occurred while updating the booking.";
        if (error instanceof Error) {
          if (
            error.message
              .toLowerCase()
              .includes("not available for the chosen dates") ||
            error.message.toLowerCase().includes("room is not available")
          ) {
            return;
          }
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      }
    });
  };

  const minDateForFromInput = toInputDateString(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  let minDateForToInput: string;
  if (selectedDateFrom) {
    const nextDayAfterFrom = new Date(selectedDateFrom);
    nextDayAfterFrom.setDate(selectedDateFrom.getDate() + 1);
    minDateForToInput = toInputDateString(nextDayAfterFrom);
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    minDateForToInput = toInputDateString(tomorrow);
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[200px]">
        <p className="text-muted-foreground">No booking data provided.</p>
      </div>
    );
  }
  if (booking.id !== currentBookingIdForInit || !isFormInitialized) {
    return (
      <div className="flex items-center justify-center h-full w-full min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading booking data...</p>
      </div>
    );
  }

  const currentRoomDisplay = booking.room
    ? `${booking.room.roomNumber} - ${booking.room.roomType}`
    : "N/A (No current room)";
  const selectPlaceholder = `Keep current room (${currentRoomDisplay})`;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="dateRange.from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Check-in Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="border-black bg-transparent focus-visible:ring-ring"
                    value={toInputDateString(field.value)}
                    onChange={(e) => {
                      const newDate = fromInputDateString(e.target.value);
                      field.onChange(newDate);
                      if (
                        newDate &&
                        selectedDateTo &&
                        newDate >= selectedDateTo
                      ) {
                        setValue("dateRange.to", undefined, {
                          shouldValidate: true,
                        });
                      }
                      trigger("dateRange.from");
                      trigger("dateRange.to");
                    }}
                    min={minDateForFromInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dateRange.to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Check-out Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="border-black bg-transparent focus-visible:ring-ring"
                    value={toInputDateString(field.value)}
                    onChange={(e) => {
                      const newDate = fromInputDateString(e.target.value);
                      field.onChange(newDate);
                      trigger("dateRange.to");
                      trigger("dateRange.from");
                    }}
                    min={minDateForToInput}
                    disabled={!selectedDateFrom}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="room"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                New Available Room{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional - select to change)
                </span>
              </FormLabel>
              <Select
                value={field.value?.id || ""}
                onValueChange={(selectedValue) => {
                  if (selectedValue === KEEP_ORIGINAL_ROOM_VALUE) {
                    field.onChange(undefined);
                    return;
                  }

                  if (availableRoomsWithDate && selectedValue) {
                    const foundRoom = availableRoomsWithDate.find(
                      (r) => r.id === selectedValue
                    );
                    field.onChange(
                      foundRoom
                        ? ({
                            id: foundRoom.id,
                            roomNumber: String(foundRoom.roomNumber),
                            roomType: foundRoom.roomType,
                          } as FormRoomType)
                        : undefined
                    );
                  } else {
                    field.onChange(undefined);
                  }
                }}>
                <FormControl>
                  <SelectTrigger className="border-black w-full">
                    <SelectValue placeholder={selectPlaceholder}>
                      {field.value
                        ? `${field.value.roomNumber} - ${field.value.roomType}`
                        : selectPlaceholder}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={KEEP_ORIGINAL_ROOM_VALUE}>
                    <em>{selectPlaceholder}</em>
                  </SelectItem>

                  {roomsLoading ? (
                    <div className="p-2 text-sm text-muted-foreground flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                      rooms...
                    </div>
                  ) : (
                    <>
                      {!availableRoomsWithDate ||
                      availableRoomsWithDate.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No other rooms available for these dates.
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
                        </>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              updateLoading || !formState.isDirty || !formState.isValid
            }>
            {updateLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {updateLoading ? "Saving..." : "Save Room & Date Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditBookingRoomAndDateForm;
