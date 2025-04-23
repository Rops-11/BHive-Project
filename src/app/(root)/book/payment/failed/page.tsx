import Link from "next/link";
import { XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FailedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Your payment was not successful. This could be due to insufficient
            funds, an expired card, or a temporary issue with the payment
            provider.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Please try again or use a different payment method.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            asChild
            className="w-full">
            <Link href="/">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
