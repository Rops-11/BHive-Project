import type { Meta, StoryObj } from "@storybook/react";
import HotelRoom from "@/components/RoomTour/HotelRoomCard";

const meta = {
    title: "RoomTour/HotelRoom",
    component: HotelRoom,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof HotelRoom>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};