"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BookingForm from "./BookingForm";

const BookingFormContainer = ({ type }: { type?: "Admin" | "Guest" }) => {
  return (
    <Card className="flex lg:w-7/16 w-full h-full p-6">
      <CardHeader className="flex w-full justify-center items-center">
        <CardTitle className="text-2xl font-bold">Book Your Hotel</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full">
        <BookingForm type={type} />
      </CardContent>
    </Card>
  );
};

export default BookingFormContainer;
