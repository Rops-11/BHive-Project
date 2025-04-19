import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";
import { boolean } from "zod";

// This is to get all bookings:
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();

    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        { message: "There are no bookings." },
        { status: 200 }
      );
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: unknown) {
    console.error("Error to fetch bookings:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch bookings",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

// This is to create a booking:
export async function POST(req: NextRequest) {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      mobileNumber,
      name,
      numberOfAdults,
      numberOfChildren,
    } = await req.json();

    if (
      ![
        roomId,
        checkIn,
        checkOut,
        mobileNumber,
        name,
        numberOfAdults,
        numberOfChildren,
      ].every(boolean)
    ) {
      return NextResponse.json(
        { message: "Details provided incomplete." },
        { status: 400 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        roomId,
        checkIn,
        checkOut,
        mobileNumber,
        name,
        numberOfAdults,
        numberOfChildren,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: unknown) {
    console.error("Error booking:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to book",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
