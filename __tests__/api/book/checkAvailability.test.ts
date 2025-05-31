import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { POST } from "@/app/api/book/checkAvailability/route";
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

describe("API Route: /api/book/checkAvailability", () => {
  let testRoom1: Room;
  let testRoom2: Room;

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);
  const threeDaysLater = addDays(today, 3);
  const fourDaysLater = addDays(today, 4);

  beforeAll(async () => {
    console.log(
      "Prisma schema and migrations should be up-to-date from the npm test script."
    );
  });

  beforeEach(async () => {
    await cleanDatabase();

    [testRoom1, testRoom2] = await prisma.$transaction([
      prisma.room.create({
        data: {
          roomNumber: `CAV${Math.floor(Math.random() * 10000)}`,
          roomType: "Standard Test",
          maxGuests: 2,
          roomRate: 100,
          amenities: ["Wifi"],
        },
      }),
      prisma.room.create({
        data: {
          roomNumber: `CAV${Math.floor(Math.random() * 10000) + 10000}`,
          roomType: "Deluxe Test",
          maxGuests: 3,
          roomRate: 150,
          amenities: ["Wifi", "Minibar"],
        },
      }),
    ]);
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("POST /api/book/checkAvailability", () => {
    const createBookingData = (
      roomId: string,
      checkIn: Date,
      checkOut: Date,
      status: Status,
      overrides: Partial<Prisma.BookingCreateInput> = {}
    ) => {
      return {
        roomId,
        checkIn,
        checkOut,
        name: "Test Booker",
        mobileNumber: "1234567890",
        numberOfAdults: 1,
        numberOfChildren: 0,
        totalPrice: 100.0,
        status,
        ...overrides,
      } as Prisma.BookingCreateInput;
    };

    it("should return isAvailable: true for an available room", async () => {
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(true);
    });

    it("should return isAvailable: false if the room is booked for the exact dates", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          tomorrow,
          dayAfterTomorrow,
          Status.Reserved
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(false);
      expect(body.message).toBe(
        "Room is not available for the selected dates."
      );
    });

    it("should return isAvailable: false if the room is booked overlapping the start date", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          today,
          dayAfterTomorrow,
          Status.Reserved
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(threeDaysLater),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(false);
    });

    it("should return isAvailable: false if the room is booked overlapping the end date", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          dayAfterTomorrow,
          fourDaysLater,
          Status.Pending
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(threeDaysLater),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(false);
    });

    it("should return isAvailable: false if the requested period completely contains an existing booking", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          dayAfterTomorrow,
          threeDaysLater,
          Status.Reserved
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(fourDaysLater),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(false);
    });

    it("should return isAvailable: true if an existing booking is for a different room", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom2.id,
          tomorrow,
          dayAfterTomorrow,
          Status.Reserved
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(true);
    });

    it("should return isAvailable: true when excluding the current booking being edited", async () => {
      const existingBooking = await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          tomorrow,
          dayAfterTomorrow,
          Status.Reserved
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
        excludeBookingId: existingBooking.id,
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(true);
    });

    it("should return isAvailable: false if another booking conflicts, even when excluding one", async () => {
      const bookingToExclude = await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          tomorrow,
          dayAfterTomorrow,
          Status.Reserved,
          { name: "Booker Alpha" }
        ),
      });
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          dayAfterTomorrow,
          threeDaysLater,
          Status.Reserved,
          { name: "Booker Beta" }
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(threeDaysLater),
        excludeBookingId: bookingToExclude.id,
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(false);
    });

    it("should return isAvailable: true if booking status is Cancelled", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          tomorrow,
          dayAfterTomorrow,
          Status.Cancelled
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(true);
    });

    it("should return isAvailable: true if booking status is Complete", async () => {
      await prisma.booking.create({
        data: createBookingData(
          testRoom1.id,
          tomorrow,
          dayAfterTomorrow,
          Status.Complete
        ),
      });
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.isAvailable).toBe(true);
    });

    it("should return 400 for missing roomId", async () => {
      const payload = {
        checkIn: formatISO(tomorrow),
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toContain("Missing required fields");
      expect(body.missing).toContain("roomId");
    });

    it("should return 400 for missing checkIn", async () => {
      const payload = {
        roomId: testRoom1.id,
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toContain("Missing required fields");
      expect(body.missing).toContain("checkIn");
    });

    it("should return 400 for missing checkOut", async () => {
      const payload = { roomId: testRoom1.id, checkIn: formatISO(tomorrow) };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toContain("Missing required fields");
      expect(body.missing).toContain("checkOut");
    });

    it("should return 400 for invalid checkIn date format", async () => {
      const payload = {
        roomId: testRoom1.id,
        checkIn: "invalid-date-string",
        checkOut: formatISO(dayAfterTomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Invalid date format for check-in or check-out."
      );
    });

    it("should return 400 if checkOut date is before or same as checkIn date", async () => {
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(dayAfterTomorrow),
        checkOut: formatISO(tomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Check-out date must be after check-in date.");
    });

    it("should return 400 if checkIn date is in the past", async () => {
      const yesterday = addDays(today, -1);
      const payload = {
        roomId: testRoom1.id,
        checkIn: formatISO(yesterday),
        checkOut: formatISO(tomorrow),
      };
      const req = new NextRequest(
        "http://localhost/api/book/checkAvailability",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const response = await POST(req);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Check-in date cannot be in the past.");
    });
  });
});
