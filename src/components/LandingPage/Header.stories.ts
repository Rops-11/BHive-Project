import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Header from "@/components/LandingPage/Header";

const meta = {
  title: "Example/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    onLogin: action("onLogin"),
    onLogout: action("onLogout"),
    onCreateAccount: action("onCreateAccount"),
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

// LoggedIn story
export const LoggedIn: Story = {
  args: {
    user: {
      name: "Bhive",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "This story represents the Header when a user is logged in.",
      },
    },
  },
};

// LoggedOut story
export const LoggedOut: Story = {
  args: {
    user: null,
  },
  parameters: {
    docs: {
      description: {
        story: "This story represents the Header when no user is logged in.",
      },
    },
  },
};
