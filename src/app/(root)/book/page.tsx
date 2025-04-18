"use client";

import BookingForm from "@/components/BookingForm";
import PreviewRoom from "@/components/PreviewRoom";
import { useRouter } from "next/navigation";
import React from "react";

const BookingPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:justify-evenly w-full h-screen justify-center items-center scrollbar-hide pt-20">
      <BookingForm router={router} />
      <PreviewRoom />
    </div>
  );
};

export default BookingPage;
