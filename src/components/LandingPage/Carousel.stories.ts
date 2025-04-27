import type { Meta, StoryObj } from "@storybook/react";
import Carousel from "@/components/LandingPage/Carousel";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Carousel> = {
    title: "Example/Carousel",
    component: Carousel,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        currentIndex: { control: { type: "number", min: 0, max: 2 } },
        fontFamily: { control: "text" },
        textColor: { control: "color" },
    },
};

export default meta;

type Story = StoryObj<typeof Carousel>; 


// Default Story
export const Default: Story = {
    args: {},
};

// Styled Text Story  
export const StyledText: Story = {
    args: {
        fontFamily: "'Courier New', monospace",
        textColor: "orange",
    },
    play: async () => {
        action("Text style changed")();
    },
};

// Interactive Theme Story  
export const InteractiveTheme: Story = {
    args: {
        fontFamily: "'Times New Roman', serif",
        textColor: "#008CBA",
    },
    play: async () => {
        action("Theme toggled")();
    },
};

export const FullyCustomizable: Story = {
    args: {
        fontFamily: "'Georgia', serif",
        textColor: "#FF4500",
    },
    play: async () => {
        action("Fully customizable")();
    }
};
