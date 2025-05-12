import type { Meta, StoryObj } from "@storybook/react";
import Invoice from "@/components/Payment/Invoice";

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
    notInPaymentPage: false,
  },
};
