
import BookingPayment from "@/components/Payment/BookingPayment";
import Invoice from "@/components/Payment/Invoice";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          width: "80%",
        }}
      >
        <div style={{ flex: 1 }}>
          <Invoice notInPaymentPage={false}/>
        </div>
        <div style={{ flex: 1 }}>
          <BookingPayment
            paymentIntentId="pi_123456789"
            clientKey="sk_test_123456789"
            amount={1000}
          />
        </div>
      </div>
    </div>
  );
}
