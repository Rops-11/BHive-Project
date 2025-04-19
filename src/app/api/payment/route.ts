import { type NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/paymongo";

export async function POST(request: NextRequest) {
  try {
    const { amount, metadata = {} } = await request.json();

    // Validate the request
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 (₱1.00)" },
        { status: 400 }
      );
    }

    // Create a payment intent with PayMongo
    const paymentIntent = await createPaymentIntent(amount);

    return NextResponse.json({
      paymentIntentId: paymentIntent.id,
      clientKey: paymentIntent.attributes.client_key,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
