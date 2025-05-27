import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { getMedia } from "utils/supabase/storage";
import { getUnavailableRoomIdsForPeriod } from "utils/utils";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      checkIn: checkInStr,
      checkOut: checkOutStr,
      excludeBookingId,
    } = body;

    const unavailableRoomIds = await getUnavailableRoomIdsForPeriod(
      prisma,
      checkInStr,
      checkOutStr,
      excludeBookingId
    );

    const roomWhereClause: Prisma.RoomWhereInput = {};

    if (unavailableRoomIds.length > 0) {
      roomWhereClause.id = { notIn: unavailableRoomIds };
    }

    const rooms = await prisma.room.findMany({
      orderBy: [{ roomRate: "asc" }],
      where: roomWhereClause,
    });

    let errorInImageRetrieval = false;
    const roomsWithImages = await Promise.all(
      rooms.map(async (room) => {
        try {
          const { data, error: mediaError } = await getMedia("rooms", room.id);
          if (mediaError) {
            console.warn(
              `Error fetching image for room ${room.id}: ${
                mediaError.message || JSON.stringify(mediaError)
              }`
            );
            errorInImageRetrieval = true;
            return { ...room, images: [] };
          }
          return { ...room, images: data || [] };
        } catch {
          console.error("Unkown error has occured.");
          errorInImageRetrieval = true;
          return { ...room, images: [] };
        }
      })
    );

    if (errorInImageRetrieval) {
      console.warn(
        "One or more room images could not be fetched. Returning available rooms data."
      );
    }

    return NextResponse.json(roomsWithImages, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching available rooms:", error);

    if (
      error instanceof Error &&
      (error.message.includes("Invalid date format") ||
        error.message.includes("Check-out date must be after") ||
        error.message.includes("Check-in date cannot be in the past") ||
        error.message.includes("date strings are required"))
    ) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
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
