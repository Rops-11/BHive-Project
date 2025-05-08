import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMedia, uploadImage } from "utils/supabase/storage";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let errorInImage = false;
    const rooms = await prisma.room.findMany();

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
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const roomType = formData.get("roomType") as string;
    const roomNumber = formData.get("roomNumber") as string;
    const isAvailable = formData.get("isAvailable") === "true";
    const maxGuests = parseInt(formData.get("maxGuests") as string);
    const roomRate = parseFloat(formData.get("roomRate") as string);

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const newRoom = await prisma.room.create({
      data: { roomType, roomNumber, isAvailable, maxGuests, roomRate },
    });

    const { data, error } = await uploadImage("rooms", newRoom.id, file);

    if (error) {
      console.error(error);

      await prisma.room.delete({ where: { id: newRoom.id } });

      return NextResponse.json(
        { error: "Image not uploaded", message: error },
        { status: 403 }
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
