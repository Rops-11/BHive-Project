import { BookingType, Prisma, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true,
      },
      orderBy: {
        checkIn: "asc",
      },
    });

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      mobileNumber,
      name,
      email,
      bookingType,
      numberOfAdults,
      numberOfChildren,
      totalPrice,
    } = body;

    const requiredFields = [
      roomId,
      checkInStr,
      checkOutStr,
      mobileNumber,
      name,

      numberOfAdults,
      numberOfChildren,
      totalPrice,
    ];
    const fieldNamesForValidation = [
      "roomId",
      "checkIn",
      "checkOut",
      "mobileNumber",
      "name",
      "numberOfAdults",
      "numberOfChildren",
      "totalPrice",
    ];

    const missingFields = requiredFields.reduce((acc, field, index) => {
      if (
        field === undefined ||
        field === null ||
        (typeof field === "string" && field.trim() === "")
      ) {
        acc.push(fieldNamesForValidation[index]);
      }
      return acc;
    }, [] as string[]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Details provided incomplete. Missing required fields.",
          missing: missingFields,
        },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format for check-in or check-out." },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { message: "Check-out date must be after check-in date." },
        { status: 400 }
      );
    }

    if (typeof numberOfAdults !== "number" || numberOfAdults < 1) {
      return NextResponse.json(
        { message: "Number of adults must be a positive integer." },
        { status: 400 }
      );
    }
    if (typeof numberOfChildren !== "number" || numberOfChildren < 0) {
      return NextResponse.json(
        { message: "Number of children cannot be negative." },
        { status: 400 }
      );
    }
    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return NextResponse.json(
        { message: "Total price must be a positive number." },
        { status: 400 }
      );
    }

    if (
      bookingType &&
      !Object.values(BookingType).includes(bookingType as BookingType)
    ) {
      return NextResponse.json(
        {
          message: `Invalid bookingType. Must be one of: ${Object.values(
            BookingType
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const newBooking = await prisma.$transaction(async (tx) => {
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomId: roomId,
          status: {
            notIn: [Status.Cancelled, Status.Complete],
          },
          AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
        },
      });

      if (conflictingBooking) {
        return NextResponse.json(
          { message: "Room is already booked" },
          { status: 406 }
        );
      }

      const bookingDataToCreate: Prisma.BookingCreateInput = {
        room: { connect: { id: roomId } },
        checkIn,
        checkOut,
        mobileNumber,
        name,
        numberOfAdults,
        numberOfChildren,
        totalPrice,

        ...(email && { email }),

        ...(bookingType && { bookingType: bookingType as BookingType }),
      };

      return tx.booking.create({
        data: bookingDataToCreate,
      });
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
