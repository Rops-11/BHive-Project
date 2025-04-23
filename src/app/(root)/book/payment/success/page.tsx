import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/Payment/PaymentStatus";
import { getPaymentIntent } from "@/lib/paymongo";

interface SuccessPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { id } = await searchParams
  const paymentIntentId = id;

  if (!paymentIntentId) {
    redirect("/");
  }

  const paymentIntent = await getPaymentIntent(paymentIntentId);

  if (!paymentIntent) {
    redirect("/");
  }

  // Format the amount from cents to currency
  const formattedAmount = (
    paymentIntent.attributes.amount / 100
  ).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const isSuccessful = paymentIntent.attributes.status === "succeeded";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isSuccessful ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            <CheckCircle
              className={`h-8 w-8 ${
                isSuccessful ? "text-green-600" : "text-amber-600"
              }`}
            />
          </div>
          <CardTitle className="text-2xl">
            {isSuccessful ? "Payment Successful!" : "Payment Processing"}
          </CardTitle>
          <CardDescription>
            {isSuccessful
              ? "Your payment has been confirmed"
              : "We're processing your payment"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Amount:</div>
              <div className="text-right font-medium">{formattedAmount}</div>
              <div className="text-muted-foreground">Payment ID:</div>
              <div className="text-right font-mono text-xs">
                {paymentIntentId.substring(0, 12)}...
              </div>
              <div className="text-muted-foreground">Status:</div>
              <div className="text-right">
                <PaymentStatusBadge status={paymentIntent.attributes.status} />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {isSuccessful
              ? "A confirmation email has been sent to your email address."
              : "You'll receive a confirmation email once the payment is complete."}
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
