import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomType, roomRate } = body;

    if (!roomType || typeof roomType !== "string" || roomType.trim() === "") {
      return NextResponse.json(
        { message: "Room Type is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (roomRate === undefined || roomRate === null) {
      return NextResponse.json(
        { message: "Room Rate is required." },
        { status: 400 }
      );
    }
    if (typeof roomRate !== "number" || isNaN(roomRate) || roomRate < 0) {
      return NextResponse.json(
        { message: "Room Rate must be a valid non-negative number." },
        { status: 400 }
      );
    }

    const roomsWithSpecificRoomType = await prisma.room.findMany({
      where: { roomType },
      select: { id: true },
    });

    if (roomsWithSpecificRoomType.length === 0) {
      return NextResponse.json(
        {
          message: `No rooms found with room type: ${roomType}. No rates updated.`,
        },
        { status: 404 }
      );
    }

    const updateResult = await prisma.room.updateMany({
      where: {
        roomType: roomType,
      },
      data: {
        roomRate: roomRate,
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        {
          message: `No rooms were updated for room type: ${roomType}. This might indicate the rooms were modified or deleted concurrently.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Successfully updated the rate for ${updateResult.count} room(s) of type '${roomType}' to ${roomRate}.`,
        updatedCount: updateResult.count,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating room rates by type:", error);

    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to update room rates",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
