import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true, user: true, history: true },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed fetching bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      roomId,
      userId,
      checkIn,
      checkOut,
      mobileNumber,
      status,
      name,
      numberOfAdults,
      numberOfChildren,
      roomNumber,
      shift,
    } = await req.json();

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    if (!room.isAvailable)
      return NextResponse.json(
        { error: "Room not available" },
        { status: 400 }
      );

    const user = await prisma.user.findMany({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 400 });

    const newBooking = await prisma.booking.create({
      data: {
        roomId,
        userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        mobileNumber,
        status,
        name,
        numberOfAdults,
        numberOfChildren,
        roomNumber,
        shift,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
