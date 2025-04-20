"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet } from "lucide-react";
import CardPaymentForm from "./CardPaymentForm";
import EWalletPaymentButton from "./EWalletPaymentButton";

interface PaymentTabsProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  paymentIntentId: string;
}

export default function PaymentTabs({
  paymentMethod,
  setPaymentMethod,
  isLoading,
  setIsLoading,
  error,
  setError,
  paymentIntentId,
}: PaymentTabsProps) {
  return (
    <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="card">
          <CreditCard className="mr-2 h-4 w-4" />
          Card
        </TabsTrigger>
        <TabsTrigger value="gcash">
          <Wallet className="mr-2 h-4 w-4" />
          GCash
        </TabsTrigger>
        <TabsTrigger value="paymaya">
          <Wallet className="mr-2 h-4 w-4" />
          PayMaya
        </TabsTrigger>
      </TabsList>

      <TabsContent value="card">
        <CardPaymentForm
          setIsLoading={setIsLoading}
          setError={setError}
          isLoading={isLoading}
          paymentIntentId={paymentIntentId}
        />
      </TabsContent>

      <TabsContent value="gcash">
        <EWalletPaymentButton
          type="gcash"
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          paymentIntentId={paymentIntentId}
        />
      </TabsContent>

      <TabsContent value="paymaya">
        <EWalletPaymentButton
          type="paymaya"
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setError={setError}
          paymentIntentId={paymentIntentId}
        />
      </TabsContent>
    </Tabs>
  );
}
