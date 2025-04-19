"use client";

import InvoiceCard from "@/components/Invoice";

export default function InvoicePreviewPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 pt-32">
      {/*hardcode for preview :))*/}
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
        notes="Thank you for staying with us !"
      />
    </main>
  );
}


