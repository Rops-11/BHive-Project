import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { updateFile } from "utils/supabase/storage";

const prisma = new PrismaClient();

// This is the correct format for Next.js 14 route handlers
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    return NextResponse.json(room, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching room:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch room",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const {
      roomType,
      roomNumber,
      isAvailable,
      maxGuests,
      roomRate,
      file,
      fileId,
    } = await req.json();

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: { roomType, roomNumber, isAvailable, maxGuests, roomRate },
    });

    const { data, error } = await updateFile("rooms", id, fileId, file);

    if (error) {
      return NextResponse.json(
        { error: "Image failed to update", message: error },
        { status: 400 }
      );
    }

    return NextResponse.json({ ...updatedRoom, data }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error to edit room:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to edit room",
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

    await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Room deleted" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error deleting room:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to delete room",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
