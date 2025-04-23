import { NextRequest, NextResponse } from "next/server";
import { GET, POST } from "../../src/app/api/book/route";

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      data,
      options,
    })),
  },
}));

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      booking: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    })),
  };
});

jest.mock("../../utils/db", () => {
  return {
    prisma: {
      booking: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
    },
  };
});

jest.mock("zod", () => ({
  boolean: jest.fn(),
}));

describe("Booking API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/bookings", () => {
    it("should return all bookings with status 200", async () => {
      const mockBookings = [
        {
          id: "1",
          roomId: "room1",
          checkIn: "2025-05-01",
          checkOut: "2025-05-05",
          mobileNumber: "1234567890",
          name: "John Doe",
          numberOfAdults: 2,
          numberOfChildren: 1,
          totalPrice: 500,
        },
        {
          id: "2",
          roomId: "room2",
          checkIn: "2025-06-10",
          checkOut: "2025-06-15",
          mobileNumber: "0987654321",
          name: "Jane Smith",
          numberOfAdults: 1,
          numberOfChildren: 0,
          totalPrice: 300,
        },
      ];

      const { prisma } = require("../../utils/db");

      prisma.booking.findMany.mockResolvedValue(mockBookings);

      const response = await GET();

      expect(prisma.booking.findMany).toHaveBeenCalledTimes(1);
      expect(NextResponse.json).toHaveBeenCalledWith(mockBookings, {
        status: 200,
      });
      expect(response).toEqual({
        data: mockBookings,
        options: { status: 200 },
      });
    });

    it("should handle errors and return 500 status", async () => {
      const { prisma } = require("../../utils/db");

      const mockError = new Error("Database connection failed");
      prisma.booking.findMany.mockImplementation(() => {
        throw mockError;
      });

      const response = await GET();

      expect(prisma.booking.findMany).toHaveBeenCalledTimes(1);

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to fetch bookings",
          message: "Database connection failed",
        }),
        { status: 500 }
      );
    });
  });

  describe("POST /api/bookings", () => {
    const mockBookingData = {
      roomId: "room1",
      checkIn: "2025-05-01",
      checkOut: "2025-05-05",
      mobileNumber: "1234567890",
      name: "John Doe",
      numberOfAdults: 2,
      numberOfChildren: 1,
      totalPrice: 500,
    };

    const mockCreatedBooking = {
      id: "new-booking-id",
      ...mockBookingData,
      createdAt: new Date().toISOString(),
    };

    it("should create a new booking and return 201 status", async () => {
      const { prisma } = require("../../utils/db");
      const { boolean } = require("zod");

      boolean.mockReturnValue(true);

      const req = {
        json: jest.fn().mockResolvedValue(mockBookingData),
      } as unknown as NextRequest;

      prisma.booking.create.mockResolvedValue(mockCreatedBooking);

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);
      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: mockBookingData,
      });
      expect(NextResponse.json).toHaveBeenCalledWith(mockCreatedBooking, {
        status: 201,
      });
      expect(response).toEqual({
        data: mockCreatedBooking,
        options: { status: 201 },
      });
    });

    it("should return 400 when fields are missing", async () => {
      const { boolean } = require("zod");

      boolean.mockReturnValue(false);

      const incompleteData = {
        roomId: "room1",
      };

      const req = {
        json: jest.fn().mockResolvedValue(incompleteData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Details provided incomplete." },
        { status: 400 }
      );
    });

    it("should handle errors during booking creation and return 500", async () => {
      const { prisma } = require("../../utils/db");
      const { boolean } = require("zod");

      boolean.mockReturnValue(true);

      const req = {
        json: jest.fn().mockResolvedValue(mockBookingData),
      } as unknown as NextRequest;
      const mockError = new Error("Failed to create booking");
      prisma.booking.create.mockImplementation(() => {
        throw mockError;
      });

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);
      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: mockBookingData,
      });

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to book",
          message: "Failed to create booking",
        }),
        { status: 500 }
      );
    });
  });
});
