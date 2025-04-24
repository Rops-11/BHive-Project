import { redirect } from "next/navigation";
import PaymentForm from "@/components/Payment/PaymentForm";
import { getPaymentIntent } from "@/lib/paymongo";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paymentIntent = await getPaymentIntent(id);

  if (!paymentIntent) {
    redirect("/");
  }

  if (paymentIntent.attributes.status === "succeeded") {
    redirect(`/payment/success?id=${id}`);
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
