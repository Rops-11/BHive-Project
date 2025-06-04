import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";
import { checkDaysDifference } from "utils/utils";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { mobileNumber, name, email, numberOfAdults, numberOfChildren } =
      body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Name is required and cannot be empty." },
        { status: 400 }
      );
    }
    if (
      !mobileNumber ||
      typeof mobileNumber !== "string" ||
      !/^\d{11}$/.test(mobileNumber)
    ) {
      return NextResponse.json(
        { message: "A valid 11-digit mobile number is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { message: "A valid email address is required." },
        { status: 400 }
      );
    }
    if (
      typeof numberOfAdults !== "number" ||
      isNaN(numberOfAdults) ||
      numberOfAdults < 1
    ) {
      return NextResponse.json(
        { message: "Number of adults must be a number and at least 1." },
        { status: 400 }
      );
    }
    if (
      typeof numberOfChildren !== "number" ||
      isNaN(numberOfChildren) ||
      numberOfChildren < 0
    ) {
      return NextResponse.json(
        {
          message:
            "Number of children must be a number and cannot be negative.",
        },
        { status: 400 }
      );
    }

    const bookingDetails = await prisma.booking.findUnique({ where: { id } });

    if (!bookingDetails) {
      return NextResponse.json(
        { message: "No booking found with this ID." },
        { status: 404 }
      );
    }

    if (!bookingDetails.roomId) {
      return NextResponse.json(
        { message: "Booking is not associated with a room." },
        { status: 400 }
      );
    }

    const roomDetails = await prisma.room.findUnique({
      where: { id: bookingDetails.roomId },
    });

    if (!roomDetails) {
      return NextResponse.json(
        { message: "The room associated with this booking was not found." },
        { status: 404 }
      );
    }

    const daysDiff =
      bookingDetails.checkIn && bookingDetails.checkOut
        ? checkDaysDifference(bookingDetails.checkIn, bookingDetails.checkOut)
        : 0;

    if (daysDiff <= 0 && bookingDetails.checkIn && bookingDetails.checkOut) {
      console.warn(
        `Booking ID ${id} has invalid date range or zero day difference.`
      );
    }

    let excessGuestCount = 0;
    if (roomDetails.maxGuests !== null && roomDetails.maxGuests !== undefined) {
      const totalGuests = numberOfAdults + numberOfChildren;
      if (totalGuests > roomDetails.maxGuests) {
        excessGuestCount = totalGuests - roomDetails.maxGuests;
      }
    }

    const excessGuestFeePerGuest = 100;
    const excessGuestPrice = excessGuestCount * excessGuestFeePerGuest;
    const totalRoomPrice =
      (roomDetails.roomRate ?? 0) * (daysDiff > 0 ? daysDiff : 0);
    const totalPrice = excessGuestPrice + totalRoomPrice;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        mobileNumber,
        name,
        email,
        numberOfAdults,
        numberOfChildren,
        totalPrice,
      },
    });

    return NextResponse.json(
      {
        message: "Booking details updated successfully",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating booking:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    const errorStack =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to update booking",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });

    if (!deletedBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Booking deleted" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting booking:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to delete booking",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
