import type { Meta, StoryObj } from "@storybook/react";
import ExploreFacilities from "@/components/LandingPage/ExploreFacilities";
import { action } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";

const meta = {
    title: "LandingPage/ExploreFacilities",
    component: ExploreFacilities,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    args: {
        onExploreClick: action("onExploreClick"),
        onHoverFacility: action("onHoverFacility"),
    },
} satisfies Meta<typeof ExploreFacilities>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const exploreButton = await canvas.getByRole("link", { name: /rooms/i });
        await userEvent.click(exploreButton);
    },
};
