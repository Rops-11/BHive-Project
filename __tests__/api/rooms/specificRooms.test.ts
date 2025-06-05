import { PrismaClient } from "@prisma/client";
import { GET, PUT, DELETE } from "@/app/api/room/specific/[id]/route";
import { NextRequest } from "next/server";

jest.mock("utils/supabase/storage", () => ({
  getMedia: jest.fn(),
  uploadImage: jest.fn(),
  deleteFile: jest.fn(),
}));

import { getMedia, uploadImage, deleteFile } from "utils/supabase/storage";

const prisma = new PrismaClient();

describe("Room API /api/room/[id]", () => {
  let testRoomId: string;

  beforeAll(async () => {
    // Clean up and create a test room
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();

    const room = await prisma.room.create({
      data: {
        roomType: "TestType",
        roomNumber: "T-101",
        maxGuests: 3,
        roomRate: 200,
        amenities: ["wifi", "tv"],
      },
    });
    testRoomId = room.id;
  });

  afterAll(async () => {
    await prisma.room.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET /api/room/[id]", () => {
    it("returns room details for existing room", async () => {
      const mockParams = Promise.resolve({ id: testRoomId });
      const req = new NextRequest(`http://localhost/api/room/${testRoomId}`);

      const res = await GET(req, { params: mockParams });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe(testRoomId);
      expect(data.roomType).toBe("TestType");
    });

    it("returns 404 if room not found", async () => {
      // Use a valid UUID string for non-existent room id
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const mockParams = Promise.resolve({ id: nonExistentId });
      const req = new NextRequest(`http://localhost/api/room/${nonExistentId}`);

      const res = await GET(req, { params: mockParams });
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe("Room not found");
    });
  });

  describe("PUT /api/room/[id]", () => {
    beforeEach(() => {
      // Mock Supabase Storage functions
      (getMedia as jest.Mock).mockResolvedValue({ data: [], error: null });
      (uploadImage as jest.Mock).mockResolvedValue({
        data: { path: "fake/path" },
        error: null,
      });
      (deleteFile as jest.Mock).mockResolvedValue({ error: null });
    });

    it("updates a room and returns updated room with images", async () => {
      const formData = new FormData();
      formData.append("roomType", "UpdatedType");
      formData.append("roomNumber", "T-202");
      formData.append("maxGuests", "4");
      formData.append("roomRate", "300");
      formData.append("amenities", "wifi");
      formData.append("amenities", "pool");
      // No files attached for this test

      const req = new NextRequest(`http://localhost/api/room/${testRoomId}`, {
        method: "PUT",
        body: formData,
      });

      const mockParams = Promise.resolve({ id: testRoomId });

      const res = await PUT(req, { params: mockParams });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.roomType).toBe("UpdatedType");
      expect(data.roomNumber).toBe("T-202");
      expect(data.maxGuests).toBe(4);
      expect(data.roomRate).toBe(300);
      expect(data.amenities).toEqual(["wifi", "pool"]);
      expect(data.images).toBeDefined();
    });
  });

  describe("DELETE /api/room/[id]", () => {
    beforeEach(() => {
      (getMedia as jest.Mock).mockResolvedValue({
        data: [{ name: "image1.png" }],
        error: null,
      });
      (deleteFile as jest.Mock).mockResolvedValue({ error: null });
    });

    it("deletes a room and associated images", async () => {
      // Create a room to delete
      const roomToDelete = await prisma.room.create({
        data: {
          roomType: "DeleteType",
          roomNumber: "D-101",
          maxGuests: 2,
          roomRate: 150,
          amenities: [],
        },
      });

      const mockParams = Promise.resolve({ id: roomToDelete.id });
      const req = new NextRequest(
        `http://localhost/api/room/${roomToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const res = await DELETE(req, { params: mockParams });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe("Room successfully deleted");

      // Verify room is deleted from DB
      const deletedRoom = await prisma.room.findUnique({
        where: { id: roomToDelete.id },
      });
      expect(deletedRoom).toBeNull();
    });
  });
});
