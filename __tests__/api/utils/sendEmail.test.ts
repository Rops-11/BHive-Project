import { NextRequest } from "next/server";
import { POST } from "@/app/api/utils/sendEmail/route";
import { prisma } from "utils/db";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";


process.env.EMAIL_FROM = "test@example.com";
process.env.PASS = "testpass";

// Spy on nodemailer but do NOT actually send emails
jest.spyOn(nodemailer, "createTransport").mockReturnValue({
  sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
} as any);

describe("POST /api/utils/sendEmail", () => {
  const testRoomId = uuidv4();

  beforeAll(async () => {
    await prisma.room.create({
      data: {
        id: testRoomId,
        roomType: "Suite",
        roomNumber: "T999",
        isAvailable: true,
        maxGuests: 2,
        roomRate: 300,
        amenities: [],
      },
    });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany(); // if any test creates bookings
    await prisma.room.deleteMany();
    await prisma.$disconnect();
    jest.restoreAllMocks();
  });

  it("sends a confirmation email with valid input", async () => {
    const payload = {
      email: "guest@example.com",
      name: "Test User",
      roomId: testRoomId,
      verified: true,
      checkIn: "2025-06-10",
    };

    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }));

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toMatch(/notification email sent/i);
  });

  it("returns 404 if room does not exist", async () => {
    const payload = {
      email: "guest@example.com",
      name: "Test User",
      roomId: uuidv4(), // invalid room ID
      verified: true,
      checkIn: "2025-06-10",
    };

    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }));

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toMatch(/room with ID .* not found/i);
  });

  it("returns 400 for invalid email format", async () => {
    const payload = {
      email: "bad-email",
      name: "Invalid Email",
      roomId: testRoomId,
      verified: true,
      checkIn: "2025-06-10",
    };

    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }));

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.errors).toHaveProperty("email");
  });

  it("returns 400 for malformed request body", async () => {
    const payload = { name: "Missing Fields" }; // missing required fields

    const req = new NextRequest(new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }));

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.message).toMatch(/invalid input/i);
  });
});
