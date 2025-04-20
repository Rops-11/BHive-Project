import { Room } from "@/types/types";
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
  // Range A starts before Range B ends AND Range A ends after Range B starts
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
    return doDateRangesOverlap(targetRange, bookingStayRange); // Added return here
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
