"use client";

import BookingForm from "@/components/Booking/BookingFormContainer";
import PreviewRoom from "@/components/Booking/PreviewRoom";
import React from "react";

const AdminBookingPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen lg:h-screen">
      <div className="w-full h-20"></div>
      <div className="w-full h-full justify-center items-center md:justify-evenly flex lg:flex-row flex-col-reverse p-10 lg:space-y-0 space-y-5">
        <BookingForm type="Admin" />
        <PreviewRoom />
      </div>
    </div>
  );
};

export default AdminBookingPage;
