import { Booking } from "@prisma/client";

export const checkDaysDifference = (checkIn: Date, checkOut: Date) => {
  const utc1 =
    checkIn &&
    Date.UTC(checkIn!.getFullYear(), checkIn!.getMonth(), checkIn!.getDate());
  const utc2 =
    checkOut &&
    Date.UTC(
      checkOut!.getFullYear(),
      checkOut!.getMonth(),
      checkOut!.getDate()
    );
  const timeDiff = utc1 && utc2 && Math.abs(utc2 - utc1);
  const daysDiff = timeDiff && Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
};

export const doDateRangesOverlap = (
  rangeA: { checkIn: Date; checkOut: Date },
  rangeB: { checkIn: Date; checkOut: Date }
): boolean => {
  return rangeA.checkIn <= rangeB.checkOut && rangeA.checkOut >= rangeB.checkIn;
};

export const isOverlappingWithAny = (
  targetRange: { checkIn: Date; checkOut: Date },
  bookings: Booking[]
): boolean => {
  const now = new Date();

  const relevantBookings = bookings.filter(
    (booking) => booking.checkOut >= now
  );
  return relevantBookings.some((booking) => {
    const bookingStayRange = {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    };
    return doDateRangesOverlap(targetRange, bookingStayRange);
  });
};

export const findOverlappingBookings = (
  targetRange: { checkIn: Date | string; checkOut: Date | string },
  bookings: Booking[]
): Booking[] => {
  const now = new Date();

  const targetCheckIn =
    targetRange.checkIn instanceof Date
      ? targetRange.checkIn
      : new Date(targetRange.checkIn);
  const targetCheckOut =
    targetRange.checkOut instanceof Date
      ? targetRange.checkOut
      : new Date(targetRange.checkOut);

  const processedBookings = bookings.map((booking) => ({
    ...booking,
    checkIn:
      booking.checkIn instanceof Date
        ? booking.checkIn
        : new Date(booking.checkIn),
    checkOut:
      booking.checkOut instanceof Date
        ? booking.checkOut
        : new Date(booking.checkOut),
  }));

  const relevantBookings = processedBookings.filter(
    (booking) => booking.checkOut >= now
  );

  const bookingsOverlapped = relevantBookings.filter((booking) => {
    const result = doDateRangesOverlap(
      { checkIn: targetCheckIn, checkOut: targetCheckOut },
      booking
    );
    return result;
  });

  return bookingsOverlapped;
};

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

import { Prisma, PrismaClient } from "@prisma/client";
import { startOfDay } from "date-fns";

export async function getUnavailableRoomIdsForPeriod(
  prisma: PrismaClient,
  checkInStr: string,
  checkOutStr: string,
  excludeBookingId?: string
): Promise<string[]> {
  if (!checkInStr || !checkOutStr) {
    throw new Error("Check-in and check-out date strings are required.");
  }

  const targetCheckInDate = startOfDay(new Date(checkInStr));
  const targetCheckOutDate = startOfDay(new Date(checkOutStr));

  if (
    isNaN(targetCheckInDate.getTime()) ||
    isNaN(targetCheckOutDate.getTime())
  ) {
    throw new Error("Invalid date format for check-in or check-out.");
  }

  if (targetCheckOutDate <= targetCheckInDate) {
    throw new Error("Check-out date must be after check-in date.");
  }

  const today = startOfDay(new Date());
  if (targetCheckInDate < today) {
    throw new Error("Check-in date cannot be in the past.");
  }

  const whereClause: Prisma.BookingWhereInput = {
    status: {
      notIn: ["Cancelled", "Complete"],
    },
    checkIn: {
      lt: targetCheckOutDate,
    },
    checkOut: {
      gt: targetCheckInDate,
    },
  };

  if (excludeBookingId && typeof excludeBookingId === "string") {
    whereClause.NOT = { id: excludeBookingId };
  }

  const conflictingBookings = await prisma.booking.findMany({
    where: whereClause,
    select: {
      roomId: true,
    },
    distinct: ["roomId"],
  });

  return conflictingBookings.map((b) => b.roomId);
}
