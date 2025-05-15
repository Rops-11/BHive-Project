import type { Meta, StoryObj } from "@storybook/react";
import RoomBanner from "@/components/Room/RoomBanner";

const meta = {
  title: "RoomTour/RoomBanner",
  component: RoomBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RoomBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
