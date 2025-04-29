import type { Meta, StoryObj } from "@storybook/react";
import Carousel from "@/components/LandingPage/Carousel";

const meta: Meta<typeof Carousel> = {
    title: "LandingPage/Carousel",
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