"use client";

import useGetSpecificRoom from "@/hooks/roomHooks/useGetSpecificRoom";
import React, { useContext, useEffect } from "react";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { BookingContextType } from "@/types/context";
import { checkDaysDifference } from "utils/utils";
import { BookingContext } from "../providers/BookProvider";
import Loading from "../ui/Loading";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import useCreateBooking from "@/hooks/bookingHooks/useCreateBooking";

const InvoiceCard = ({ notInPaymentPage }: { notInPaymentPage: boolean }) => {
  const router = useRouter();
  const { bookingContext, setBookingContext } =
    useContext<BookingContextType>(BookingContext);
  const { roomData, loading, getRoom } = useGetSpecificRoom();
  const { createBooking } = useCreateBooking(); // Temporary

  useEffect(() => {
    if (!bookingContext) {
      const timeout = setTimeout(() => {
        router.push("/book");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [bookingContext]);

  useEffect(() => {
    if (bookingContext?.roomId) {
      getRoom(bookingContext.roomId);
    }
  }, [bookingContext?.roomId]);

  if (!bookingContext) {
    useEffect(() => {
      const timer = setTimeout(() => {
        router.push("/book");
      }, 5000);
  
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Booking Summary
        </h1>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-red-600">
            Booking Details not provided.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to booking page...
          </p>
        </div>
      </div>
    );
  }
  

  if (loading || !bookingContext) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading loading={true} />
      </div>
    );
  }

  const daysDiff =
    bookingContext.checkIn && bookingContext.checkOut
      ? checkDaysDifference(bookingContext.checkIn, bookingContext.checkOut)
      : 0;

  let excessGuestCount = 0;
  if (
    bookingContext.numberOfAdults !== undefined &&
    bookingContext.numberOfChildren !== undefined &&
    roomData?.maxGuests !== undefined &&
    daysDiff > 0
  ) {
    const totalGuests =
      bookingContext.numberOfAdults + bookingContext.numberOfChildren;
    if (totalGuests > roomData.maxGuests) {
      excessGuestCount = totalGuests - roomData.maxGuests;
    }
  }

  const excessGuestPrice = excessGuestCount * 100;
  const totalRoomPrice = (roomData?.roomRate ?? 0) * daysDiff;
  const total = excessGuestPrice + totalRoomPrice;

  const handleClickPay = async () => {
    setBookingContext!({ ...bookingContext, totalPrice: total });
    await createBooking({ ...bookingContext, totalPrice: total }); // Temporary for Testing
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization:
          "Basic c2tfdGVzdF9qV25KV2NhM0U1ZjIycUVGam0yRnZ5WGc6cmVnaW5lTmJhcnRlMDEwNTA1",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: "PHP",
                amount: 1890000,
                description: "QUEEN BEE 2A",
                name: "QUEEN BEE 2A",
                quantity: 1,
              },
            ],
            payment_method_types: ["gcash"],
            description: "queen room",
          },
        },
      }),
    };

    const response = await fetch(
      "https://api.paymongo.com/v1/checkout_sessions",
      options
    );
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      const checkoutUrl = data.data.attributes.checkout_url;

      router.push(checkoutUrl);
    } else {
      console.error("Payment error:", data);
    }
  };

  return (
    <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full">
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
            <span className="font-medium">Name: </span> {bookingContext.name}
          </p>
          <p>
            <span className="font-medium">Mobile: </span>
            {bookingContext.mobileNumber}
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium">Email: </span> {bookingContext.email}
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
            {daysDiff}
            {daysDiff === 1 ? "Night" : "Nights"}
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
                {roomData?.roomType ?? "Room"} - #
                {roomData?.roomNumber ?? "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                ({daysDiff} {daysDiff === 1 ? "Night" : "Nights"} @ ₱
                {(roomData?.roomRate ?? 0).toFixed(2)}/night)
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
                  ({excessGuestCount}
                  {excessGuestCount === 1 ? "Guest" : "Guests"} @ ₱100.00/guest)
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
          <span className="text-base sm:text-lg"> ₱{total.toFixed(2)}</span>
        </p>
      </div>

      {notInPaymentPage && (
        <div className="flex justify-end w-full mt-3 sm:mt-4">
          <Button
            className="sm:size-auto"
            onClick={handleClickPay}
            disabled={!bookingContext || total <= 0}>
            Proceed to Payment
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;
