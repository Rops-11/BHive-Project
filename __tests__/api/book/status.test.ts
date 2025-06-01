import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { PUT } from "@/app/api/book/status/[id]/route";
import {
  Room,
  Status as PrismaStatus,
  Prisma,
  PaymentStatus,
  BookingType,
} from "@prisma/client";
import { addDays, startOfDay } from "date-fns";

async function cleanDatabase() {
  const orderedTableNames = [Prisma.ModelName.Booking, Prisma.ModelName.Room];
  for (const modelName of orderedTableNames) {
    try {
      await (prisma as any)[modelName.toLowerCase()].deleteMany({});
    } catch (error) {
      console.warn(
        `Could not clean table ${modelName}: ${(error as Error).message}`
      );
    }
  }
}

const createInitialBookingData = (
  roomId: string,
  checkIn: Date,
  checkOut: Date,
  initialStatus: PrismaStatus,
  overrides: Partial<Prisma.BookingCreateInput> = {}
) => {
  return {
    roomId,
    checkIn,
    checkOut,
    name: "Status Booker",
    mobileNumber: "09998887776",
    email: "status@example.com",
    numberOfAdults: 1,
    numberOfChildren: 0,
    totalPrice: 100.0,
    status: initialStatus,
    paymentStatus: PaymentStatus.Paid,
    bookingType: BookingType.Online,
    ...overrides,
  } as Prisma.BookingCreateInput;
};

describe("API Route: /api/book/status/[id]", () => {
  let testRoom: Room;
  let testBooking: Prisma.BookingGetPayload<{}>;

  const today = startOfDay(new Date());
  const checkInDate = addDays(today, 7);
  const checkOutDate = addDays(today, 9);

  beforeAll(async () => {
    console.log(
      "Prisma schema and migrations should be up-to-date from the npm test script."
    );
  });

  beforeEach(async () => {
    await cleanDatabase();

    testRoom = await prisma.room.create({
      data: {
        roomNumber: `SID${Math.floor(Math.random() * 10000)}`,
        roomType: "Status Test Room",
        maxGuests: 2,
        roomRate: 100,
        amenities: ["Safe"],
      },
    });

    testBooking = await prisma.booking.create({
      data: createInitialBookingData(
        testRoom.id,
        checkInDate,
        checkOutDate,
        PrismaStatus.Pending
      ),
    });
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("PUT /api/book/status/[id]", () => {
    it("should update booking status to 'Reserved' successfully", async () => {
      const newStatus = PrismaStatus.Reserved;
      const payload = { status: newStatus };

      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe("Booking status updated successfully");
      expect(body.booking.id).toBe(testBooking.id);
      expect(body.booking.status).toBe(newStatus);

      const dbBooking = await prisma.booking.findUnique({
        where: { id: testBooking.id },
      });
      expect(dbBooking?.status).toBe(newStatus);
    });

    it("should update booking status to 'Ongoing' successfully", async () => {
      const newStatus = PrismaStatus.Ongoing;
      const payload = { status: newStatus };
      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.booking.status).toBe(newStatus);
    });

    it("should update booking status to 'Complete' successfully", async () => {
      const newStatus = PrismaStatus.Complete;
      const payload = { status: newStatus };
      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.booking.status).toBe(newStatus);
    });

    it("should update booking status to 'Cancelled' successfully", async () => {
      const newStatus = PrismaStatus.Cancelled;
      const payload = { status: newStatus };
      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.booking.status).toBe(newStatus);
    });

    it("should return 404 if booking ID does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const payload = { status: PrismaStatus.Reserved };
      const req = new NextRequest(
        `http://localhost/api/book/status/${nonExistentId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: nonExistentId }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(404);
      expect(body.message).toBe("No booking found with this ID.");
    });

    it("should return 400 if booking ID is not provided in path", async () => {
      const payload = { status: PrismaStatus.Reserved };
      const req = new NextRequest(
        `http://localhost/api/book/status/undefined`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: undefined as any }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Booking ID is required.");
    });

    it("should return 400 if status is missing in payload", async () => {
      const payload = {};
      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Status is required and cannot be empty.");
    });

    it("should return 400 if status is an empty string", async () => {
      const payload = { status: "  " };
      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Status is required and cannot be empty.");
    });

    it("should return 500 if status is an invalid enum value (Prisma error)", async () => {
      const payload = { status: "InvalidBookingStatus" };
      const req = new NextRequest(
        `http://localhost/api/book/status/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe("Failed to update booking status");
      expect(body.message).toContain("Invalid value for argument `status`");
    });
  });
});
