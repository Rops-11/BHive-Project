"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentErrorAlertProps {
  error: string;
}

export default function PaymentErrorAlert({ error }: PaymentErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
