import { type NextRequest, NextResponse } from "next/server";
import { createPaymentIntent, getPaymentIntent } from "@/lib/paymongo";

export async function POST(request: NextRequest) {
  try {
    const { amount, metadata = {} } = await request.json();
    console.log(metadata); // please remove after metadata is used

    // Validate the request
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 (₱1.00)" },
        { status: 400 }
      );
    }

    // Create a payment
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("id");

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "PaymentIntent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the payment intent
    const paymentIntent = await getPaymentIntent(paymentIntentId);

    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.error("Error retrieving payment:", error);
    return NextResponse.json(
      { error: "Failed to retrieve payment" },
      { status: 500 }
    );
  }
}


