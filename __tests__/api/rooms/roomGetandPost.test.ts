import { GET, POST } from "@/app/api/room/route";
import { prisma } from "utils/db";
import { createClient as originalCreateClient } from "utils/supabase/server";
import { uploadImage, getMedia } from "utils/supabase/storage";
import { NextRequest } from "next/server";

function createFormData(data: Record<string, string | Blob | null>) {
  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null) {
      formData.append(key, data[key] as string | Blob);
    }
  }
  return formData;
}

function createDummyFile(
  name = "room_test.png",
  size = 1024,
  type = "image/png"
): File {
  const blob = new Blob([new ArrayBuffer(size)], { type });
  return new File([blob], name, { type });
}

jest.mock("utils/supabase/storage", () => ({
  uploadImage: jest.fn(),
  getMedia: jest.fn(),
}));

jest.mock("utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("Room API Integration", () => {
  let roomIdToCleanup: string | null = null;

  beforeEach(async () => {
    await prisma.booking.deleteMany({});
    await prisma.room.deleteMany({});
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (roomIdToCleanup) {
      await prisma.room.delete({ where: { id: roomIdToCleanup } });
      roomIdToCleanup = null;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/room", () => {
    it("should fetch rooms with images from Supabase", async () => {
      const room = await prisma.room.create({
        data: {
          roomType: "Test GET",
          roomNumber: "1001",
          maxGuests: 2,
          roomRate: 120,
          amenities: ["AC", "Wi-Fi"],
        },
      });

      (getMedia as jest.Mock).mockResolvedValue({
        data: [{ name: "test-img.png", url: "https://example.com/test-img.png" }],
        error: null,
      });

      const res = await GET();
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body[0].roomNumber).toBe("1001");
      expect(body[0].images[0].name).toBe("test-img.png");
    });
  });

  describe("POST /api/room", () => {
    it("should create a room and upload files to Supabase", async () => {
      const dummyFile = createDummyFile();

      (uploadImage as jest.Mock).mockResolvedValue({
        data: { path: "rooms/test-room-id/test-img.png" },
        error: null,
      });

      (originalCreateClient as jest.Mock).mockResolvedValue({
        storage: {
          from: () => ({
            remove: jest.fn().mockResolvedValue({ error: null }),
            list: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        },
      });

      const formData = createFormData({
        roomType: "Suite",
        roomNumber: "POST123",
        maxGuests: "3",
        roomRate: "200.50",
        amenities: "Wi-Fi",
        files: dummyFile,
      });

      const req = new NextRequest("http://localhost/api/room", {
        method: "POST",
        body: formData,
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.roomType).toBe("Suite");
      expect(body.roomNumber).toBe("POST123");

      roomIdToCleanup = body.id;

      const dbRoom = await prisma.room.findUnique({ where: { id: body.id } });
      expect(dbRoom).not.toBeNull();
    });

    it("should return 400 if no files are provided", async () => {
      const formData = createFormData({
        roomType: "Suite",
        roomNumber: "NoFile123",
        maxGuests: "2",
        roomRate: "100",
        amenities: "Wi-Fi",
        files: null,
      });

      const req = new NextRequest("http://localhost/api/room", {
        method: "POST",
        body: formData,
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body.message).toBe("No files provided");
    });

    it("should rollback and delete room on image upload failure", async () => {
      (uploadImage as jest.Mock).mockResolvedValue({
        data: null,
        error: new Error("Upload failed"),
      });

      (originalCreateClient as jest.Mock).mockResolvedValue({
        storage: {
          from: () => ({
            remove: jest.fn().mockResolvedValue({ error: null }),
            list: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        },
      });

      const formData = createFormData({
        roomType: "Rollback",
        roomNumber: "FailRoom",
        maxGuests: "2",
        roomRate: "120",
        amenities: "AC",
        files: createDummyFile(),
      });

      const req = new NextRequest("http://localhost/api/room", {
        method: "POST",
        body: formData,
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(403);
      expect(body.error).toMatch(/upload one or more images/i);

      const room = await prisma.room.findFirst({
        where: { roomNumber: "FailRoom" },
      });
      expect(room).toBeNull(); // Confirm rollback
    });
  });
});
