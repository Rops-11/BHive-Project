import { BookingType, PaymentStatus, Prisma, Status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";
import { getMedia, uploadImage } from "utils/supabase/storage";

export async function GET() {
  try {
    let errorInImage = false;
    const bookings = await prisma.booking.findMany({
      include: {
        room: true,
      },
      orderBy: {
        checkIn: "asc",
      },
    });

    const bookingWithProofs = await Promise.all(
      bookings.map(async (booking) => {
        const { data, error } = await getMedia("payment", booking.id);

        if (error) {
          errorInImage = true;
        }

        let image = null;
        if (data?.length) {
          if (data.length > 0) image = data[0];
        }

        return { ...booking, image: image };
      })
    );

    if (errorInImage) {
      return NextResponse.json(
        { message: "Error in fetching images" },
        { status: 400 }
      );
    }

    return NextResponse.json(bookingWithProofs, { status: 200 });
  } catch (error: unknown) {
    console.error("Error to fetch bookings:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    const errorStack =
      error instanceof Error && process.env.NODE_ENV === "development"
        ? error.stack
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to fetch bookings",
        message: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let tempBookingIdForCleanup: string | null = null;

  try {
    const formData = await req.formData();

    const roomId = formData.get("roomId") as string | null;
    const checkInStr = formData.get("checkIn") as string | null;
    const checkOutStr = formData.get("checkOut") as string | null;
    const mobileNumber = formData.get("mobileNumber") as string | null;
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const bookingTypeStr = formData.get("bookingType") as string | null;
    const numberOfAdultsStr = formData.get("numberOfAdults") as string | null;
    const numberOfChildrenStr = formData.get("numberOfChildren") as
      | string
      | null;
    const totalPriceStr = formData.get("totalPrice") as string | null;
    const paymentStatusStr = formData.get("paymentStatus") as string | null;
    const file = formData.get("file") as File | null;

    const validationMap: { [key: string]: any } = {
      roomId,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      mobileNumber,
      name,
      numberOfAdults: numberOfAdultsStr,
      numberOfChildren: numberOfChildrenStr,
      totalPrice: totalPriceStr,
    };

    const missingFields = Object.entries(validationMap)
      .filter(
        ([_, value]) =>
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "")
      )
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: "Details provided incomplete.", missing: missingFields },
        { status: 400 }
      );
    }

    const checkIn = new Date(checkInStr!);
    const checkOut = new Date(checkOutStr!);
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format." },
        { status: 400 }
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today) {
      return NextResponse.json(
        { message: "Check-in date cannot be in the past." },
        { status: 400 }
      );
    }
    if (checkOut <= checkIn) {
      return NextResponse.json(
        { message: "Check-out date must be after check-in." },
        { status: 400 }
      );
    }

    const numberOfAdults = parseInt(numberOfAdultsStr!, 10);
    if (isNaN(numberOfAdults) || numberOfAdults < 1) {
      return NextResponse.json(
        { message: "Adults must be at least 1 (numeric)." },
        { status: 400 }
      );
    }

    const numberOfChildren = parseInt(numberOfChildrenStr!, 10);
    if (isNaN(numberOfChildren) || numberOfChildren < 0) {
      return NextResponse.json(
        { message: "Children cannot be negative (numeric)." },
        { status: 400 }
      );
    }

    const totalPrice = parseFloat(totalPriceStr!);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return NextResponse.json(
        { message: "Total price must be positive (numeric)." },
        { status: 400 }
      );
    }

    const bookingType = bookingTypeStr
      ? (bookingTypeStr as BookingType)
      : undefined;
    if (bookingType && !Object.values(BookingType).includes(bookingType)) {
      return NextResponse.json(
        { message: `Invalid bookingType: ${bookingTypeStr}.` },
        { status: 400 }
      );
    }

    const paymentStatus = paymentStatusStr
      ? (paymentStatusStr as PaymentStatus)
      : undefined;
    if (
      paymentStatus &&
      !Object.values(PaymentStatus).includes(paymentStatus)
    ) {
      return NextResponse.json(
        { message: `Invalid paymentStatus: ${paymentStatusStr}.` },
        { status: 400 }
      );
    }

    const newBooking = await prisma.$transaction(async (tx) => {
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomId: roomId!,
          status: { notIn: [Status.Cancelled, Status.Complete] },
          AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
        },
      });
      if (conflictingBooking) {
        const error = new Error(
          "Room is already booked for the selected dates."
        );
        (error as any).statusCode = 409;
        throw error;
      }

      let initialBookingStatus: Status;

      if (paymentStatus) {
        initialBookingStatus = Status.Pending;
      } else {
        if (file) {
          initialBookingStatus = Status.Pending;
        } else {
          initialBookingStatus = Status.Reserved;
        }
      }

      const bookingDataToCreate: Prisma.BookingCreateInput = {
        room: { connect: { id: roomId! } },
        checkIn,
        checkOut,
        mobileNumber: mobileNumber!,
        name: name!,
        numberOfAdults,
        numberOfChildren,
        totalPrice,
        status: initialBookingStatus,
        ...(email && { email }),
        ...(bookingType && { bookingType }),
        ...(paymentStatus && {
          paymentStatus,
        }),
      };

      return tx.booking.create({ data: bookingDataToCreate });
    });

    tempBookingIdForCleanup = newBooking.id;

    if (file) {
      if (!(file instanceof File) || file.size === 0) {
        console.warn(
          `Booking ${newBooking.id} created, but file provided was invalid or empty. Skipping image upload.`
        );
      } else {
        const uploadResult = await uploadImage("payment", newBooking.id, file);

        if (uploadResult.error) {
          console.error(
            `Image upload failed for booking ${newBooking.id}: ${uploadResult.error.message}`
          );
          const uploadFailError = new Error(
            `Booking record created (ID: ${newBooking.id}), but payment proof upload failed: ${uploadResult.error.message}. The booking will be rolled back.`
          );
          (uploadFailError as any).cleanupBookingId = newBooking.id;
          throw uploadFailError;
        }
      }
    }

    const finalBookingDetails = await prisma.booking.findUnique({
      where: { id: newBooking.id },
      include: { room: { select: { roomNumber: true, roomType: true } } },
    });

    return NextResponse.json(finalBookingDetails, { status: 201 });
  } catch (error: unknown) {
    console.error("Error during booking process:", error);
    const bookingIdToCleanup =
      (error as any)?.cleanupBookingId || tempBookingIdForCleanup;

    if (bookingIdToCleanup) {
      try {
        console.warn(
          `Attempting to clean up (delete) booking due to error: ${bookingIdToCleanup}`
        );
        await prisma.booking.delete({ where: { id: bookingIdToCleanup } });
        console.log(
          `Successfully cleaned up (deleted) booking: ${bookingIdToCleanup}`
        );
      } catch (cleanupError) {
        console.error(
          `FATAL: Failed to clean up booking ${bookingIdToCleanup}. Manual intervention required. Cleanup error:`,
          cleanupError
        );
      }
    }

    if (error instanceof Error) {
      const statusCode = (error as any).statusCode || 500;
      let message = error.message;
      let details: string | undefined;

      if ((error as any).cleanupBookingId) {
        message =
          "The booking could not be completed due to an issue with payment proof upload. The attempted booking has been rolled back. Please try again.";
        details = error.message;
      }

      return NextResponse.json(
        {
          error: "Failed to create booking",
          message: message,
          details: details,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create booking",
        message: "An unknown error occurred.",
      },
      { status: 500 }
    );
  }
}
