import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    // Get the PayMongo signature from the headers
    const paymongoSignature = request.headers.get("paymongo-signature")

    if (!paymongoSignature) {
      return NextResponse.json({ error: "Missing PayMongo signature" }, { status: 401 })
    }

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("PayMongo webhook secret is not defined")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Get the raw request body
    const rawBody = await request.text()

    // Verify the signature
    const computedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex")

    if (computedSignature !== paymongoSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody)
    const event = payload.data

    // Handle different event types
    switch (event.attributes.type) {
      case "payment.paid":
        // Handle successful payment
        console.log("Payment successful:", event.attributes.data.id)
        // Update your database, send confirmation emails, etc.
        break

      case "payment.failed":
        // Handle failed payment
        console.log("Payment failed:", event.attributes.data.id)
        // Update your database, send notification emails, etc.
        break

      // Add more event types as needed
      default:
        console.log("Unhandled event type:", event.attributes.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
