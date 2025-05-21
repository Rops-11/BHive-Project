import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { deleteFile, getMedia, uploadImage } from "utils/supabase/storage";
import { createClient } from "utils/supabase/server";

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
  const supabase = await createClient();
  try {
    const { id } = await params;

    const formData = await req.formData();

    const roomType = formData.get("roomType") as string;
    const roomNumber = formData.get("roomNumber") as string;
    const isAvailable = formData.get("isAvailable") === "true";
    const maxGuests = parseInt(formData.get("maxGuests") as string);
    const roomRate = parseFloat(formData.get("roomRate") as string);
    const files = formData.getAll("files") as File[];

    const { data: OldImages, error: OldImagesError } = await getMedia(
      "rooms",
      id
    );

    if (OldImagesError) {
      return NextResponse.json(
        { message: "Error in fetching the images" },
        { status: 400 }
      );
    }

    let hasUploadErrors;
    const uploadedFilePathsInBucket: string[] = [];

    if (files.length > 0)
      files?.map(async (image: File) => {
        const { data, error } = await uploadImage("rooms", id, image);

        if (error) {
          console.error(
            `Error uploading file ${image.name} to Supabase:`,
            error
          );
          hasUploadErrors = true;
        }

        if (data?.path) {
          uploadedFilePathsInBucket.push(data.path);
        }
      });

    if (hasUploadErrors) {
      if (uploadedFilePathsInBucket.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from("rooms")
          .remove(uploadedFilePathsInBucket);
        if (deleteError) {
          console.error(
            "Failed to delete orphaned files from Supabase Storage on rollback:",
            deleteError
          );
        }
      }
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: { roomType, roomNumber, isAvailable, maxGuests, roomRate },
    });

    if (files.length > 0)
      OldImages?.map(async (image) => {
        const { error } = await deleteFile("rooms", id, image.name);

        if (error) {
          console.error(error);
          return NextResponse.json(
            { error: "Error in deleting images" },
            { status: 400 }
          );
        }
      });

    const { data, error } = await getMedia("from", id);

    if (error) {
      return NextResponse.json(
        { error: "Error in fetching the images" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ...updatedRoom, images: data }, { status: 200 });
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

    const { data, error } = await getMedia("rooms", id);

    if (error) {
      return NextResponse.json(
        { error: "Error in fetching the images" },
        { status: 400 }
      );
    }

    data?.map(async (image) => {
      const { error } = await deleteFile("rooms", id, image.name);

      if (error) {
        console.error(error);
        return NextResponse.json(
          { error: "Error in deleting images" },
          { status: 400 }
        );
      }
    });

    return NextResponse.json(
      { message: "Room successfully deleted" },
      { status: 200 }
    );
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
