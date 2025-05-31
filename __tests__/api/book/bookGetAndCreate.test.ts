// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "utils/db";
// import { getMedia, uploadImage } from "utils/supabase/storage";
// import { GET, POST } from "@/app/api/book/route";
// import {
//   Room,
//   Booking,
//   Status,
//   PaymentStatus,
//   BookingType,
//   Prisma,
// } from "@prisma/client";

// import { StorageError } from "@supabase/storage-js";
// import { execSync } from "child_process";

// jest.mock("utils/supabase/storage", () => ({
//   getMedia: jest.fn(),
//   uploadImage: jest.fn(),
// }));

// const mockedGetMedia = getMedia as jest.MockedFunction<typeof getMedia>;
// const mockedUploadImage = uploadImage as jest.MockedFunction<
//   typeof uploadImage
// >;

// function createFormData(data: Record<string, string | File | null>): FormData {
//   const formData = new FormData();
//   for (const key in data) {
//     if (data[key] !== null) {
//       formData.append(key, data[key] as any);
//     }
//   }
//   return formData;
// }

// function createDummyFile(
//   name = "test.png",
//   size = 1024,
//   type = "image/png"
// ): File {
//   const blob = new Blob([new ArrayBuffer(size)], { type });
//   return new File([blob], name, { type });
// }

// async function cleanDatabase() {
//   const tableNames = Object.keys(Prisma.ModelName);
//   for (const tableName of tableNames) {
//     try {
//       await (prisma as any)[tableName.toLowerCase()].deleteMany({});
//     } catch (error) {
//       console.warn(
//         `Could not clean table ${tableName}: ${(error as Error).message}`
//       );
//     }
//   }
// }

// describe("Booking API Routes", () => {
//   let testRoom: Room;

//   beforeAll(async () => {
//     execSync("npm run prisma-test-migrate");
//   });

//   beforeEach(async () => {
//     await cleanDatabase();
//     mockedGetMedia.mockClear();
//     mockedUploadImage.mockClear();

//     testRoom = await prisma.room.create({
//       data: {
//         roomNumber: "101",
//         roomType: "Deluxe",
//         maxGuests: 2,
//         roomRate: 100,
//         amenities: ["Wifi", "AC"],
//       },
//     });
//   });

//   afterAll(async () => {
//     await cleanDatabase();
//     await prisma.$disconnect();
//   });

//   describe("GET /api/bookings", () => {
//     it("should fetch all bookings with images successfully", async () => {
//       const booking1Date = new Date();
//       booking1Date.setDate(booking1Date.getDate() + 1);
//       const booking2Date = new Date();
//       booking2Date.setDate(booking2Date.getDate() + 2);

//       const booking1 = await prisma.booking.create({
//         data: {
//           roomId: testRoom.id,
//           checkIn: booking1Date,
//           checkOut: new Date(booking1Date.getTime() + 24 * 60 * 60 * 1000),
//           mobileNumber: "1234567890",
//           name: "John Doe",
//           numberOfAdults: 2,
//           numberOfChildren: 0,
//           totalPrice: 100,
//         },
//       });
//       const booking2 = await prisma.booking.create({
//         data: {
//           roomId: testRoom.id,
//           checkIn: booking2Date,
//           checkOut: new Date(booking2Date.getTime() + 24 * 60 * 60 * 1000),
//           mobileNumber: "0987654321",
//           name: "Jane Doe",
//           numberOfAdults: 1,
//           numberOfChildren: 1,
//           totalPrice: 120,
//         },
//       });

//       mockedGetMedia
//         .mockResolvedValueOnce({
//           data: [{ name: "proof1.jpg" } as any],
//           error: null,
//         })
//         .mockResolvedValueOnce({ data: [], error: null });

//       const response = await GET();
//       const body = await response.json();

//       expect(response.status).toBe(200);
//       expect(body).toHaveLength(2);
//       expect(body[0].id).toBe(booking1.id);
//       expect(body[0].image).toEqual({ name: "proof1.jpg" });
//       expect(body[1].id).toBe(booking2.id);
//       expect(body[1].image).toBeNull();
//       expect(body[0].room).toBeDefined();
//       expect(mockedGetMedia).toHaveBeenCalledTimes(2);
//       expect(mockedGetMedia).toHaveBeenCalledWith("payment", booking1.id);
//       expect(mockedGetMedia).toHaveBeenCalledWith("payment", booking2.id);
//     });

//     it("should return 400 if there is an error fetching an image", async () => {
//       const bookingDate = new Date();
//       bookingDate.setDate(bookingDate.getDate() + 1);
//       await prisma.booking.create({
//         data: {
//           roomId: testRoom.id,
//           checkIn: bookingDate,
//           checkOut: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000),
//           mobileNumber: "1234567890",
//           name: "John Doe",
//           numberOfAdults: 2,
//           numberOfChildren: 0,
//           totalPrice: 100,
//         },
//       });

//       mockedGetMedia.mockResolvedValueOnce({
//         data: null,
//         error: new Error("Supabase error"),
//       });

//       const response = await GET();
//       const body = await response.json();

//       expect(response.status).toBe(400);
//       expect(body.message).toBe("Error in fetching images");
//     });

//     it("should return 500 if prisma query fails", async () => {
//       const originalFindMany = prisma.booking.findMany;
//       (prisma.booking.findMany as any) = jest
//         .fn()
//         .mockRejectedValueOnce(new Error("DB Query failed"));

//       const response = await GET();
//       const body = await response.json();

//       expect(response.status).toBe(500);
//       expect(body.error).toBe("Failed to fetch bookings");
//       expect(body.message).toBe("DB Query failed");

//       (prisma.booking.findMany as any) = originalFindMany;
//     });

//     it("should return an empty array if no bookings exist", async () => {
//       const response = await GET();
//       const body = await response.json();

//       expect(response.status).toBe(200);
//       expect(body).toEqual([]);
//       expect(mockedGetMedia).not.toHaveBeenCalled();
//     });
//   });

//   describe("POST /api/bookings", () => {
//     const baseBookingData = {
//       roomId: "",
//       checkIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
//       checkOut: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
//       mobileNumber: "1234567890",
//       name: "Test User",
//       email: "test@example.com",
//       bookingType: BookingType.Online,
//       numberOfAdults: "2",
//       numberOfChildren: "0",
//       totalPrice: "200",
//       paymentStatus: PaymentStatus.Paid,
//     };

//     it("should create a booking successfully with file upload", async () => {
//       const file = createDummyFile();
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         file,
//       });

//       mockedUploadImage.mockResolvedValue({
//         data: { path: "payment/booking_id/file_id.png" },
//         error: null,
//       });

//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });

//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(201);
//       expect(body.id).toBeDefined();
//       expect(body.name).toBe(baseBookingData.name);
//       expect(body.status).toBe(Status.Pending);
//       expect(body.paymentStatus).toBe(PaymentStatus.Paid);
//       expect(body.room.roomNumber).toBe(testRoom.roomNumber);
//       expect(mockedUploadImage).toHaveBeenCalledTimes(1);
//       expect(mockedUploadImage).toHaveBeenCalledWith("payment", body.id, file);

//       const dbBooking = await prisma.booking.findUnique({
//         where: { id: body.id },
//       });
//       expect(dbBooking).not.toBeNull();
//       expect(dbBooking?.status).toBe(Status.Pending);
//     });

//     it("should create a booking successfully without file, status Reserved", async () => {
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         paymentStatus: null,
//         file: null,
//       });

//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });

//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(201);
//       expect(body.status).toBe(Status.Reserved);

//       const dbBooking = await prisma.booking.findUnique({
//         where: { id: body.id },
//       });
//       expect(dbBooking?.paymentStatus).toBe(PaymentStatus.Paid);
//       expect(mockedUploadImage).not.toHaveBeenCalled();
//     });

//     it("should create a booking with status Pending if paymentStatus is provided, no file", async () => {
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         paymentStatus: PaymentStatus.Partial,
//         file: null,
//       });

//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });

//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(201);
//       expect(body.status).toBe(Status.Pending);
//       expect(body.paymentStatus).toBe(PaymentStatus.Partial);
//       const dbBooking = await prisma.booking.findUnique({
//         where: { id: body.id },
//       });
//       expect(dbBooking?.paymentStatus).toBe(PaymentStatus.Partial);
//       expect(mockedUploadImage).not.toHaveBeenCalled();
//     });

//     it("should return 400 for missing required fields", async () => {
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         name: null,
//       });
//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });
//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(400);
//       expect(body.message).toBe("Details provided incomplete.");
//       expect(body.missing).toContain("name");
//       const bookingsCount = await prisma.booking.count();
//       expect(bookingsCount).toBe(0);
//     });

//     it("should return 400 for invalid date format", async () => {
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         checkIn: "invalid-date",
//       });
//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });
//       const response = await POST(req);
//       const body = await response.json();
//       expect(response.status).toBe(400);
//       expect(body.message).toBe("Invalid date format.");
//     });

//     it("should return 400 for check-in date in the past", async () => {
//       const pastDate = new Date();
//       pastDate.setDate(pastDate.getDate() - 1);
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         checkIn: pastDate.toISOString(),
//       });
//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });
//       const response = await POST(req);
//       const body = await response.json();
//       expect(response.status).toBe(400);
//       expect(body.message).toBe("Check-in date cannot be in the past.");
//     });

//     it("should return 400 for check-out date not after check-in", async () => {
//       const checkInDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         checkIn: checkInDate.toISOString(),
//         checkOut: checkInDate.toISOString(),
//       });
//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });
//       const response = await POST(req);
//       const body = await response.json();
//       expect(response.status).toBe(400);
//       expect(body.message).toBe("Check-out date must be after check-in.");
//     });

//     it("should return 400 for invalid numberOfAdults", async () => {
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         numberOfAdults: "0",
//       });
//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });
//       const response = await POST(req);
//       const body = await response.json();
//       expect(response.status).toBe(400);
//       expect(body.message).toBe("Adults must be at least 1 (numeric).");
//     });

//     it("should return 409 if room is already booked for conflicting dates", async () => {
//       const checkIn = new Date(Date.now() + 24 * 60 * 60 * 1000);
//       const checkOut = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

//       await prisma.booking.create({
//         data: {
//           roomId: testRoom.id,
//           checkIn: checkIn,
//           checkOut: checkOut,
//           mobileNumber: "5555555555",
//           name: "Existing Booker",
//           numberOfAdults: 1,
//           numberOfChildren: 0,
//           totalPrice: 150,
//           status: Status.Reserved,
//         },
//       });

//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         checkIn: new Date(
//           checkIn.getTime() + 12 * 60 * 60 * 1000
//         ).toISOString(),
//         checkOut: new Date(
//           checkOut.getTime() - 12 * 60 * 60 * 1000
//         ).toISOString(),
//       });
//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });
//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(409);
//       expect(body.message).toBe(
//         "Room is already booked for the selected dates."
//       );
//       const bookingsCount = await prisma.booking.count();
//       expect(bookingsCount).toBe(1);
//     });

//     it("should rollback booking creation if image upload fails", async () => {
//       const file = createDummyFile();
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         file,
//       });

//       mockedUploadImage.mockResolvedValue({
//         data: null,
//         error: new Error("Supabase upload failed"),
//       });

//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });

//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(500);
//       expect(body.message).toContain(
//         "The booking could not be completed due to an issue with payment proof upload."
//       );
//       expect(body.details).toContain("Supabase upload failed");

//       const bookingsCount = await prisma.booking.count();
//       expect(bookingsCount).toBe(0);
//     });

//     it("should handle non-existent roomId gracefully (Prisma error)", async () => {
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: "non-existent-room-id",
//       });

//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });

//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(500);
//       expect(body.error).toBe("Failed to create booking");

//       expect(body.message).toMatch(/foreign key constraint/i);

//       const bookingsCount = await prisma.booking.count();
//       expect(bookingsCount).toBe(0);
//     });

//     it("should create booking skipping image upload if file is invalid (e.g. size 0)", async () => {
//       const invalidFile = createDummyFile("empty.txt", 0, "text/plain");
//       const formData = createFormData({
//         ...baseBookingData,
//         roomId: testRoom.id,
//         file: invalidFile,
//       });

//       const req = new NextRequest("http://localhost/api/bookings", {
//         method: "POST",
//         body: formData,
//       });

//       const consoleWarnSpy = jest
//         .spyOn(console, "warn")
//         .mockImplementation(() => {});

//       const response = await POST(req);
//       const body = await response.json();

//       expect(response.status).toBe(201);
//       expect(body.id).toBeDefined();

//       expect(body.status).toBe(Status.Pending);

//       const dbBooking = await prisma.booking.findUnique({
//         where: { id: body.id },
//       });
//       expect(dbBooking).not.toBeNull();
//       expect(dbBooking?.status).toBe(Status.Pending);

//       expect(mockedUploadImage).not.toHaveBeenCalled();
//       expect(consoleWarnSpy).toHaveBeenCalledWith(
//         expect.stringContaining(
//           `Booking ${body.id} created, but file provided was invalid or empty. Skipping image upload.`
//         )
//       );
//       consoleWarnSpy.mockRestore();
//     });
//   });
// });
