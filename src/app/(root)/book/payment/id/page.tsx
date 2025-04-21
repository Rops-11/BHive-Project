import { redirect } from "next/navigation";
import PaymentForm from "@/components/Payment/PaymentForm";
import { getPaymentIntent } from "@/lib/paymongo";

interface PaymentPageProps {
  params: {
    id: string;
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const paymentIntent = await getPaymentIntent(params.id);

  if (!paymentIntent) {
    redirect("/");
  }

  // If payment is already completed, redirect to success page
  if (paymentIntent.attributes.status === "succeeded") {
    redirect(`/payment/success?id=${params.id}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-3xl font-bold mb-8">Complete Your Payment</h1>
      <PaymentForm
        paymentIntentId={paymentIntent.id}
        clientKey={paymentIntent.attributes.client_key}
        amount={paymentIntent.attributes.amount}
      />
    </div>
  );
}
