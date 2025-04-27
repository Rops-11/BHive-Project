import type { Meta, StoryObj } from "@storybook/react";
import Footer from "@/components/LandingPage/footer";


const meta = {
  title: "Example/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLinks: Story = {
    args: {
        links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
    },
};
