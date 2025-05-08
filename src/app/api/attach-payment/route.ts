import { type NextRequest, NextResponse } from "next/server"
import { attachPaymentMethod } from "@/lib/paymongo"

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, paymentMethodId } = await request.json()

    // Validate the request
    if (!paymentIntentId || !paymentMethodId) {
      return NextResponse.json({ error: "Payment intent ID and payment method ID are required" }, { status: 400 })
    }

    const returnUrl = `${process.env.APP_URL || "http://localhost:3000"}/payment/success`

    // Attach the payment method to the payment intent
    const paymentIntent = await attachPaymentMethod(paymentIntentId, paymentMethodId, returnUrl)

    return NextResponse.json({
      paymentIntent: paymentIntent,
    })
  } catch (error) {
    console.error("Error attaching payment method:", error)
    return NextResponse.json({ error: "Failed to attach payment method" }, { status: 500 })
  }
}
