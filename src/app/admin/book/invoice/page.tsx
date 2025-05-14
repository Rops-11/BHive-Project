"use client";

import InvoiceCard from "@/components/Payment/Invoice";

export default function AdminInvoicePreviewPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50 py-10 px-4 pt-32">
      <InvoiceCard admin={true} />
    </main>
  );
}
