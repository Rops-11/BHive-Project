import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { PUT } from "@/app/api/book/paymentStatus/[id]/route";
import {
  Room,
  Status,
  Prisma,
  PaymentStatus as PrismaPaymentStatus,
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
  initialPaymentStatus: PrismaPaymentStatus,
  overrides: Partial<Prisma.BookingCreateInput> = {}
) => {
  return {
    roomId,
    checkIn,
    checkOut,
    name: "Payment Booker",
    mobileNumber: "09112233445",
    email: "payment@example.com",
    numberOfAdults: 1,
    numberOfChildren: 0,
    totalPrice: 100.0,
    status: Status.Reserved,
    paymentStatus: initialPaymentStatus,
    bookingType: BookingType.Online,
    ...overrides,
  } as Prisma.BookingCreateInput;
};

describe("API Route: /api/book/paymentStatus/[id]", () => {
  let testRoom: Room;
  let testBooking: Prisma.BookingGetPayload<{}>;

  const today = startOfDay(new Date());
  const checkInDate = addDays(today, 3);
  const checkOutDate = addDays(today, 5);

  beforeAll(async () => {
    console.log(
      "Prisma schema and migrations should be up-to-date from the npm test script."
    );
  });

  beforeEach(async () => {
    await cleanDatabase();

    testRoom = await prisma.room.create({
      data: {
        roomNumber: `PSID${Math.floor(Math.random() * 10000)}`,
        roomType: "Payment Status Test Room",
        maxGuests: 2,
        roomRate: 100,
        amenities: ["Desk"],
      },
    });

    testBooking = await prisma.booking.create({
      data: createInitialBookingData(
        testRoom.id,
        checkInDate,
        checkOutDate,
        PrismaPaymentStatus.Paid
      ),
    });
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("PUT /api/book/paymentStatus/[id]", () => {
    it("should update booking paymentStatus to 'Partial' successfully", async () => {
      const newPaymentStatus = PrismaPaymentStatus.Partial;
      const payload = { paymentStatus: newPaymentStatus };

      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/${testBooking.id}`,
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
      expect(body.message).toBe("Booking payment status updated successfully");
      expect(body.booking.id).toBe(testBooking.id);
      expect(body.booking.paymentStatus).toBe(newPaymentStatus);

      const dbBooking = await prisma.booking.findUnique({
        where: { id: testBooking.id },
      });
      expect(dbBooking?.paymentStatus).toBe(newPaymentStatus);
    });

    it("should update booking paymentStatus to 'Paid' successfully", async () => {
      await prisma.booking.update({
        where: { id: testBooking.id },
        data: { paymentStatus: PrismaPaymentStatus.Partial },
      });

      const newPaymentStatus = PrismaPaymentStatus.Paid;
      const payload = { paymentStatus: newPaymentStatus };

      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/${testBooking.id}`,
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
      expect(body.booking.paymentStatus).toBe(newPaymentStatus);

      const dbBooking = await prisma.booking.findUnique({
        where: { id: testBooking.id },
      });
      expect(dbBooking?.paymentStatus).toBe(newPaymentStatus);
    });

    it("should return 404 if booking ID does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const payload = { paymentStatus: PrismaPaymentStatus.Partial };
      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/${nonExistentId}`,
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
      const payload = { paymentStatus: PrismaPaymentStatus.Partial };
      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/undefined`,
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

    it("should return 400 if paymentStatus is missing in payload", async () => {
      const payload = {};
      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Payment Status is required and cannot be empty."
      );
    });

    it("should return 400 if paymentStatus is an empty string", async () => {
      const payload = { paymentStatus: "  " };
      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Payment Status is required and cannot be empty."
      );
    });

    it("should return 500 if paymentStatus is an invalid enum value (Prisma error)", async () => {
      const payload = { paymentStatus: "InvalidStatusValue" };
      const req = new NextRequest(
        `http://localhost/api/book/paymentStatus/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe("Failed to update booking payment status");

      expect(body.message).toContain(
        "Invalid value for argument `paymentStatus`"
      );
    });
  });
});
