import type { Meta, StoryObj } from "@storybook/react";
import Header from "@/components/Admin/Header/AdminHeader";
const meta: Meta<typeof Header> = {
    title: "Admin/Header",
    component: Header,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        mobileMenuOpen: { control: "boolean" },
        sideBar: { control: "boolean" },
    },
};

export default meta;

type Story = StoryObj<typeof Header>;

// Default Story
export const Default: Story = {
    args: {},
};

export const MobileMenuOpen: Story = {
    args: {
        mobileMenuOpen: true,
        sideBar: false,
    },
    parameters: {
        docs: {
            description: {
                story: "Header with mobile menu open.",
            },
        },
    },
};

export const SideBarOpen: Story = {
    args: {
        mobileMenuOpen: false,
        sideBar: true,
    },
    parameters: {
        docs: {
            description: {
                story: "Header with sidebar open.",
            },
        },
    },
};

