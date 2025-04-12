import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { room: true, user: true, history: true },
    });

    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Booking deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
