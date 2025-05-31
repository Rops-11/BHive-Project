import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { PUT, DELETE } from "@/app/api/book/normal/[id]/route";
import {
  Room,
  Status,
  Prisma,
  PaymentStatus,
  BookingType,
} from "@prisma/client";
import { addDays, formatISO, startOfDay } from "date-fns";

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
  overrides: Partial<Prisma.BookingCreateInput> = {}
) => {
  return {
    roomId,
    checkIn,
    checkOut,
    name: "Original Booker",
    mobileNumber: "09123456789",
    email: "original@example.com",
    numberOfAdults: 2,
    numberOfChildren: 0,
    totalPrice: 200.0,
    status: Status.Reserved,
    paymentStatus: PaymentStatus.Paid,
    bookingType: BookingType.Online,
    ...overrides,
  } as Prisma.BookingCreateInput;
};

describe("API Route: /api/book/normal/[id]", () => {
  let testRoom: Room;
  let testBooking: Prisma.BookingGetPayload<{}>;

  const today = startOfDay(new Date());
  const checkInDate = addDays(today, 5);
  const checkOutDate = addDays(today, 7);

  beforeAll(async () => {
    console.log(
      "Prisma schema and migrations should be up-to-date from the npm test script."
    );
  });

  beforeEach(async () => {
    await cleanDatabase();

    testRoom = await prisma.room.create({
      data: {
        roomNumber: `NID${Math.floor(Math.random() * 10000)}`,
        roomType: "Normal ID Test Room",
        maxGuests: 3,
        roomRate: 100,
        amenities: ["TV", "Kettle"],
      },
    });

    testBooking = await prisma.booking.create({
      data: createInitialBookingData(testRoom.id, checkInDate, checkOutDate, {
        totalPrice: testRoom.roomRate * 2,
      }),
    });
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("PUT /api/book/normal/[id]", () => {
    const validUpdatePayload = {
      name: "Updated Booker Name",
      mobileNumber: "09987654321",
      email: "updated@example.com",
      numberOfAdults: 1,
      numberOfChildren: 1,
    };

    it("should update booking details successfully", async () => {
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(validUpdatePayload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe("Booking details updated successfully");
      expect(body.booking.id).toBe(testBooking.id);
      expect(body.booking.name).toBe(validUpdatePayload.name);
      expect(body.booking.mobileNumber).toBe(validUpdatePayload.mobileNumber);
      expect(body.booking.email).toBe(validUpdatePayload.email);
      expect(body.booking.numberOfAdults).toBe(
        validUpdatePayload.numberOfAdults
      );
      expect(body.booking.numberOfChildren).toBe(
        validUpdatePayload.numberOfChildren
      );

      const expectedTotalPrice = testRoom.roomRate * 2;
      expect(body.booking.totalPrice).toBe(expectedTotalPrice);

      const dbBooking = await prisma.booking.findUnique({
        where: { id: testBooking.id },
      });
      expect(dbBooking?.name).toBe(validUpdatePayload.name);
    });

    it("should update totalPrice correctly if number of guests exceeds maxGuests", async () => {
      const payloadWithExcessGuests = {
        ...validUpdatePayload,
        numberOfAdults: 2,
        numberOfChildren: 2,
      };
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payloadWithExcessGuests),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      const excessGuestFee = 100;
      const expectedBaseRoomPrice = testRoom.roomRate * 2;
      const expectedTotalPrice = expectedBaseRoomPrice + excessGuestFee;
      expect(body.booking.totalPrice).toBe(expectedTotalPrice);
    });

    it("should return 404 if booking ID does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const req = new NextRequest(
        `http://localhost/api/book/normal/${nonExistentId}`,
        {
          method: "PUT",
          body: JSON.stringify(validUpdatePayload),
        }
      );
      const context = { params: Promise.resolve({ id: nonExistentId }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("No booking found with this ID.");
    });

    it("should return 400 if booking ID is not provided in path", async () => {
      const req = new NextRequest(
        `http://localhost/api/book/normal/undefined`,
        {
          method: "PUT",
          body: JSON.stringify(validUpdatePayload),
        }
      );

      const context = { params: Promise.resolve({ id: undefined as any }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Booking ID is required.");
    });

    it("should return 400 for invalid mobile number", async () => {
      const invalidPayload = { ...validUpdatePayload, mobileNumber: "123" };
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(invalidPayload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("A valid 11-digit mobile number is required.");
    });

    it("should return 400 for empty name", async () => {
      const invalidPayload = { ...validUpdatePayload, name: "  " };
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(invalidPayload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Name is required and cannot be empty.");
    });

    it("should return 400 for invalid email", async () => {
      const invalidPayload = { ...validUpdatePayload, email: "invalidemail" };
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(invalidPayload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("A valid email address is required.");
    });

    it("should return 400 for invalid numberOfAdults (less than 1)", async () => {
      const invalidPayload = { ...validUpdatePayload, numberOfAdults: 0 };
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(invalidPayload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Number of adults must be a number and at least 1."
      );
    });

    it("should return 400 for invalid numberOfChildren (negative)", async () => {
      const invalidPayload = { ...validUpdatePayload, numberOfChildren: -1 };
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(invalidPayload),
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Number of children must be a number and cannot be negative."
      );
    });
  });

  describe("DELETE /api/book/normal/[id]", () => {
    it("should delete a booking successfully", async () => {
      const req = new NextRequest(
        `http://localhost/api/book/normal/${testBooking.id}`,
        {
          method: "DELETE",
        }
      );
      const context = { params: Promise.resolve({ id: testBooking.id }) };

      const response = await DELETE(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe("Booking deleted");

      const dbBooking = await prisma.booking.findUnique({
        where: { id: testBooking.id },
      });
      expect(dbBooking).toBeNull();
    });

    it("should return 404 if trying to delete a non-existent booking", async () => {
      const nonExistentId = "11111111-1111-1111-1111-111111111111";
      const req = new NextRequest(
        `http://localhost/api/book/normal/${nonExistentId}`,
        {
          method: "DELETE",
        }
      );

      const context = { params: Promise.resolve({ id: nonExistentId }) };

      const response = await DELETE(req, context);

      expect(response.status).toBe(500);
    });
  });
});
