import { NextRequest, NextResponse } from "next/server";
import { prisma } from "utils/db";
import { formatDate } from "utils/utils";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { z, ZodError } from "zod";

const emailRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
  roomId: z.string().min(1, { message: "Room ID is required" }),
  verified: z.boolean(),
  checkIn: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Invalid check-in date format",
  }),
});

const createEmailHtml = (
  name: string,
  roomType: string | undefined,
  roomNumber: string | undefined,
  checkInDate: string,
  verified: boolean
): string => {
  const formattedCheckIn = formatDate(checkInDate);

  if (verified) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 20px auto; }
          h1 { color: #28a745; }
          p { margin-bottom: 10px; }
          strong { color: #007bff; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Confirmed!</h1>
          <p>Hello ${name},</p>
          <p>We are delighted to inform you that your booking for <strong>${
            roomType || "N/A"
          }: ${roomNumber || "N/A"}</strong> has been successfully verified.</p>
          <p>We look forward to welcoming you on <strong>${formattedCheckIn}</strong>.</p>
          <p>Sincerely,</p>
          <p>The Bhive Hotel Team</p>
        </div>
      </body>
      </html>
    `;
  } else {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Update</title>
         <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 20px auto; }
          h1 { color: #dc3545; }
          p { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Update</h1>
          <p>Hello ${name},</p>
          <p>Unfortunately, we regret to inform you that your recent booking request for the room <strong>${
            roomType || "N/A"
          }: ${
      roomNumber || "N/A"
    }</strong> could not be verified at this time.</p>
          <p>This could be due to various reasons. We apologize for any inconvenience this may cause. Please feel free to try booking again later or contact our support if you have questions.</p>
          <p>Sincerely,</p>
          <p>The Bhive Hotel Team</p>
        </div>
      </body>
      </html>
    `;
  }
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export async function POST(req: NextRequest) {
  try {
    const { EMAIL_FROM, PASS: EMAIL_PASS } = process.env;
    if (!EMAIL_FROM || !EMAIL_PASS) {
      console.error("Missing email credentials in environment variables.");
      return NextResponse.json(
        { message: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch (parseError: unknown) {
      console.error(
        "Failed to parse request body:",
        getErrorMessage(parseError)
      );
      return NextResponse.json(
        { message: "Invalid request format. Expected JSON." },
        { status: 400 }
      );
    }

    const validationResult = emailRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      console.warn("Request body validation failed:", errors);
      return NextResponse.json(
        {
          message: "Invalid input.",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { email, name, roomId, verified, checkIn } = validationResult.data;

    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) {
      return NextResponse.json(
        { message: `Room with ID '${roomId}' not found.` },
        { status: 404 }
      );
    }

    const emailHtml = createEmailHtml(
      name,
      room.roomType,
      room.roomNumber,
      checkIn,
      verified
    );

    const message = {
      from: `Bhive Hotel <${EMAIL_FROM}>`,
      to: email,
      subject: verified
        ? "Bhive Hotel: Booking Confirmed"
        : "Bhive Hotel: Booking Update",
      html: emailHtml,
      headers: { "X-Entity-Ref-ID": `booking-notification-${Date.now()}` },
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_FROM, pass: EMAIL_PASS },
      tls: {
        rejectUnauthorized:
          process.env.NODE_ENV === "development" ? false : true,
      },
    });

    try {
      const info: SentMessageInfo = await transporter.sendMail(message);
      console.log("Email sent successfully: ", info.messageId);
      return NextResponse.json(
        { message: "Notification email sent successfully." },
        { status: 200 }
      );
    } catch (emailError: unknown) {
      console.error("Failed to send email:", getErrorMessage(emailError));

      return NextResponse.json(
        {
          message: "Failed to send notification email. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(
      "Unexpected error in email sending API:",
      getErrorMessage(error)
    );

    if (error instanceof ZodError) {
      console.error(
        "Zod validation error (unexpected):",
        error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          message: "Invalid data format.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "An unexpected server error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
