import { Booking } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const { status: newStatus }: Booking = await req.json();

    if (
      !newStatus ||
      typeof newStatus !== "string" ||
      newStatus.trim() === ""
    ) {
      return NextResponse.json(
        { message: "Status is required and cannot be empty." },
        { status: 400 }
      );
    }

    const bookingDetails = await prisma.booking.findUnique({ where: { id } });

    if (!bookingDetails) {
      return NextResponse.json(
        { message: "No booking found with this ID." },
        { status: 404 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(
      {
        message: "Booking status updated successfully",
        booking: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating booking status:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    const errorStack =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to update booking status",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
