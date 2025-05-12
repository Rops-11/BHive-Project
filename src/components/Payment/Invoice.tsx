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

const InvoiceCard = ({
  notInPaymentPage,
}: {
  notInPaymentPage: boolean;
}) => {
  const router = useRouter()
  const { bookingContext, setBookingContext } =
    useContext<BookingContextType>(BookingContext);
  const { roomData, loading, getRoom } = useGetSpecificRoom();

  useEffect(() => {
    if (bookingContext && bookingContext.roomId) {
      getRoom(bookingContext.roomId);
    }
    console.log("Booking Context:", bookingContext);
  }, [bookingContext]);

  // Loading of the component
  if (loading || !bookingContext) return <Loading loading={loading} />;

  // Gets the difference of the Dates by days
  const daysDiff = checkDaysDifference(
    bookingContext!.checkIn!,
    bookingContext!.checkOut!
  );

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

  const handleClickPay = async() => {
    setBookingContext!({ ...bookingContext, totalPrice: total });
    // router.push("/book/payment"); 
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic c2tfdGVzdF9qV25KV2NhM0U1ZjIycUVGam0yRnZ5WGc6cmVnaW5lTmJhcnRlMDEwNTA1'
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: 'PHP',
                amount: 1890000,
                description: 'QUEEN BEE 2A',
                name: 'QUEEN BEE 2A',
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'brankas_bdo'],
            description: 'queen room'
          }
        }
      })
    };
    
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options) 
    const data = await response.json();
    console.log(data);
    
    
    if (response.ok) {
      const sessionId = data.data.id;
      const checkoutUrl = data.data.attributes.checkout_url;

      router.push(checkoutUrl);


    } else {

      console.error("Payment error:", data);
    }

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
      {notInPaymentPage && (
        <div className="flex justify-end w-full">
          <Button onClick={handleClickPay}>Pay</Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;
