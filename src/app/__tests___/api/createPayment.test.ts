// import * as handler from "@/app/api/payment/route"; 
// import { createPaymentIntent } from "@/lib/paymongo";
// import { NextRequest } from "next/server";

// // Mock of paymongo
// jest.mock("@/lib/paymongo", () => ({
//   createPaymentIntent: jest.fn(),
// }));


// function stringToReadableStream(str: string): ReadableStream<Uint8Array> {
//   const encoder = new TextEncoder();
//   const encoded = encoder.encode(str);
//   return new ReadableStream({
//     start(controller) {
//       controller.enqueue(encoded);
//       controller.close();
//     },
//   });
// }


// function createNextRequest(body: any): NextRequest {
//   const jsonString = JSON.stringify(body);
//   const stream = stringToReadableStream(jsonString);

//   return new NextRequest("http://localhost/api/payment", {
//     method: "POST",
//     body: stream,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// describe("POST /api/payment", () => {
//   it("returns 200 and paymentIntent info (happy path)", async () => {
//     const mockPaymentIntent = {
//       id: "test_intent_123",
//       attributes: {
//         client_key: "test_client_key",
//       },
//     };

//     (createPaymentIntent as jest.Mock).mockResolvedValue(mockPaymentIntent);

//     const request = createNextRequest({ amount: 500 });
//     const response = await handler.POST(request);
//     const json = await response.json();

//     expect(response.status).toBe(200);
//     expect(json.paymentIntentId).toBe("test_intent_123");
//     expect(json.clientKey).toBe("test_client_key");
//   });

//   it("returns 400 if amount is missing", async () => {
//     const request = createNextRequest({});
//     const response = await handler.POST(request);
//     const json = await response.json();

//     expect(response.status).toBe(400);
//     expect(json.error).toBe("Invalid amount. Minimum amount is 100 (₱1.00)");
//   });

//   it("returns 500 if createPaymentIntent throws error", async () => {
//     (createPaymentIntent as jest.Mock).mockRejectedValue(new Error("Boom"));

//     const request = createNextRequest({ amount: 1000 });
//     const response = await handler.POST(request);
//     const json = await response.json();

//     expect(response.status).toBe(500);
//     expect(json.error).toBe("Failed to create payment");
//   });
// });
