"use client";

import BookingForm from "@/components/Booking/BookingFormContainer";
import PreviewRoom from "@/components/Booking/PreviewRoom";
import React from "react";

const AdminBookingPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen lg:h-screen">
      <div className="flex flex-col-reverse lg:flex-row w-full h-full px-12 lg:px-0 mt-25 gap-y-4 lg:gap-x-2 justify-center items-center md:justify-evenly lg:items-stretch sm:pb-20 lg:pb-0 sm:pt-6 lg:pt-0 mb-10 lg:mb-10">
        <BookingForm type="Admin" />
        <PreviewRoom />
      </div>
    </div>
  );
};

export default AdminBookingPage;
