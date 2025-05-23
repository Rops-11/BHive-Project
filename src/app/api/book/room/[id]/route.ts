import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";
import { checkDaysDifference } from "utils/utils";

async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const overlappingBookings = await prisma.booking.count({
    where: {
      roomId: roomId,
      NOT: {
        id: excludeBookingId,
      },

      AND: [
        {
          checkIn: {
            lt: checkOut,
          },
        },
        {
          checkOut: {
            gt: checkIn,
          },
        },
      ],
    },
  });
  return overlappingBookings === 0;
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingIdToUpdate } = await context.params;

    if (!bookingIdToUpdate) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      roomId: newRoomId,
      checkIn: newCheckInString,
      checkOut: newCheckOutString,
    } = body;

    if (!newRoomId || typeof newRoomId !== "string") {
      return NextResponse.json(
        { message: "A valid Room ID is required." },
        { status: 400 }
      );
    }
    if (!newCheckInString || !newCheckOutString) {
      return NextResponse.json(
        { message: "Check-in and Check-out dates are required." },
        { status: 400 }
      );
    }

    const newCheckIn = new Date(newCheckInString);
    const newCheckOut = new Date(newCheckOutString);

    if (isNaN(newCheckIn.getTime()) || isNaN(newCheckOut.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format for Check-in or Check-out." },
        { status: 400 }
      );
    }

    if (newCheckIn >= newCheckOut) {
      return NextResponse.json(
        { message: "Check-out date must be after Check-in date." },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newCheckIn < today) {
      return NextResponse.json(
        { message: "Check-in date cannot be in the past." },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingIdToUpdate },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "No booking found with this ID." },
        { status: 404 }
      );
    }

    const newRoomDetails = await prisma.room.findUnique({
      where: { id: newRoomId },
    });

    if (!newRoomDetails) {
      return NextResponse.json(
        { message: "The selected new room was not found." },
        { status: 404 }
      );
    }

    const available = await isRoomAvailable(
      newRoomId,
      newCheckIn,
      newCheckOut,
      bookingIdToUpdate
    );

    if (!available) {
      return NextResponse.json(
        { message: "The selected room is not available for the chosen dates." },
        { status: 409 }
      );
    }

    const daysDiff = checkDaysDifference(newCheckIn, newCheckOut);

    if (daysDiff <= 0) {
      return NextResponse.json(
        {
          message:
            "Invalid date range resulting in zero or negative stay duration.",
        },
        { status: 400 }
      );
    }

    const numberOfAdults = existingBooking.numberOfAdults;
    const numberOfChildren = existingBooking.numberOfChildren;

    let excessGuestCount = 0;
    if (
      newRoomDetails.maxGuests !== null &&
      newRoomDetails.maxGuests !== undefined &&
      typeof numberOfAdults === "number" &&
      typeof numberOfChildren === "number"
    ) {
      const totalGuests = numberOfAdults + numberOfChildren;
      if (totalGuests > newRoomDetails.maxGuests) {
        excessGuestCount = totalGuests - newRoomDetails.maxGuests;
      }
    } else if (
      typeof numberOfAdults !== "number" ||
      typeof numberOfChildren !== "number"
    ) {
      console.warn(
        `Booking ID ${bookingIdToUpdate} has missing or invalid guest count for price recalculation.`
      );
    }

    const excessGuestFeePerGuest = 100;
    const excessGuestPrice = excessGuestCount * excessGuestFeePerGuest;
    const totalRoomPrice = (newRoomDetails.roomRate ?? 0) * daysDiff;
    const newTotalPrice = excessGuestPrice + totalRoomPrice;

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingIdToUpdate },
      data: {
        roomId: newRoomId,
        checkIn: newCheckIn,
        checkOut: newCheckOut,
        totalPrice: newTotalPrice,
      },
    });

    return NextResponse.json(
      {
        message: "Booking room and dates updated successfully.",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating booking (room/dates):", error);

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
