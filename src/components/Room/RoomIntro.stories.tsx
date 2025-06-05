import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, } from "@storybook/test";
import { RoomIntroText } from "./RoomIntroText";

const meta = {
  title: "RoomT/RoomIntroText",
  component: RoomIntroText,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RoomIntroText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Rooms")).toBeInTheDocument();
  },
};

export const CustomBody: Story = {
  args: {
    body: "Enjoy your stay in our deluxe room with modern amenities.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Enjoy your stay in our deluxe room with modern amenities.")).toBeInTheDocument();
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Niko Avocado"
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Niko Avocado")).toBeInTheDocument();
  },
};

export const CustomTitleColor: Story = {
  args: {
    titleColor: "text-black"
  },
};

export const CustomBodyColor: Story = {
  args: {
    bodyColor: "text-red-600"
  },
};