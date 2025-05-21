"use client";

import React from "react";

const BookingMissingFallback = () => {
  return (
    <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center min-h-[400px] text-center">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Booking Summary
      </h1>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-red-600">
          Booking Details not provided.
        </p>
        <p className="text-sm text-gray-500">Redirecting to booking page...</p>
      </div>
    </div>
  );
};

export default BookingMissingFallback;
