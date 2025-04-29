import { NextRequest, NextResponse } from "next/server";
import { GET, POST } from "../../src/app/api/payment/route"; // payment handlers

// Mock next/server
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      data,
      options,
    })),
  },
}));

// Mock Prisma client
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      payment: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    })),
  };
});

// Mock custom db utility
jest.mock("../../utils/db", () => {
  return {
    prisma: {
      payment: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    },
  };
});

describe("Payment API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/payment", () => {
    
    it("should process payment successfully with valid data", async () => { 
      //happy path
      
      const paymentData = { 
        amount: 100,
        currency: "PHP",
        paymentMethod: "credit_card",
        cardDetails: {
          number: "4111111111111111",
          expiry: "12/25",
          cvv: "222",
        },
      };

      const mockCreatedPayment = { 
        id: "new-payment-id",
        ...paymentData,
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      const { prisma } = require("../../utils/db");

      prisma.payment.create.mockResolvedValue(mockCreatedPayment);

      const req = {
        json: jest.fn().mockResolvedValue(paymentData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);
      expect(prisma.payment.create).toHaveBeenCalledWith({
        data: {
          amount: paymentData.amount,
          currency: paymentData.currency,
          paymentMethod: paymentData.paymentMethod,
          cardDetails: paymentData.cardDetails,
        },
      });

      expect(NextResponse.json).toHaveBeenCalledWith(mockCreatedPayment, { status: 200 });
      expect(response).toEqual({
        data: mockCreatedPayment,
        options: { status: 200 },
      });
    });

    it("should return 400 for invalid payment data", async () => {
      //ad path
      
      const invalidPaymentData = {
        amount: -100,
        currency: "php",
        paymentMethod: "credit_card",
      };

      const req = {
        json: jest.fn().mockResolvedValue(invalidPaymentData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Invalid payment data" },
        { status: 400 }
      );
    });

    it("should handle errors during payment creation and return 500", async () => {
      //sad path
      
      const paymentData = {
        amount: 1895,
        currency: "PHP",
        paymentMethod: "credit_card",
        cardDetails: {
          number: "122134443556674",
          expiry: "12/25",
          cvv: "123",
        },
      };

      const { prisma } = require("../../utils/db");

      prisma.payment.create.mockImplementation(() => {
        throw new Error("Failed to create payment");
      });

      const req = {
        json: jest.fn().mockResolvedValue(paymentData),
      } as unknown as NextRequest;

      const response = await POST(req);

      expect(req.json).toHaveBeenCalledTimes(1);

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to process payment",
          message: "Failed to create payment",
        }),
        { status: 500 }
      );
    });
  });

  describe("GET /api/payment/:id", () => {
    
    it("should return payment details for a valid payment ID", async () => {
      //happy path
      
      const paymentId = "valid-payment-id";

      const mockPayment = {
        id: paymentId,
        amount: 100,
        currency: "USD",
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      const { prisma } = require("../../utils/db");

      prisma.payment.findUnique.mockResolvedValue(mockPayment);

      const req = {
        params: { id: paymentId },
      } as unknown as NextRequest;

      const response = await GET(req);

      expect(prisma.payment.findUnique).toHaveBeenCalledWith({
        where: { id: paymentId },
      });

      expect(NextResponse.json).toHaveBeenCalledWith(mockPayment, { status: 200 });
      expect(response).toEqual({
        data: mockPayment,
        options: { status: 200 },
      });
    });

    it("should return 404 for an invalid payment ID", async () => {
      //sad path
      
      const invalidPaymentId = "invalid-payment-id";

      const { prisma } = require("../../utils/db");

      prisma.payment.findUnique.mockResolvedValue(null);

      const req = {
        params: { id: invalidPaymentId },
      } as unknown as NextRequest;

      const response = await GET(req);

      expect(prisma.payment.findUnique).toHaveBeenCalledWith({
        where: { id: invalidPaymentId },
      });

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Payment not found" },
        { status: 404 }
      );
    });
  });
});
