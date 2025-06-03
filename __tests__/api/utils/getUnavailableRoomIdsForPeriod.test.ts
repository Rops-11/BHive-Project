import { PrismaClient } from "@prisma/client";
import { getUnavailableRoomIdsForPeriod } from "utils/utils";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

describe("getUnavailableRoomIdsForPeriod", () => {
  const roomId1 = uuidv4();
  const roomId2 = uuidv4();
  const bookingId1 = uuidv4();
  const bookingId2 = uuidv4();

  beforeAll(async () => {
    // Seed rooms
    await prisma.room.createMany({
      data: [
        {
          id: roomId1,
          roomType: "Standard",
          roomNumber: "201",
          maxGuests: 2,
          roomRate: 100,
          amenities: [],
        },
        {
          id: roomId2,
          roomType: "Deluxe",
          roomNumber: "202",
          maxGuests: 2,
          roomRate: 200,
          amenities: [],
        },
      ],
    });

    // Seed bookings
    await prisma.booking.createMany({
      data: [
        {
          id: bookingId1,
          roomId: roomId1,
          checkIn: new Date("2025-06-01"),
          checkOut: new Date("2025-06-05"),
          mobileNumber: "09123456789",
          email: "a@example.com",
          name: "Guest A",
          numberOfAdults: 1,
          numberOfChildren: 0,
          totalPrice: 400,
          status: "Pending",
          paymentStatus: "Paid",
          bookingType: "Online",
        },
        {
          id: bookingId2,
          roomId: roomId2,
          checkIn: new Date("2025-06-10"),
          checkOut: new Date("2025-06-15"),
          mobileNumber: "09123456789",
          email: "b@example.com",
          name: "Guest B",
          numberOfAdults: 2,
          numberOfChildren: 1,
          totalPrice: 800,
          status: "Complete",
          paymentStatus: "Paid",
          bookingType: "Online",
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.$disconnect();
  });

  it("throws error if dates missing or invalid", async () => {
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, "", "2025-06-05")
    ).rejects.toThrow(/required/);
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, "invalid", "2025-06-05")
    ).rejects.toThrow(/Invalid date format/);
  });

  it("throws error if checkout is before or same as checkin", async () => {
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, "2025-06-05", "2025-06-05")
    ).rejects.toThrow(/must be after/);
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, "2025-06-06", "2025-06-05")
    ).rejects.toThrow(/must be after/);
  });

  it("throws error if checkin date is in the past", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    await expect(
      getUnavailableRoomIdsForPeriod(
        prisma,
        pastDate.toISOString(),
        "2025-06-05"
      )
    ).rejects.toThrow(/cannot be in the past/);
  });

  it("returns room IDs that are booked and overlap the target period", async () => {
    // Overlapping booking for roomId1 only (booking-1 is pending)
    const unavailable = await getUnavailableRoomIdsForPeriod(
      prisma,
      "2025-06-03",
      "2025-06-04"
    );
    expect(unavailable).toContain(roomId1);
    expect(unavailable).not.toContain(roomId2);
  });

  it("ignores bookings with Cancelled or Complete status", async () => {
    // booking-2 is Complete, so its roomId2 should not be returned
    const unavailable = await getUnavailableRoomIdsForPeriod(
      prisma,
      "2025-06-12",
      "2025-06-14"
    );
    expect(unavailable).not.toContain(roomId2);
  });

  it("excludes booking ID if excludeBookingId is provided", async () => {
    const unavailable = await getUnavailableRoomIdsForPeriod(
      prisma,
      "2025-06-03",
      "2025-06-04",
      bookingId1
    );
    expect(unavailable).not.toContain(roomId1);
  });
});
