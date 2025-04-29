import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";

import Header from "@/components/LandingPage/Header";

const meta = {
  title: "LandingPage/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onLogin: action("onLogin"),
    onLogout: action("onLogout"),
    onCreateAccount: action("onCreateAccount"),
    onToggleSidebar: action("onToggleSidebar"),
    onHoverNavigation: action("onHoverNavigation"),
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

// Default Story
export const Default: Story = {
  args: {
    user: null,
  },
  parameters: {
    docs: {
      description: {
        story: "This is the default state of the Header component.",
      },
    },
  },
};

// Navigation Hover
export const NavigationHover: Story = {
  args: {
    user: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const aboutTrigger = await canvas.findByText("About");

    await userEvent.hover(aboutTrigger);
    action("Hovered over 'About' navigation item")();
  },
  parameters: {
    docs: {
      description: {
        story: "This story represents hovering over the About navigation trigger to reveal dropdown content.",
      },
    },
  },
}

