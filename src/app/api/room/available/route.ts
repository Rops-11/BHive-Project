import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isAvailable: true },
    });

    if (!rooms || rooms.length === 0) {
      return NextResponse.json(
        { message: "No available rooms found." },
        { status: 200 }
      );
    }

    return NextResponse.json({ rooms }, { status: 200 });
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
