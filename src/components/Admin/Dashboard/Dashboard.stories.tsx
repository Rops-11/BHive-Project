import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Dashboard } from "@/components/Admin/Dashboard/Dashboard";

const meta: Meta<typeof Dashboard> = {
    title: "Admin/Dashboard",
    component: Dashboard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        isLoading: { control: "boolean" },
        error: { control: "text" },
        textColor: { control: "color" },
    },
};

export default meta;

type Story = StoryObj<typeof Dashboard>;

// Default Story
export const Default: Story = {
    args: {},
};

const timeout = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// Story with interaction test
export const WithPlay: Story = {
    args: {
        isLoading: false,
        error: "",
        textColor: "#000000",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        expect(await canvas.findByText(/dashboard/i)).toBeInTheDocument();

        // check if clickable refresh button is present
        const refreshButton = await canvas.findByRole("button", { name: /refresh/i });
        expect(refreshButton).toBeInTheDocument();
        await timeout(1000); // wait for any loading state to settle
        await expect(refreshButton).toBeEnabled();
        // Refresh
        await userEvent.click(refreshButton);
        
    },
};
