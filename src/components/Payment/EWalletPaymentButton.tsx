"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EWalletPaymentButtonProps {
  type: "gcash" | "paymaya";
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  paymentIntentId: string;
}

export default function EWalletPaymentButton({
  type,
  isLoading,
  setIsLoading,
  setError,
  paymentIntentId,
}: EWalletPaymentButtonProps) {
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const paymentMethodResponse = await createEWalletPaymentMethod(type);
      const result = await attachPaymentMethod(paymentMethodResponse.id);

      if (result.attributes.next_action?.redirect?.url) {
        window.location.href = result.attributes.next_action.redirect.url;
        return;
      }

      router.push(`/payment/success?id=${paymentIntentId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createEWalletPaymentMethod = async (type: string) => {
    const url = "https://api.paymongo.com/v1/payment_methods";
    const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY;
    if (!publicKey) throw new Error("PayMongo public key is not defined");

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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.detail || `Failed to process ${type}`);
    }

    const data = await response.json();
    return data.data;
  };

  const attachPaymentMethod = async (paymentMethodId: string) => {
    const response = await fetch("/api/attach-payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId, paymentMethodId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to attach payment method");
    }

    const data = await response.json();
    return data.paymentIntent;
  };

  return (
    <div className="mt-4 space-y-4">
      <p>You will be redirected to {type.toUpperCase()} to complete your payment.</p>
      <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : `Pay with ${type.toUpperCase()}`}
      </Button>
    </div>
  );
}
