import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getMedia } from "utils/supabase/storage";
import { findOverlappingBookings } from "utils/utils";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    let errorInImage;

    const { checkIn, checkOut } = await req.json();

    const bookings = await prisma.booking.findMany();

    const overlappingBookings = findOverlappingBookings(
      { checkIn, checkOut },
      bookings
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
          errorInImage = true;
        }

        return { ...room, images: data };
      })
    );

    if (errorInImage) {
      return NextResponse.json(
        { error: "Error in fetching images" },
        { status: 400 }
      );
    }

    return NextResponse.json(roomsWithImages, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching rooms:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch rooms",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
