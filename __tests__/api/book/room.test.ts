import { NextRequest } from "next/server";
import { prisma } from "utils/db";
import { PUT } from "@/app/api/book/room/[id]/route";
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
  totalPrice: number,
  overrides: Partial<Prisma.BookingCreateInput> = {}
) => {
  return {
    roomId,
    checkIn,
    checkOut,
    name: "Room Change Booker",
    mobileNumber: "09556677889",
    email: "roomchange@example.com",
    numberOfAdults: 1,
    numberOfChildren: 0,
    totalPrice,
    status: Status.Reserved,
    paymentStatus: PaymentStatus.Paid,
    bookingType: BookingType.Online,
    ...overrides,
  } as Prisma.BookingCreateInput;
};

describe("API Route: /api/book/room/[id]", () => {
  let room1: Room;
  let room2: Room;
  let room3WithLowerRate: Room;
  let initialBooking: Prisma.BookingGetPayload<{}>;

  const today = startOfDay(new Date());

  const initialCheckIn = addDays(today, 10);
  const initialCheckOut = addDays(today, 12);

  const newCheckInDate = addDays(today, 15);
  const newCheckOutDate = addDays(today, 18);

  beforeAll(async () => {
    console.log(
      "Prisma schema and migrations should be up-to-date from the npm test script."
    );
  });

  beforeEach(async () => {
    await cleanDatabase();

    [room1, room2, room3WithLowerRate] = await prisma.$transaction([
      prisma.room.create({
        data: {
          roomNumber: `RMD${Math.floor(Math.random() * 1000)}`,
          roomType: "Original Room",
          maxGuests: 2,
          roomRate: 150,
          amenities: ["Basic"],
        },
      }),
      prisma.room.create({
        data: {
          roomNumber: `RMD${Math.floor(Math.random() * 1000) + 1000}`,
          roomType: "New Room",
          maxGuests: 3,
          roomRate: 200,
          amenities: ["Upgraded"],
        },
      }),
      prisma.room.create({
        data: {
          roomNumber: `RMD${Math.floor(Math.random() * 1000) + 2000}`,
          roomType: "Cheaper Room",
          maxGuests: 2,
          roomRate: 100,
          amenities: ["Budget"],
        },
      }),
    ]);

    initialBooking = await prisma.booking.create({
      data: createInitialBookingData(
        room1.id,
        initialCheckIn,
        initialCheckOut,
        room1.roomRate * 2
      ),
    });
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe("PUT /api/book/room/[id]", () => {
    it("should successfully update booking to a new room and new dates", async () => {
      const payload = {
        roomId: room2.id,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe("Booking room and dates updated successfully.");
      expect(body.booking.id).toBe(initialBooking.id);
      expect(body.booking.roomId).toBe(room2.id);
      expect(new Date(body.booking.checkIn).toISOString()).toBe(
        newCheckInDate.toISOString()
      );
      expect(new Date(body.booking.checkOut).toISOString()).toBe(
        newCheckOutDate.toISOString()
      );

      expect(body.booking.totalPrice).toBe(room2.roomRate * 3);

      const dbBooking = await prisma.booking.findUnique({
        where: { id: initialBooking.id },
      });
      expect(dbBooking?.roomId).toBe(room2.id);
    });

    it("should successfully update booking to new dates in the same room", async () => {
      const payload = {
        roomId: room1.id,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.booking.roomId).toBe(room1.id);
      expect(new Date(body.booking.checkIn).toISOString()).toBe(
        newCheckInDate.toISOString()
      );

      expect(body.booking.totalPrice).toBe(room1.roomRate * 3);
    });

    it("should successfully update booking to a new room for the same dates", async () => {
      const payload = {
        roomId: room2.id,
        checkIn: formatISO(initialCheckIn),
        checkOut: formatISO(initialCheckOut),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.booking.roomId).toBe(room2.id);
      expect(new Date(body.booking.checkIn).toISOString()).toBe(
        initialCheckIn.toISOString()
      );

      expect(body.booking.totalPrice).toBe(room2.roomRate * 2);
    });

    it("should update totalPrice correctly with excess guests in the new room", async () => {
      const bookingWithMoreGuests = await prisma.booking.update({
        where: { id: initialBooking.id },
        data: { numberOfAdults: 2, numberOfChildren: 1 },
      });

      const payload = {
        roomId: room1.id,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${bookingWithMoreGuests.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = {
        params: Promise.resolve({ id: bookingWithMoreGuests.id }),
      };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);
      const excessGuestFee = 100;
      const baseRoomPrice = room1.roomRate * 3;
      expect(body.booking.totalPrice).toBe(baseRoomPrice + excessGuestFee);
    });

    it("should return 409 if the new room/dates are not available due to another booking", async () => {
      await prisma.booking.create({
        data: createInitialBookingData(
          room2.id,
          newCheckInDate,
          newCheckOutDate,
          room2.roomRate * 3,
          { name: "Blocker Booking" }
        ),
      });

      const payload = {
        roomId: room2.id,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(409);
      expect(body.message).toBe(
        "The selected room is not available for the chosen dates."
      );
    });

    it("should allow rebooking the same room/dates if no conflict (effectively no change)", async () => {
      const payload = {
        roomId: initialBooking.roomId,
        checkIn: formatISO(initialCheckIn),
        checkOut: formatISO(initialCheckOut),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(200);

      expect(body.booking.totalPrice).toBe(initialBooking.totalPrice);
    });

    it("should return 404 if booking ID to update does not exist", async () => {
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const payload = {
        roomId: room2.id,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${nonExistentId}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: nonExistentId }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(404);
      expect(body.message).toBe("No booking found with this ID.");
    });

    it("should return 404 if the new roomId does not exist", async () => {
      const nonExistentRoomId = "11111111-1111-1111-1111-111111111111";
      const payload = {
        roomId: nonExistentRoomId,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(404);
      expect(body.message).toBe("The selected new room was not found.");
    });

    it("should return 400 for missing roomId in payload", async () => {
      const payload = {
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("A valid Room ID is required.");
    });

    it("should return 400 for missing checkIn date", async () => {
      const payload = {
        roomId: room2.id,
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Check-in and Check-out dates are required.");
    });

    it("should return 400 for invalid date format", async () => {
      const payload = {
        roomId: room2.id,
        checkIn: "invalid-date",
        checkOut: formatISO(newCheckOutDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe(
        "Invalid date format for Check-in or Check-out."
      );
    });

    it("should return 400 if new checkOut is not after new checkIn", async () => {
      const payload = {
        roomId: room2.id,
        checkIn: formatISO(newCheckOutDate),
        checkOut: formatISO(newCheckInDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Check-out date must be after Check-in date.");
    });

    it("should return 400 if new checkIn date is in the past", async () => {
      const pastDate = addDays(today, -2);
      const payload = {
        roomId: room2.id,
        checkIn: formatISO(pastDate),
        checkOut: formatISO(today),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        { method: "PUT", body: JSON.stringify(payload) }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };
      const response = await PUT(req, context);
      const body = await response.json();
      expect(response.status).toBe(400);
      expect(body.message).toBe("Check-in date cannot be in the past.");
    });

    it("should return 400 for zero day difference", async () => {
      const payload = {
        roomId: room2.id,
        checkIn: formatISO(newCheckInDate),
        checkOut: formatISO(newCheckInDate),
      };
      const req = new NextRequest(
        `http://localhost/api/book/room/${initialBooking.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );
      const context = { params: Promise.resolve({ id: initialBooking.id }) };

      const response = await PUT(req, context);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.message).toBe("Check-out date must be after Check-in date.");
    });
  });
});
