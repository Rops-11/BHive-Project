import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { roomType, roomNumber, isAvailable, maxGuests, roomRate } =
      await req.json();

    const newRoom = await prisma.room.create({
      data: { roomType, roomNumber, isAvailable, maxGuests, roomRate },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
