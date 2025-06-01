import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { POST } from "@/app/api/utils/getRoomsAvailableThisDate/route";
import { v4 as uuidv4 } from "uuid";


describe("GET Available Rooms", () => {
  const deluxeRoomId = uuidv4();
  const standardRoomId = uuidv4();

  beforeAll(async () => {
    // Seed test rooms
    await prisma.room.createMany({
      data: [
        {
          id: deluxeRoomId,
          roomType: "Deluxe",
          roomNumber: "101",
          isAvailable: true,
          maxGuests: 2,
          roomRate: 200,
          amenities: [],
        },
        {
          id: standardRoomId,
          roomType: "Standard",
          roomNumber: "102",
          isAvailable: true,
          maxGuests: 2,
          roomRate: 100,
          amenities: [],
        },
      ],
    });

    // Create a booking that overlaps with the test check-in/out
    await prisma.booking.create({
      data: {
        id: uuidv4(),
        roomId: deluxeRoomId,
        checkIn: new Date("2025-06-01"),
        checkOut: new Date("2025-06-05"),
        mobileNumber: "09123456789",
        email: "test@example.com",
        name: "Test Guest",
        numberOfAdults: 2,
        numberOfChildren: 0,
        totalPrice: 500,
        status: "Pending",
        paymentStatus: "Paid",
        bookingType: "Online",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.$disconnect();
  });

  it("should return only available rooms for the given date range", async () => {
    const requestPayload = JSON.stringify({
      checkIn: "2025-06-02",
      checkOut: "2025-06-04",
    });

    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: requestPayload,
      headers: { "Content-Type": "application/json" },
    }));

    const res = await POST(req);
    const data = await res.json();

    // Expect only the Standard Room to be available
    expect(data).toEqual([
      expect.objectContaining({ id: standardRoomId }),
    ]);
  });

  it("should return empty images array if no media is found for room", async () => {
    const requestPayload = JSON.stringify({
      checkIn: "2025-06-10",
      checkOut: "2025-06-12",
    });
  
    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: requestPayload,
      headers: { "Content-Type": "application/json" },
    }));
  
    const res = await POST(req);
    const data = await res.json();
  
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  
    (data as { images: string[] }[]).forEach((room) => {
      expect(room).toHaveProperty("images");
      expect(Array.isArray(room.images)).toBe(true);
    });
  });

  it("should return 400 if the date format is invalid", async () => {
    const invalidPayload = JSON.stringify({
      checkIn: "invalid-date",
      checkOut: "2025-06-04",
    });
  
    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: invalidPayload,
      headers: { "Content-Type": "application/json" },
    }));
  
    const res = await POST(req);
    const data = await res.json();
  
    expect(res.status).toBe(400);
    expect(data.message).toMatch(/Invalid date format/);
  });

  it("should return 400 if request body is missing required fields", async () => {
    const badPayload = JSON.stringify({}); // no checkIn or checkOut
  
    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: badPayload,
      headers: { "Content-Type": "application/json" },
    }));
  
    const res = await POST(req);
    const data = await res.json();
  
    expect(res.status).toBe(400);
    expect(data.message).toBe("Check-in and check-out date strings are required.");
  });
  
});
