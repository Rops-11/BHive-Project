import type { Meta, StoryObj } from "@storybook/react";
import BookRoom from "@/components/LandingPage/BookRoom";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof BookRoom> = {
    title: "LandingPage/BookRoom",
    component: BookRoom,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        adults: { control: { type: "number", min: 1, max: 5 } },
        children: { control: { type: "number", min: 0, max: 4 } },
        buttonColor: { control: "color" },
        buttonText: { control: "text" },
        buttonSize: { control: { type: "select", options: ["small", "medium", "large"] } },
    },
};

export default meta;

type Story = StoryObj<typeof BookRoom>; 

// Default Story
export const Default: Story = {
    args: {},
};

// Interactive Story with Actions
export const Interactive: Story = {
    args: {
        buttonText: "Reserve Now",
        buttonColor: "#007bff",
        buttonSize: "medium",
    },
    play: () => action("Button clicked")(),
};

