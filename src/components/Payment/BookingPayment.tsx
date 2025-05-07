"use client"

import type React from "react"

import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookingContextType } from "@/types/context"
import { BookingContext } from "../providers/BookProvider"

interface PaymentFormProps {
  paymentIntentId: string
  clientKey: string
  amount: number
  onSuccess?: (paymentIntentId: string) => void
  onCancel?: () => void
  successUrl?: string
  cancelUrl?: string
}

export default function PaymentForm({
  paymentIntentId,
  amount,
  onSuccess,
  onCancel,
  successUrl = "/payment/success",
  cancelUrl = "/",
}: PaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  })
  const { bookingContext } = useContext<BookingContextType>(BookingContext);



  // Format the amount from cents to currency
  const formattedAmount = (amount / 100).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  })

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodSelect = (value: string) => {
    setPaymentMethod(value)
    setError(null)
  }

  const validateCardDetails = () => {
    if (!cardDetails.number.trim()) {
      setError("Card number is required")
      return false
    }
    if (!cardDetails.expMonth.trim()) {
      setError("Expiration month is required")
      return false
    }
    if (!cardDetails.expYear.trim()) {
      setError("Expiration year is required")
      return false
    }
    if (!cardDetails.cvc.trim()) {
      setError("CVC is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (paymentMethod === "card" && !validateCardDetails()) {
        setIsLoading(false)
        return
      }

      if (paymentMethod === "card") {
        // Create a payment method for card
        const paymentMethodResponse = await createCardPaymentMethod()

        // Attach the payment method to the payment intent
        await attachPaymentMethod(paymentMethodResponse.id)
      } else {
        // For Gcash Ewallet
        const paymentMethodResponse = await createEWalletPaymentMethod(paymentMethod)

        // Attach the payment method to the payment intent
        const result = await attachPaymentMethod(paymentMethodResponse.id)

        // Redirect to the e-wallet checkout URL
        if (result.attributes.next_action?.redirect?.url) {
          window.location.href = result.attributes.next_action.redirect.url
          return
        }
      }

      // Handle success
      if (onSuccess) {
        onSuccess(paymentIntentId)
      } else {
        // Redirect to success page
        router.push(`${successUrl}?id=${paymentIntentId}`)
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.push(cancelUrl)
    }
  }

  const createCardPaymentMethod = async () => {
    const url = "https://api.paymongo.com/v1/payment_methods"
    const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY

    if (!publicKey) {
      throw new Error("PayMongo public key is not defined")
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(publicKey + ":")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            type: "card",
            details: {
              card_number: cardDetails.number.replace(/\s/g, ""),
              exp_month: Number.parseInt(cardDetails.expMonth),
              exp_year: Number.parseInt(cardDetails.expYear),
              cvc: cardDetails.cvc,
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error creating card payment method:", errorData)
      throw new Error(errorData.errors?.[0]?.detail || "Failed to process card")
    }

    const data = await response.json()
    return data.data
  }

  const createEWalletPaymentMethod = async (type: string) => {
    const url = "https://api.paymongo.com/v1/payment_methods"
    const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY

    if (!publicKey) {
      throw new Error("PayMongo public key is not defined")
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(publicKey + ":")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            type,
            billing: {
              name: "Customer Name",
              email: "customer@example.com",
              phone: "09123456789",
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.errors?.[0]?.detail || `Failed to process ${type}`)
    }

    const data = await response.json()
    return data.data
  }

  const attachPaymentMethod = async (paymentMethodId: string) => {
    const url = `/api/attach-payment`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.errors?.[0]?.detail || errorData.error || "Failed to attach payment method"
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.paymentIntent
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment of {bookingContext?.totalPrice}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" onValueChange={handlePaymentMethodSelect}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="gcash">
              <Wallet className="mr-2 h-4 w-4" />
              GCash
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="number">Card Number</Label>
                <Input
                  id="number"
                  name="number"
                  placeholder="4343 4343 4343 4343"
                  value={cardDetails.number}
                  onChange={handleCardInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground"></p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expMonth">Month</Label>
                  <Input
                    id="expMonth"
                    name="expMonth"
                    placeholder="MM"
                    value={cardDetails.expMonth}
                    onChange={handleCardInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expYear">Year</Label>
                  <Input
                    id="expYear"
                    name="expYear"
                    placeholder="YY"
                    value={cardDetails.expYear}
                    onChange={handleCardInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={handleCardInputChange}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay Now"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="gcash">
            <div className="mt-4 space-y-4">
              <p>You will be redirected to GCash to complete your payment.</p>
              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay with GCash"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <div className="text-sm text-muted-foreground">Secured by PayMongo</div>
      </CardFooter>
    </Card>
  )
}
