import {
    checkDaysDifference,
    doDateRangesOverlap,
    isOverlappingWithAny,
    findOverlappingBookings,
    formatDate,
  } from "utils/utils";
  
  describe("Utils: date and booking functions", () => {
    describe("checkDaysDifference", () => {
      it("calculates difference in days correctly", () => {
        const d1 = new Date("2025-06-01");
        const d2 = new Date("2025-06-05");
        expect(checkDaysDifference(d1, d2)).toBe(4);
      });
  
      it("returns undefined or falsy if invalid dates", () => {
        expect(checkDaysDifference(null as any, new Date())).toBeFalsy();
        expect(checkDaysDifference(new Date(), null as any)).toBeFalsy();
      });
    });
  
    describe("doDateRangesOverlap", () => {
      it("detects overlapping ranges correctly", () => {
        const a = { checkIn: new Date("2025-06-01"), checkOut: new Date("2025-06-05") };
        const b = { checkIn: new Date("2025-06-04"), checkOut: new Date("2025-06-10") };
        expect(doDateRangesOverlap(a, b)).toBe(true);
      });
  
      it("returns false if no overlap", () => {
        const a = { checkIn: new Date("2025-06-01"), checkOut: new Date("2025-06-05") };
        const b = { checkIn: new Date("2025-06-06"), checkOut: new Date("2025-06-10") };
        expect(doDateRangesOverlap(a, b)).toBe(false);
      });
    });
  
    describe("isOverlappingWithAny", () => {
      const now = new Date();
  
      it("returns false if no bookings", () => {
        expect(isOverlappingWithAny({ checkIn: now, checkOut: new Date(now.getTime() + 86400000) }, [])).toBe(false);
      });
  
      it("returns true if any booking overlaps and is future or current", () => {
        const bookings = [
          {
            checkIn: new Date(now.getTime() - 1000000),
            checkOut: new Date(now.getTime() + 1000000),
          },
        ] as any; // as Booking[]
        expect(isOverlappingWithAny({ checkIn: now, checkOut: new Date(now.getTime() + 86400000) }, bookings)).toBe(true);
      });
  
      it("ignores past bookings", () => {
        const pastBookings = [
          {
            checkIn: new Date(now.getTime() - 100000000),
            checkOut: new Date(now.getTime() - 1000000),
          },
        ] as any;
        expect(isOverlappingWithAny({ checkIn: now, checkOut: new Date(now.getTime() + 86400000) }, pastBookings)).toBe(false);
      });
    });
  
    describe("findOverlappingBookings", () => {
      it("returns overlapping bookings correctly", () => {
        const bookings = [
          {
            id: "1",
            checkIn: new Date("2025-06-01"),
            checkOut: new Date("2025-06-05"),
          },
          {
            id: "2",
            checkIn: new Date("2025-06-10"),
            checkOut: new Date("2025-06-15"),
          },
        ] as any;
  
        const overlapped = findOverlappingBookings(
          { checkIn: "2025-06-04", checkOut: "2025-06-11" },
          bookings
        );
  
        expect(overlapped.length).toBe(2);
        expect(overlapped.map(b => b.id)).toContain("1");
        expect(overlapped.map(b => b.id)).toContain("2");
      });
    });
  
    describe("formatDate", () => {
      it("formats valid date strings", () => {
        expect(formatDate("2025-06-01")).toMatch(/Jun.*2025/);
        expect(formatDate(new Date("2025-06-01"))).toMatch(/Jun.*2025/);
      });
  
      it("returns 'N/A' for undefined", () => {
        expect(formatDate(undefined)).toBe("N/A");
      });
  
      it("returns 'Invalid Date' for invalid input", () => {
        expect(formatDate("invalid-date")).toBe("Invalid Date");
      });
    });
  });
  