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

const InvoiceCard = ({ admin }: { admin: boolean }) => {
  const router = useRouter();
  const { bookingContext, setBookingContext, selectedRoom, setSelectedRoom } =
    useContext<BookingContextType>(BookingContext);

  const {
    createBooking,
    loading: createBookingAPILoading,
    bookingDetails: createdBookingDetails,
  } = useCreateBooking();
  const { checkRoomIsAvailable, isLoading: isCheckingAvail } =
    useCheckRoomAvailability();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (!bookingContext) {
      const timeout = setTimeout(() => {
        if (!bookingContext) {
          router.push(admin ? "/admin/book" : "/book");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [bookingContext, router, admin]);

  useEffect(() => {
    if (createdBookingDetails && createdBookingDetails.id) {
    }
  }, [
    createdBookingDetails,
    router,
    admin,
    setBookingContext,
    setSelectedRoom,
  ]);

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
    if (finalTotal <= 0) {
      toast.warn("Total amount is invalid. Please review your booking.");
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
            "Sorry, the selected room is no longer available. Please select another room."
        );
        setSelectedRoom(undefined);
        router.push(admin ? "/admin/book" : "/book");
        setIsProcessingPayment(false);
        return;
      }

      const bookingDataForCreation: Booking = {
        ...bookingContext,
        roomId: selectedRoom.id,
        totalPrice: finalTotal,
      };

      await createBooking(bookingDataForCreation);

      if (admin) {
        if (!createBookingAPILoading && createdBookingDetails?.id) {
          toast.info("Admin booking saved. Redirecting...");
          setSelectedRoom(undefined);
          router.push("/admin/book");
        }
        setIsProcessingPayment(false);
        return;
      }

      // process the payment thru gcash here, needs image
      router.push("/");
    } catch (error) {
      console.error("Error processing payment/booking:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isLoading =
    isProcessingPayment || isCheckingAvail || createBookingAPILoading;

  if (createdBookingDetails) return <div>Redirecting back to home page.</div>;

  return (
    <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full">
      {isLoading ? (
        <div className="flex w-full h-full justify-center items-center min-h-[300px]">
          <Spinner
            size={25}
            color="#000000"
            animating={true}
          />
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
            <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1.5 sm:mb-2">
              Billing Breakdown
            </h2>
            <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-700">
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p>
                    {selectedRoom?.roomType ?? "Room"} - #
                    {selectedRoom?.roomNumber ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    ({daysDiff} {daysDiff === 1 ? "Night" : "Nights"} @ ₱
                    {(selectedRoom?.roomRate ?? 0).toFixed(2)}/night)
                  </p>
                </div>
                <p className="font-medium text-right flex-shrink-0">
                  ₱{totalRoomPrice.toFixed(2)}
                </p>
              </div>
              {excessGuestCount > 0 && (
                <div className="flex justify-between items-start">
                  <div className="pr-2">
                    <p>Additional Guest Charge</p>
                    <p className="text-xs text-gray-500">
                      ({excessGuestCount}{" "}
                      {excessGuestCount === 1 ? "Guest" : "Guests"} @
                      ₱100.00/guest)
                    </p>
                  </div>
                  <p className="font-medium text-right flex-shrink-0">
                    ₱{excessGuestPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 sm:pt-3 border-t border-gray-200 text-right">
            <p className="text-sm sm:text-base font-bold text-gray-900">
              Total Due:
              <span className="text-base sm:text-lg">
                {" "}
                ₱{finalTotal.toFixed(2)}
              </span>
            </p>
          </div>

          <div className="flex justify-end w-full mt-3 sm:mt-4">
            <Button
              className="sm:size-auto"
              onClick={handleClickPay}
              disabled={isLoading || !bookingContext || finalTotal <= 0}>
              {isLoading
                ? "Processing..."
                : admin
                ? "Save Booking Details"
                : "Proceed to Payment"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceCard;
