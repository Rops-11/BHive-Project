"use client";

import GCashCard from "@/components/Payment/GCashCard";
import InvoiceCard from "@/components/Payment/Invoice";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function InvoicePreviewPage() {
  const [paymentType, setPaymentType] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <main className="h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center">
          <div className="lg:w-3/5 xl:w-1/2 w-full">
            <InvoiceCard
              admin={false}
              paymentType={paymentType}
              selectedFile={selectedFile}
            />
          </div>

          <div className="hidden lg:flex items-center">
            <Separator
              orientation="vertical"
              className="h-3/4 bg-slate-300"
            />
          </div>

          <div className="lg:w-2/5 xl:w-1/3 w-full">
            <GCashCard
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500">
          <p>Need help? Contact us at bhive.hotel2018@gmail.com.</p>
        </footer>
      </div>
    </main>
  );
}
