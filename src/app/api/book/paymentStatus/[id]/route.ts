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

    const { paymentStatus: newPaymentStatus }: Booking = await req.json();

    if (
      !newPaymentStatus ||
      typeof newPaymentStatus !== "string" ||
      newPaymentStatus.trim() === ""
    ) {
      return NextResponse.json(
        { message: "Payment Status is required and cannot be empty." },
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
      data: { paymentStatus: newPaymentStatus },
    });

    return NextResponse.json(
      {
        message: "Booking payment status updated successfully",
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
        error: "Failed to update booking payment status",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}
