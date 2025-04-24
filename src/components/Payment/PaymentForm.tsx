"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentTabs from "./PaymentTabs";
import PaymentErrorAlert from "./PaymentErrorAlert";

interface PaymentFormProps {
  paymentIntentId: string;
  clientKey: string;
  amount: number;
}

export default function PaymentForm({
  paymentIntentId,
  // clientKey, // Uncomment when needed.
  amount,
}: PaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const formattedAmount = (amount / 100).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const handlePaymentMethodSelect = (value: string) => {
    setPaymentMethod(value);
    setError(null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment of {formattedAmount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentTabs
          paymentMethod={paymentMethod}
          setPaymentMethod={handlePaymentMethodSelect}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          error={error}
          setError={setError}
          paymentIntentId={paymentIntentId}
        />
        {error && <PaymentErrorAlert error={error} />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}>
          Back
        </Button>
        <div className="text-sm text-muted-foreground">Secured by PayMongo</div>
      </CardFooter>
    </Card>
  );
}
