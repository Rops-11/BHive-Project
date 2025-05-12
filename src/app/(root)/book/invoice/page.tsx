"use client";

import InvoiceCard from "@/components/Payment/Invoice";

export default function InvoicePreviewPage() {

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 pt-32">
      <InvoiceCard notInPaymentPage={true} />
    </main>
  );
}
