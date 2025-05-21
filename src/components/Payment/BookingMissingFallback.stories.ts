import type { Meta, StoryObj } from "@storybook/react";
import BookingMissingFallback from "@/components/Payment/BookingMissingFallback";

const meta = {
  title: "Booking/BookingMissingFallback",
  component: BookingMissingFallback,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BookingMissingFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
