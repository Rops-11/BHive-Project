import { NextRequest, NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { prisma } from "utils/db";

interface CheckAvailabilityRequestPayload {
  roomId: string;
  checkIn: string;
  checkOut: string;
  excludeBookingId?: string;
}

interface CheckAvailabilityResponseData {
  isAvailable: boolean;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      excludeBookingId,
    } = body as CheckAvailabilityRequestPayload;

    const requiredFields = [roomId, checkInStr, checkOutStr];
    const fieldNamesForValidation = ["roomId", "checkIn", "checkOut"];

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

    const checkInDate = startOfDay(new Date(checkInStr));
    const checkOutDate = startOfDay(new Date(checkOutStr));

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format for check-in or check-out." },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { message: "Check-out date must be after check-in date." },
        { status: 400 }
      );
    }

    const today = startOfDay(new Date());
    if (checkInDate < today) {
      return NextResponse.json(
        { message: "Check-in date cannot be in the past." },
        { status: 400 }
      );
    }

    const conflictingBookingsCount = await prisma.booking.count({
      where: {
        roomId: roomId,
        ...(excludeBookingId && { NOT: { id: excludeBookingId } }),
        status: {
          notIn: ["Cancelled", "Complete"],
        },

        checkIn: {
          lt: checkOutDate,
        },
        checkOut: {
          gt: checkInDate,
        },
      },
    });

    if (conflictingBookingsCount > 0) {
      return NextResponse.json(
        {
          isAvailable: false,
          message: "Room is not available for the selected dates.",
        } as CheckAvailabilityResponseData,
        { status: 200 }
      );
    }

    return NextResponse.json(
      { isAvailable: true } as CheckAvailabilityResponseData,
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error checking room availability:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to check room availability",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
