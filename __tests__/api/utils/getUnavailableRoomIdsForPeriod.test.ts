import { prisma } from "utils/db";
import { getUnavailableRoomIdsForPeriod } from "utils/utils";
import { v4 as uuidv4 } from "uuid";
import { addDays, formatISO } from "date-fns";

describe("getUnavailableRoomIdsForPeriod", () => {
  const roomId1 = uuidv4();
  const roomId2 = uuidv4();
  const bookingId1 = uuidv4();
  const bookingId2 = uuidv4();

  // Use future dates relative to today
  const today = new Date();
  const booking1CheckIn = addDays(today, 2); // +2 days from now
  const booking1CheckOut = addDays(today, 6); // +6 days from now

  const booking2CheckIn = addDays(today, 10); // +10 days from now
  const booking2CheckOut = addDays(today, 15); // +15 days from now

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
          checkIn: booking1CheckIn,
          checkOut: booking1CheckOut,
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
          checkIn: booking2CheckIn,
          checkOut: booking2CheckOut,
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
      getUnavailableRoomIdsForPeriod(prisma, "", formatISO(booking1CheckOut, { representation: "date" }))
    ).rejects.toThrow(/required/);
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, "invalid", formatISO(booking1CheckOut, { representation: "date" }))
    ).rejects.toThrow(/Invalid date format/);
  });

  it("throws error if checkout is before or same as checkin", async () => {
    const date = formatISO(addDays(today, 5), { representation: "date" });
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, date, date)
    ).rejects.toThrow(/must be after/);
    await expect(
      getUnavailableRoomIdsForPeriod(prisma, formatISO(addDays(today, 6), { representation: "date" }), date)
    ).rejects.toThrow(/must be after/);
  });

  it("throws error if checkin date is in the past", async () => {
    const pastDate = formatISO(addDays(today, -1), { representation: "date" });
    await expect(
      getUnavailableRoomIdsForPeriod(
        prisma,
        pastDate,
        formatISO(addDays(today, 2), { representation: "date" })
      )
    ).rejects.toThrow(/cannot be in the past/);
  });

  it("returns room IDs that are booked and overlap the target period", async () => {
    const checkIn = formatISO(addDays(today, 3), { representation: "date" });
    const checkOut = formatISO(addDays(today, 4), { representation: "date" });

    const unavailable = await getUnavailableRoomIdsForPeriod(
      prisma,
      checkIn,
      checkOut
    );
    expect(unavailable).toContain(roomId1);
    expect(unavailable).not.toContain(roomId2);
  });

  it("ignores bookings with Cancelled or Complete status", async () => {
    const checkIn = formatISO(addDays(today, 12), { representation: "date" });
    const checkOut = formatISO(addDays(today, 14), { representation: "date" });

    const unavailable = await getUnavailableRoomIdsForPeriod(
      prisma,
      checkIn,
      checkOut
    );
    expect(unavailable).not.toContain(roomId2);
  });

  it("excludes booking ID if excludeBookingId is provided", async () => {
    const checkIn = formatISO(addDays(today, 3), { representation: "date" });
    const checkOut = formatISO(addDays(today, 4), { representation: "date" });

    const unavailable = await getUnavailableRoomIdsForPeriod(
      prisma,
      checkIn,
      checkOut,
      bookingId1
    );
    expect(unavailable).not.toContain(roomId1);
  });
});
