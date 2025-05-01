import type { Meta, StoryObj } from "@storybook/react";
import Invoice from "@/components/Payment/Invoice"
import InvoiceCard from "@/components/Payment/Invoice";
import { BookingContext } from "@/components/providers/BookProvider";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";
import { action } from "@storybook/addon-actions";

// Dummy router mock
const dummyRouter: AppRouterInstance = {
    push: action("router.push") as any,
    replace: action("router.replace") as any,
    forward: action("router.forward") as any,
    back: action("router.back") as any,
    prefetch: async () => {},
    refresh: action("router.refresh") as any,
  } as AppRouterInstance;
  
  // Mock BookingContext value
  const mockBookingContext = {
    roomId: "f6edec6c-65ee-4a36-b12c-d16445e3fa92",
    checkIn: new Date("2025-04-20"),
    checkOut: new Date("2025-04-22"),
    mobileNumber: "09123456789",
    name: "Sheree Laluma",
    numberOfAdults: 2,
    numberOfChildren: 1,
  };
  

const meta = {
    title: "Payment/Invoice",
    component: Invoice,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    
} satisfies Meta<typeof Invoice>;

export default meta;

type Story = StoryObj<typeof Invoice>;

export const Default: Story = {
    args: {
      router: {} as AppRouterInstance, // you may need to mock or provide a proper instance
      notInPaymentPage: false,
    },
  };
  
