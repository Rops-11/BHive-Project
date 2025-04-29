import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { uploadImage } from "utils/supabase/storage";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms, { status: 200 });
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

export async function POST(req: NextRequest) {
  try {
    const { roomType, roomNumber, isAvailable, maxGuests, roomRate, file } =
      await req.json();

    const newRoom = await prisma.room.create({
      data: { roomType, roomNumber, isAvailable, maxGuests, roomRate },
    });

    const { data, error } = await uploadImage("rooms", newRoom.id, file);

    if (error) {
      return NextResponse.json(
        { error: "Image not uploaded", message: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ ...newRoom, data }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating room:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to create room",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
