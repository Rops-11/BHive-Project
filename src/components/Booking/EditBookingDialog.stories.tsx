import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor } from "@storybook/testing-library";
import { expect, fn } from "@storybook/test";

import EditBookingDialog from "./EditBookingDialog";
import { Booking } from "@/types/types";

const MockNormalBookingForm = fn(() => (
  <div data-testid="mock-normal-booking-form">Mocked Normal Form Content</div>
));
const MockEditBookingRoomAndDateForm = fn(() => (
  <div data-testid="mock-edit-room-date-form">
    Mocked Room & Date Form Content
  </div>
));

const mockRefetchBookings = fn();
const mockSetIsDialogOpen = fn();

const sampleBooking: Booking = {
  id: "booking123",
  name: "Test Guest",
  roomId: "R101",
};

const meta: Meta<typeof EditBookingDialog> = {
  title: "Booking/EditBookingDialog",
  component: EditBookingDialog,
  args: {
    booking: sampleBooking,
    refetchBookings: mockRefetchBookings,
    setIsDialogOpen: mockSetIsDialogOpen,
    triggerClassName: "default-trigger-class",
  },
  parameters: {
    moduleMock: {
      "./NormalBookingForm": { default: MockNormalBookingForm },
      "./EditBookingRoomAndDateForm": {
        default: MockEditBookingRoomAndDateForm,
      },
    },
  },
  decorators: [
    (Story) => {
      mockRefetchBookings.mockClear();
      mockSetIsDialogOpen.mockClear();
      MockNormalBookingForm.mockClear();
      MockEditBookingRoomAndDateForm.mockClear();
      return <Story />;
    },

    (Story) => (
      <div style={{ padding: "2em" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof EditBookingDialog>;

export const TriggerRendersWithText_Normal: Story = {
  name: "Trigger Renders Correct Text (Normal)",
  args: { type: "normal" },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Edit Booker Details/i })
    ).toBeInTheDocument();
  },
};

export const TriggerRendersWithText_Room: Story = {
  name: "Trigger Renders Correct Text (Room)",
  args: { type: "room" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Edit Room & Date/i })
    ).toBeInTheDocument();
  },
};
