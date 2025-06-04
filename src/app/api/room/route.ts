import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMedia, uploadImage } from "utils/supabase/storage";
import { createClient } from "utils/supabase/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let errorInImage = false;
    const rooms = await prisma.room.findMany({
      orderBy: {
        roomRate: "asc",
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
        { message: "Error in fetching images" },
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
  const supabase = await createClient(); // For potential cleanup
  let tempRoomIdForCleanup: string | null = null; // For cleanup on failure

  try {
    const formData = await req.formData();

    const roomType = formData.get("roomType") as string;
    const roomNumber = formData.get("roomNumber") as string;
    const maxGuests = parseInt(formData.get("maxGuests") as string);
    const roomRate = parseFloat(formData.get("roomRate") as string);
    const amenities = formData.getAll("amenities") as string[];
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ message: "No files provided" }, { status: 400 });
    }
    if (!roomType || !roomNumber || isNaN(maxGuests) || isNaN(roomRate)) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const newRoom = await prisma.room.create({
      data: { roomType, roomNumber, maxGuests, amenities, roomRate },
    });
    tempRoomIdForCleanup = newRoom.id;

    let hasUploadErrors;
    const uploadedFilePathsInBucket: string[] = [];
    const bucketName = "rooms";

    for (const file of files) {
      const { data: uploadData, error: imageUploadError } = await uploadImage(
        bucketName,
        tempRoomIdForCleanup,
        file
      );

      if (imageUploadError) {
        console.error(
          `Error uploading file ${file.name} to Supabase:`,
          imageUploadError
        );
        hasUploadErrors = true;
        break;
      }
      if (uploadData?.path) {
        uploadedFilePathsInBucket.push(uploadData.path);
      }
    }

    if (hasUploadErrors) {
      await prisma.room.delete({ where: { id: newRoom.id } });
      tempRoomIdForCleanup = null;

      if (uploadedFilePathsInBucket.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove(uploadedFilePathsInBucket);
        if (deleteError) {
          console.error(
            "Failed to delete orphaned files from Supabase Storage on rollback:",
            deleteError
          );
        }
      }

      return NextResponse.json(
        {
          error:
            "Failed to upload one or more images. Room creation rolled back.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating room:", error);

    if (tempRoomIdForCleanup) {
      try {
        await prisma.room.delete({ where: { id: tempRoomIdForCleanup } });
        console.log(
          `Cleaned up Prisma record for room ID: ${tempRoomIdForCleanup}`
        );

        const bucketName = "rooms";
        const { data: listData, error: listError } = await supabase.storage
          .from(bucketName)
          .list(tempRoomIdForCleanup + "/");
        if (listError) {
          console.error(
            `Error listing files for cleanup in Supabase for ${tempRoomIdForCleanup}:`,
            listError
          );
        } else if (listData && listData.length > 0) {
          const pathsToDelete = listData.map(
            (f) => `${tempRoomIdForCleanup}/${f.name}`
          );
          const { error: deleteFilesError } = await supabase.storage
            .from(bucketName)
            .remove(pathsToDelete);
          if (deleteFilesError) {
            console.error(
              `Error deleting files from Supabase for ${tempRoomIdForCleanup}:`,
              deleteFilesError
            );
          } else {
            console.log(
              `Cleaned up Supabase storage for room ID: ${tempRoomIdForCleanup}`
            );
          }
        }
      } catch (cleanupError) {
        console.error("Critical error during cleanup:", cleanupError);
      }
    }

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
