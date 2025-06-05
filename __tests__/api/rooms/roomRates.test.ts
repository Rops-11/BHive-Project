import { PUT } from "@/app/api/room/room-rate/route";
import { prisma } from "utils/db";
import { NextRequest } from "next/server";

function createNextRequest(method: string, body: any): NextRequest {
  return {
    method,
    json: async () => body,
    headers: new Headers({ "Content-Type": "application/json" }),
  } as unknown as NextRequest;
}

describe("PUT /api/room/room-rate", () => {
  const testRoomType = "Deluxe";
  const initialRate = 1000;
  const updatedRate = 1500;

  beforeAll(async () => {
    await prisma.booking.deleteMany({});
    await prisma.room.deleteMany({ where: { roomType: testRoomType } });

    await prisma.room.createMany({
      data: Array.from({ length: 3 }, (_, i) => ({
        roomType: testRoomType,
        roomNumber: `D-${i + 1}`,
        roomRate: initialRate,
        maxGuests: 2,
        amenities: [],
      })),
    });
  });

  afterAll(async () => {
    await prisma.room.deleteMany({ where: { roomType: testRoomType } });
    await prisma.$disconnect();
  });

  it("updates the room rate for a valid roomType", async () => {
    const req = createNextRequest("PUT", {
      roomType: testRoomType,
      roomRate: updatedRate,
    });

    const res = await PUT(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.updatedCount).toBe(3);
  });
});
