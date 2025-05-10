import type { Meta, StoryObj } from "@storybook/react";
import Invoice from "@/components/Payment/Invoice";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
