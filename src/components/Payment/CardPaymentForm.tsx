"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface CardPaymentFormProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    paymentIntentId: string;
}

export default function CardPaymentForm({
    isLoading,
    setIsLoading,
    setError,
    paymentIntentId,
}: CardPaymentFormProps) {
    const router = useRouter();
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expMonth: "",
        expYear: "",
        cvc: "",
    });

    const filterNumericInput = (value: string) => {
        return value.replace(/\D/g, ""); // Remove non-digits
    };

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const filteredValue = name === "number" || name === "cvc" ? filterNumericInput(value) : value;
        setCardDetails((prev) => ({
            ...prev,
            [name]: filteredValue,
        }));
    };

    const validateCardDetails = () => {
        if (!cardDetails.number.trim()) {
            setError("Card number is required");
            return false;
        }
        if (!cardDetails.expMonth.trim()) {
            setError("Expiration month is required");
            return false;
        }
        if (!cardDetails.expYear.trim()) {
            setError("Expiration year is required");
            return false;
        }
        if (!cardDetails.cvc.trim()) {
            setError("CVC is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!validateCardDetails()) {
                setIsLoading(false);
                return;
            }

            // create card payment method
            const paymentMethodResponse = await createCardPaymentMethod();

            // attach it
            await attachPaymentMethod(paymentMethodResponse.id);

            router.push(`/payment/success?id=${paymentIntentId}`);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const createCardPaymentMethod = async () => {
        const url = "https://api.paymongo.com/v1/payment_methods";
        const publicKey = process.env.NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY;
        if (!publicKey) throw new Error("PayMongo public key is not defined");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${btoa(publicKey + ":")}`,
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        type: "card",
                        details: {
                            card_number: cardDetails.number.replace(/\s/g, ""),
                            exp_month: parseInt(cardDetails.expMonth),
                            exp_year: parseInt(cardDetails.expYear),
                            cvc: cardDetails.cvc,
                        },
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors?.[0]?.detail || "Failed to create card payment method");
        }

        const data = await response.json();
        return data.data;
    };

    const attachPaymentMethod = async (paymentMethodId: string) => {
        const response = await fetch("/api/attach-payment-method", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId, paymentMethodId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to attach payment method");
        }

        const data = await response.json();
        return data.paymentIntent;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
                <Label htmlFor="number">Card Number</Label>
                <Input
                    id="number"
                    name="number"
                    placeholder="4343 4343 4343 4343"
                    value={cardDetails.number}
                    onChange={handleCardInputChange}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                />
                <p className="text-xs text-muted-foreground">For testing: 4343 4343 4343 4345</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="expMonth">Month</Label>
                    <select
                        id="expMonth"
                        name="expMonth"
                        value={cardDetails.expMonth}
                        onChange={handleCardInputChange}
                        required
                        className="border rounded px-2 py-1 w-full"
                    >
                        <option value="" disabled>
                            MM
                        </option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {String(i + 1).padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expYear">Year</Label>
                    <Input
                        id="expYear"
                        name="expYear"
                        placeholder="YY"
                        value={cardDetails.expYear}
                        onChange={handleCardInputChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                        id="cvc"
                        name="cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={handleCardInputChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay Now"}
            </Button>
        </form>
    );
}
