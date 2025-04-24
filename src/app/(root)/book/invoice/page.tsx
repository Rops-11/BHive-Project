"use client";

import InvoiceCard from "@/components/Payment/Invoice";
import { useRouter } from "next/navigation";

export default function InvoicePreviewPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 pt-32">
      <InvoiceCard router={router} notInPaymentPage={true} />
    </main>
  );
}
