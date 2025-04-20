"use client";

import useGetSpecificRoom from "@/hooks/roomHooks/useGetSpecificRoom";
import React, { useContext } from "react";
import Loading from "./Loading";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "./ui/button";
import { BookingContextType } from "@/types/context";
import { BookingContext } from "@/app/(root)/book/layout";
import { checkDaysDifference } from "utils/utils";

const InvoiceCard = ({ router }: { router: AppRouterInstance }) => {
  const { bookingContext, setBookingContext } =
    useContext<BookingContextType>(BookingContext);
  const { roomData, loading } = useGetSpecificRoom(bookingContext!.roomId!);

  // Gets the difference of the Dates by days
  const daysDiff = checkDaysDifference(
    bookingContext!.checkIn!,
    bookingContext!.checkOut!
  );

  // Loading of the component
  if (loading) return <Loading loading={loading} />;

  // These are after the loading to make sure that the roomdata is not undefined
  let excessGuestCount = 0;
  if (
    bookingContext &&
    bookingContext.numberOfAdults !== undefined &&
    bookingContext.numberOfChildren !== undefined &&
    roomData?.maxGuests !== undefined &&
    bookingContext.numberOfAdults + bookingContext.numberOfChildren >
      roomData.maxGuests
  ) {
    excessGuestCount =
      bookingContext.numberOfAdults +
      bookingContext.numberOfChildren -
      roomData.maxGuests;
  }

  const excessGuestPrice = excessGuestCount * 100;
  const totalRoomPrice = roomData!.roomRate! * daysDiff!;
  const total = excessGuestPrice + totalRoomPrice;

  const handleClickPay = () => {
    setBookingContext!({ ...bookingContext, totalPrice: total });
    router.push("/"); // should be the payment page
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Check In:</span>{" "}
          {bookingContext!.checkIn!.toDateString()}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Check Out:</span>{" "}
          {bookingContext!.checkOut!.toDateString()}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold text-gray-800">Bill To:</h2>
        <p className="text-sm">{bookingContext!.name}</p>
        <p className="text-sm">{bookingContext!.mobileNumber}</p>
      </div>

      <div className="mb-6">
        <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {roomData?.roomType} for {daysDiff} day/s
              </td>
              <td className="text-right">₱{totalRoomPrice.toFixed(2)}</td>
            </tr>
            {excessGuestCount > 0 && (
              <tr>
                <td>Excess of {excessGuestCount} Guest/s</td>
                <td className="text-right">₱{excessGuestPrice.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-right text-sm mb-4">
        <p className="font-bold text-gray-900">Total: ₱{total.toFixed(2)}</p>
      </div>
      <div className="flex justify-end w-full">
        <Button onClick={handleClickPay}>Pay</Button>
      </div>
    </div>
  );
};

export default InvoiceCard;
