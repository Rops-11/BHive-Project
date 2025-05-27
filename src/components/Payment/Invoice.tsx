"use client";

import React, { useContext, useEffect, useState } from "react";
import { BookingContextType } from "@/types/context";
import { checkDaysDifference } from "utils/utils";
import { BookingContext } from "../providers/BookProvider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import useCreateBooking from "@/hooks/bookingHooks/useCreateBooking";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import BookingMissingFallback from "./BookingMissingFallback";
import useCheckRoomAvailability from "@/hooks/roomHooks/useCheckRoomAvailability";
import { toast } from "react-toastify";
import { Booking } from "@/types/types";

const InvoiceCard = ({
  admin,
  selectedFile,
  paymentType,
}: {
  admin: boolean;
  selectedFile?: File | null;
  paymentType?: string;
}) => {
  const router = useRouter();
  const context = useContext<BookingContextType>(BookingContext);

  const bookingContext = context?.bookingContext;
  const setBookingContext = context?.setBookingContext;
  const selectedRoom = context?.selectedRoom;
  const setSelectedRoom = context?.setSelectedRoom;

  const {
    createBooking,
    loading: createBookingAPILoading,
    bookingDetails: createdBookingDetails,
    error: createBookingError,
  } = useCreateBooking();

  const { checkRoomIsAvailable, isLoading: isCheckingAvail } =
    useCheckRoomAvailability();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (!bookingContext) {
      const timeout = setTimeout(() => {
        if (!context?.bookingContext) {
          toast.warn("Booking details missing, redirecting...");
          router.push(admin ? "/admin/book" : "/book");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [bookingContext, context, router, admin]);

  useEffect(() => {
    if (
      createdBookingDetails &&
      createdBookingDetails.id &&
      !createBookingAPILoading
    ) {
      setShowRedirectMessage(true);

      if (setBookingContext) setBookingContext(undefined);
      if (setSelectedRoom) setSelectedRoom(undefined);

      const redirectPath = admin ? "/admin/inbox" : `/`;

      const redirectTimeout = setTimeout(() => {
        router.push(redirectPath);
      }, 2500);

      return () => clearTimeout(redirectTimeout);
    }
  }, [
    createdBookingDetails,
    createBookingAPILoading,
    admin,
    router,
    setBookingContext,
    setSelectedRoom,
  ]);

  useEffect(() => {
    if (createBookingError && !createBookingAPILoading) {
      const errorMessage =
        typeof createBookingError === "string"
          ? createBookingError
          : (createBookingError as Error)?.message ||
            "Failed to create booking.";
      toast.error(errorMessage);
      setIsProcessingPayment(false);
    }
  }, [createBookingError, createBookingAPILoading]);

  if (!bookingContext || !selectedRoom) {
    return <BookingMissingFallback />;
  }

  const daysDiff =
    bookingContext.checkIn && bookingContext.checkOut
      ? checkDaysDifference(bookingContext.checkIn, bookingContext.checkOut)
      : 0;

  let excessGuestCount = 0;
  if (
    bookingContext.numberOfAdults !== undefined &&
    bookingContext.numberOfChildren !== undefined &&
    selectedRoom?.maxGuests !== undefined &&
    daysDiff > 0
  ) {
    const totalGuests =
      bookingContext.numberOfAdults + bookingContext.numberOfChildren;
    if (totalGuests > selectedRoom.maxGuests) {
      excessGuestCount = totalGuests - selectedRoom.maxGuests;
    }
  }

  const excessGuestPrice = excessGuestCount * 100;
  const totalRoomPrice = (selectedRoom?.roomRate ?? 0) * daysDiff;
  const finalTotal = excessGuestPrice + totalRoomPrice;
  const downPayment = finalTotal * 0.1;

  const handleClickPay = async () => {
    if (
      !bookingContext ||
      !selectedRoom ||
      !setBookingContext ||
      !setSelectedRoom
    ) {
      toast.error("Booking details are incomplete. Please try again.");
      router.push(admin ? "/admin/book" : "/book");
      return;
    }
    if (finalTotal <= 0 && daysDiff > 0) {
      toast.warn(
        "Total amount is invalid. Please review your booking dates and details."
      );
      return;
    }
    if (daysDiff <= 0) {
      toast.warn("Please select valid check-in and check-out dates.");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const availabilityResult = await checkRoomIsAvailable({
        roomId: selectedRoom.id!,
        checkIn: bookingContext.checkIn!,
        checkOut: bookingContext.checkOut!,
      });

      if (!availabilityResult.isAvailable) {
        toast.error(
          availabilityResult.message ||
            "Sorry, the selected room is no longer available for these dates. Please select another room or different dates."
        );
        if (setSelectedRoom) setSelectedRoom(undefined);

        setIsProcessingPayment(false);
        return;
      }

      const bookingDataForCreation: Omit<
        Booking,
        "id" | "dateBooked" | "room" | "paymentProofUrl"
      > & { roomId: string; file?: File | null; paymentStatus?: string } = {
        name: bookingContext.name!,
        mobileNumber: bookingContext.mobileNumber!,
        email: bookingContext.email,
        checkIn: bookingContext.checkIn!,
        checkOut: bookingContext.checkOut!,
        numberOfAdults: bookingContext.numberOfAdults!,
        numberOfChildren: bookingContext.numberOfChildren!,
        bookingType: bookingContext.bookingType,

        roomId: selectedRoom.id!,
        totalPrice: finalTotal,
      };

      if (admin) {
        await createBooking(bookingDataForCreation);
      } else {
        if (!selectedFile) {
          toast.warn("Please upload your proof of payment to proceed.");
          setIsProcessingPayment(false);
          return;
        }

        const guestBookingPayload = {
          ...bookingDataForCreation,
          file: selectedFile,
        };

        if (paymentType === "full") {
          guestBookingPayload.paymentStatus = "Paid";
        } else if (paymentType === "partial") {
          guestBookingPayload.paymentStatus = "Partial";
        } else {
          toast.warn("Invalid payment type specified.");
          setIsProcessingPayment(false);
          return;
        }
        await createBooking(guestBookingPayload);
      }

      admin ? router.push("/admin/inbox") : router.push("/");
    } catch (error) {
      console.error("Error initiating booking process:", error);
      toast.error(
        "An unexpected error occurred while initiating your booking. Please try again."
      );

      setIsProcessingPayment(false);
    }
  };

  const isLoading =
    isProcessingPayment || isCheckingAvail || createBookingAPILoading;

  if (showRedirectMessage) {
    return (
      <div className="flex w-full h-full justify-center items-center min-h-[300px] text-center p-4">
        <div className="flex flex-col items-center">
          <Spinner
            size={30}
            color="currentColor"
            className="text-gray-700"
          />
          <p className="mt-4 text-lg font-semibold">
            {admin ? "Admin booking saved!" : "Booking successful!"}
          </p>
          <p className="text-sm text-gray-600">Redirecting you shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full">
      {isLoading ? (
        <div className="flex w-full h-full justify-center items-center min-h-[300px]">
          <Spinner
            size={30}
            color="currentColor"
            className="text-gray-700"
          />
          <p className="ml-3 text-gray-700">Processing your request...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Booking Summary
            </h1>
          </div>

          <div className="mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-1.5">
              Guest Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 text-xs sm:text-sm text-gray-700">
              <p>
                <span className="font-medium">Name: </span>
                {bookingContext.name}
              </p>
              <p>
                <span className="font-medium">Mobile: </span>
                {bookingContext.mobileNumber}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Email: </span>
                {bookingContext.email || "N/A"}
              </p>
            </div>
          </div>
          <Separator className="my-2 sm:my-3" />

          <div className="mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-1.5">
              Stay Details
            </h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs sm:text-sm text-gray-700">
              <p>
                <span className="font-medium">Check In: </span>
                <br className="sm:hidden" />
                {bookingContext.checkIn?.toLocaleDateString() ?? "N/A"}
              </p>
              <p>
                <span className="font-medium">Check Out: </span>
                <br className="sm:hidden" />
                {bookingContext.checkOut?.toLocaleDateString() ?? "N/A"}
              </p>
              <p>
                <span className="font-medium">Adults: </span>
                {bookingContext.numberOfAdults ?? "N/A"}
              </p>
              <p>
                <span className="font-medium">Children: </span>
                {bookingContext.numberOfChildren ?? "N/A"}
              </p>
              <p className="col-span-2">
                <span className="font-medium">Duration: </span>
                {daysDiff} {daysDiff === 1 ? "Night" : "Nights"}
              </p>
            </div>
          </div>
          <Separator className="my-2 sm:my-3" />

          <div className="flex-grow">
            {" "}
            {}
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              Billing Breakdown
            </h2>
            <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-700">
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-medium">
                    {selectedRoom?.roomType ?? "Room"} - #
                    {selectedRoom?.roomNumber ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({daysDiff} {daysDiff === 1 ? "Night" : "Nights"} @ ₱
                    {(selectedRoom?.roomRate ?? 0).toFixed(2)}/night)
                  </p>
                </div>
                <p className="font-semibold text-right flex-shrink-0">
                  ₱{totalRoomPrice.toFixed(2)}
                </p>
              </div>
              {excessGuestCount > 0 && (
                <div className="flex justify-between items-start">
                  <div className="pr-2">
                    <p className="font-medium">Additional Guest Charge</p>
                    <p className="text-xs text-gray-500">
                      ({excessGuestCount}{" "}
                      {excessGuestCount === 1 ? "Guest" : "Guests"} @
                      ₱100.00/guest)
                    </p>
                  </div>
                  <p className="font-semibold text-right flex-shrink-0">
                    ₱{excessGuestPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-200 text-right">
            {" "}
            {}
            <p className="text-sm sm:text-base font-bold text-gray-900">
              Total Amount Due:
              <span className="text-base sm:text-lg ml-1">
                {" "}
                {}₱{finalTotal.toFixed(2)}
              </span>
            </p>
            {!admin && (
              <p className="text-xs text-gray-500 mt-0.5">
                (Required 10% Down Payment: ₱{downPayment.toFixed(2)})
              </p>
            )}
          </div>

          <div className="flex justify-end w-full mt-4 sm:mt-5">
            <Button
              className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base"
              onClick={handleClickPay}
              disabled={
                isLoading ||
                !bookingContext ||
                (finalTotal <= 0 && daysDiff > 0) ||
                daysDiff <= 0
              }>
              {isLoading ? (
                <>
                  <Spinner
                    size={16}
                    color="currentColor"
                    className="mr-2"
                  />{" "}
                  Processing...
                </>
              ) : admin ? (
                "Save Booking Details"
              ) : (
                "Confirm & Proceed"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceCard;
