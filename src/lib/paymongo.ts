export async function createPaymentIntent(amount: number, currency = "PHP") {
  const url = "https://api.paymongo.com/v1/payment_intents"
  const apiKey = process.env.PAYMONGO_SECRET_KEY

  if (!apiKey) {
    throw new Error("PayMongo secret key is not defined")
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount,
          payment_method_allowed: ["card", "paymaya", "gcash"],
          payment_method_options: {
            card: { request_three_d_secure: "any" },
          },
          currency,
          capture_type: "automatic",
        },
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`PayMongo API error: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  return data.data
}

// Get payment intent details
export async function getPaymentIntent(id: string) {
  const url = `https://api.paymongo.com/v1/payment_intents/${id}`
  const apiKey = process.env.PAYMONGO_SECRET_KEY;
  if (!apiKey) {
    throw new Error("PayMongo secret key is not defined");
  }


  if (!apiKey) {
    throw new Error("PayMongo secret key is not defined")
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data.data
}

// Attach payment method to payment intent
export async function attachPaymentMethod(paymentIntentId: string, paymentMethodId: string, returnUrl: string) {
  const url = `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`
  const apiKey = process.env.PAYMONGO_SECRET_KEY

  if (!apiKey) {
    throw new Error("PayMongo secret key is not defined")
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(apiKey + ":").toString("base64")}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          payment_method: paymentMethodId,
          return_url: returnUrl,
        },
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`PayMongo API error: ${JSON.stringify(errorData)}`)
  }

  const data = await response.json()
  return data.data
}
