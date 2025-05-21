import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getMedia } from "utils/supabase/storage";
import { findOverlappingBookings } from "utils/utils";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    let errorInImage;

    const { checkIn, checkOut, excludeBookingId } = await req.json();

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { message: "checkIn and checkOut dates are required." },
        { status: 400 }
      );
    }

    const targetCheckInDate = new Date(checkIn);
    const targetCheckOutDate = new Date(checkOut);

    if (
      isNaN(targetCheckInDate.getTime()) ||
      isNaN(targetCheckOutDate.getTime())
    ) {
      return NextResponse.json(
        { message: "Invalid date format for checkIn or checkOut." },
        { status: 400 }
      );
    }

    let allBookings = await prisma.booking.findMany();

    if (excludeBookingId && typeof excludeBookingId === "string") {
      allBookings = allBookings.filter(
        (booking) => booking.id !== excludeBookingId
      );
    }

    const overlappingBookings = findOverlappingBookings(
      { checkIn: targetCheckInDate, checkOut: targetCheckOutDate },
      allBookings
    );

    const listOfRoomIdsNotAvailable = overlappingBookings.map(
      (booking) => booking.roomId
    );

    const rooms = await prisma.room.findMany({
      orderBy: [{ roomRate: "asc" }],
      where: {
        NOT: {
          id: {
            in: listOfRoomIdsNotAvailable,
          },
        },
      },
    });

    const roomsWithImages = await Promise.all(
      rooms.map(async (room) => {
        const { data, error } = await getMedia("rooms", room.id);

        if (error) {
          console.warn(`Error fetching image for room ${room.id}:`, error);
          errorInImage = true;
        }

        return { ...room, images: data || [] };
      })
    );

    if (errorInImage) {
      return NextResponse.json(
        {
          message:
            "Error occurred while fetching some room images. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(roomsWithImages, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching available rooms:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch available rooms",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
