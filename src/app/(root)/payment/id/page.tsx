"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import InvoiceCard from "@/components/Payment/Invoice";
import PaymentForm from "@/components/Payment/PaymentForm";
import { getPaymentIntent } from "@/lib/paymongo";

interface PaymentPageProps {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaymentIntent() {
      const intent = await getPaymentIntent(params.id);

      if (!intent) {
        redirect("/");
      }

      if (intent.attributes.status === "succeeded") {
        redirect(`/payment/success?id=${params.id}`);
      }

      setPaymentIntent(intent);
      setLoading(false);
    }

    fetchPaymentIntent();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 pt-32 flex flex-col items-center">
      {/* Invoice Section */}
      <div className="w-full max-w-3xl mb-10">
        <InvoiceCard
          invoiceNumber="INV-2025-001"
          issueDate="2025-04-17"
          dueDate="2025-04-24"
          status="Unpaid"
          customer={{
            name: "Juan Dela Cruz",
            email: "juan@example.com",
            address: "Iloilo City, Philippines",
          }}
          items={[
            { description: "Family Suite", quantity: 1, unitPrice: 3290 },
            { description: "Suite", quantity: 1, unitPrice: 2890 },
          ]}
          notes="Thank you for staying with us!"
        />
      </div>

      {/* Payment Form Section */}
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Complete Your Payment</h2>
        <PaymentForm
          paymentIntentId={paymentIntent.id}
          clientKey={paymentIntent.attributes.client_key}
          amount={paymentIntent.attributes.amount}
        />
      </div>
    </main>
  );
}
