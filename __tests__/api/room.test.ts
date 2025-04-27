
import { GET, POST } from "@/app/api/room/route";
import { NextRequest } from "next/server";

jest.mock("@prisma/client", () => {
  const mockRoomFindMany = jest.fn();
  const mockRoomCreate = jest.fn();

  return {
    PrismaClient: jest.fn(() => ({
      room: {
        findMany: mockRoomFindMany,
        create: mockRoomCreate,
      },
      $disconnect: jest.fn(),
    })),
    mockRoomFindMany,
    mockRoomCreate,
  };
});


const { PrismaClient, mockRoomFindMany, mockRoomCreate } = require("@prisma/client");

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: data,
      status: options?.status,
    })),
  },
}));

describe("Room API", () => {
  const mockRooms = [
    {
      id: "1",
      roomType: "Deluxe",
      roomNumber: "101",
      isAvailable: true,
      maxGuests: 2,
      roomRate: 200,
    },
  ];

  const mockRoomData = {
    roomType: "Suite",
    roomNumber: "201",
    isAvailable: true,
    maxGuests: 4,
    roomRate: 350,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/rooms", () => {
    it("should return all rooms with status 200", async () => {
      mockRoomFindMany.mockResolvedValue(mockRooms);

      const response = await GET();

      expect(mockRoomFindMany).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        json: mockRooms,
        status: 200,
      });
    });

    it("should handle errors and return 500 status", async () => {
      mockRoomFindMany.mockRejectedValue(new Error("Database error"));

      const response = await GET();

      expect(mockRoomFindMany).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        json: expect.objectContaining({
          error: "Failed to fetch rooms",
        }),
        status: 500,
      });
    });
  });

  describe("POST /api/rooms", () => {
    it("should create a new room and return 201 status", async () => {
      const mockCreatedRoom = { id: "3", ...mockRoomData };
      mockRoomCreate.mockResolvedValue(mockCreatedRoom);

      const req = {
        json: jest.fn().mockResolvedValue(mockRoomData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);
      expect(mockRoomCreate).toHaveBeenCalledWith({
        data: mockRoomData,
      });
      expect(response).toEqual({
        json: mockCreatedRoom,
        status: 201,
      });
    });

    it("should handle validation errors and return 500 status", async () => {
      const invalidData = { roomNumber: "201" };
      mockRoomCreate.mockRejectedValue(new Error("Validation error"));

      const req = {
        json: jest.fn().mockResolvedValue(invalidData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(response).toEqual({
        json: expect.objectContaining({
          error: "Failed to create room",
        }),
        status: 500,
      });
    });

    it("should handle database errors and return 500 status", async () => {
      mockRoomCreate.mockRejectedValue(new Error("Database error"));

      const req = {
        json: jest.fn().mockResolvedValue(mockRoomData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(response).toEqual({
        json: expect.objectContaining({
          error: "Failed to create room",
        }),
        status: 500,
      });
    });
  });
});