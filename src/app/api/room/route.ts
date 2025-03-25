import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const data = await prisma.room.findMany();

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { roomType } = await request.json();

  return NextResponse.json({ roomType });
}
