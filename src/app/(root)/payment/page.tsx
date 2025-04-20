import BookingPayment from "@/components/Payment/BookingPayment";
import Invoice from "@/components/Payment/Invoice";

export default function PaymentPage() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", width: "80%" }}>
                <div style={{ flex: 1 }}>
                    <Invoice 
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
