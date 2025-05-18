import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });

    if (!deletedBooking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Booking deleted" }, { status: 200 });
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
