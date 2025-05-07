"use client";

import { useState, useEffect, useContext } from "react";
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
import { BookingContextType } from "@/types/context";
import { BookingContext } from "../providers/BookProvider";

interface PaymentFormProps {
  paymentIntentId: string;
  invoiceId: string;
}

export default function PaymentForm({
  paymentIntentId,
  invoiceId,
}: PaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [amount, setAmount] = useState<number | null>(null);
  const { bookingContext } = useContext<BookingContextType>(BookingContext);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/invoices/${invoiceId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch invoice details");
        }
        const data = await response.json();
        setAmount(data.amount);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  useEffect(() => {
    const formattedAmount = bookingContext?.totalPrice
      ? (bookingContext.totalPrice / 100).toLocaleString("en-PH", {
          style: "currency",
          currency: "PHP",
        })
      : "Loading...";
    if (bookingContext?.totalPrice) {
      setAmount(bookingContext.totalPrice / 100);
    }
  }, [bookingContext]);

  const handlePaymentMethodSelect = (value: string) => {
    setPaymentMethod(value);
    setError(null);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Complete your payment of {amount} for this invoice.
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
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <div className="text-sm text-muted-foreground">Secured by PayMongo</div>
      </CardFooter>
    </Card>
  );
}
