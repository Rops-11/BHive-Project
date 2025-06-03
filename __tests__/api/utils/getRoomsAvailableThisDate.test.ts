import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { POST } from "@/app/api/utils/getRoomsAvailableThisDate/route";
import { v4 as uuidv4 } from "uuid";

// Reusable date helper
const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

describe("GET Available Rooms", () => {
  const deluxeRoomId = "a1111111-1111-1111-1111-111111111111";
  const standardRoomId = "b2222222-2222-2222-2222-222222222222";

  beforeAll(async () => {
    await prisma.room.createMany({
      data: [
        {
          id: deluxeRoomId,
          roomType: "Deluxe",
          roomNumber: "101",
          maxGuests: 2,
          roomRate: 200,
          amenities: [],
        },
        {
          id: standardRoomId,
          roomType: "Standard",
          roomNumber: "102",
          maxGuests: 2,
          roomRate: 100,
          amenities: [],
        },
      ],
    });

    await prisma.booking.create({
      data: {
        id: uuidv4(),
        roomId: deluxeRoomId,
        checkIn: new Date(getFutureDate(5)),
        checkOut: new Date(getFutureDate(10)),
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
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.$disconnect();
  });

  it("should return only available rooms for the given date range", async () => {
    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          checkIn: getFutureDate(6),
          checkOut: getFutureDate(8),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([expect.objectContaining({ id: standardRoomId })]);
  });

  it("should return empty images array if no media is found for room", async () => {
    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          checkIn: getFutureDate(20),
          checkOut: getFutureDate(22),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    data.forEach((room: any) => {
      expect(room).toHaveProperty("images");
      expect(Array.isArray(room.images)).toBe(true);
    });
  });

  it("should return 400 if the date format is invalid", async () => {
    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          checkIn: "invalid-date",
          checkOut: getFutureDate(10),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toMatch(/Invalid date format/);
  });

  it("should return 400 if request body is missing required fields", async () => {
    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toBe("Check-in and check-out date strings are required.");
  });

  it("should include a room booked before the check-in date", async () => {
    await prisma.booking.create({
      data: {
        id: uuidv4(),
        roomId: standardRoomId,
        checkIn: new Date(getFutureDate(-30)),
        checkOut: new Date(getFutureDate(-20)),
        mobileNumber: "09999999999",
        email: "past@example.com",
        name: "Past Guest",
        numberOfAdults: 1,
        numberOfChildren: 0,
        totalPrice: 100,
        status: "Complete",
        paymentStatus: "Paid",
        bookingType: "Online",
      },
    });

    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          checkIn: getFutureDate(20),
          checkOut: getFutureDate(22),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    const ids = data.map((r: any) => r.id);
    expect(ids).toContain(standardRoomId);
  });

  it("should include a room booked after the check-out date", async () => {
    await prisma.booking.create({
      data: {
        id: uuidv4(),
        roomId: standardRoomId,
        checkIn: new Date(getFutureDate(30)),
        checkOut: new Date(getFutureDate(35)),
        mobileNumber: "09988888888",
        email: "future@example.com",
        name: "Future Guest",
        numberOfAdults: 1,
        numberOfChildren: 0,
        totalPrice: 200,
        status: "Pending",
        paymentStatus: "Paid",
        bookingType: "Online",
      },
    });

    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          checkIn: getFutureDate(20),
          checkOut: getFutureDate(22),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    const ids = data.map((r: any) => r.id);
    expect(ids).toContain(standardRoomId);
  });

  it("should exclude rooms that partially overlap the date range", async () => {
    const roomId = uuidv4();
  
    await prisma.room.create({
      data: {
        id: roomId,
        roomType: "Suite",
        roomNumber: "103",
        maxGuests: 4,
        roomRate: 300,
        amenities: [],
      },
    });
  
    await prisma.booking.create({
      data: {
        id: uuidv4(),
        roomId,
        checkIn: new Date(getFutureDate(21)),
        checkOut: new Date(getFutureDate(25)),
        mobileNumber: "09123456789",
        email: "conflict@example.com",
        name: "Conflict Guest",
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalPrice: 900,
        status: "Reserved",
        paymentStatus: "Paid",
        bookingType: "Online",
      },
    });
  
    const req = new NextRequest(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          checkIn: getFutureDate(20),
          checkOut: getFutureDate(22),
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
  
    const res = await POST(req);
    const data = await res.json();
    const roomIds = data.map((r: any) => r.id);
  
    expect(roomIds).not.toContain(roomId);
  });  
});
