import type { Meta, StoryObj } from "@storybook/react";
import FacilityGallery from "@/components/Facilities/FacilityGallery";
import { expect, within, userEvent } from "@storybook/test";

const meta = {
  title: "Facilities/FacilityGallery",
  component: FacilityGallery,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FacilityGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OpenBarModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the thumbnail with alt text "Rooftop Bar" and click it
    const barThumbnail = await canvas.findByAltText("Rooftop Bar");
    await userEvent.click(barThumbnail);

    // Wait for modal content to appear
    await expect(await canvas.findByText("Rooftop Bar")).toBeInTheDocument();
    await expect(await canvas.findByText("Enjoy breathtaking city views with our signature cocktails.")).toBeInTheDocument();
  },
};

export const OpenLoungeModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const loungeThumb = await canvas.findByAltText("Relaxing Lounge");
    await userEvent.click(loungeThumb);

    await expect(await canvas.findByText("Relaxing Lounge")).toBeInTheDocument();
    await expect(await canvas.findByText("Unwind in our plush lounge, perfect for quiet conversations.")).toBeInTheDocument();
  },
};

export const OpenCafeModal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cafeThumb = await canvas.findByAltText("Cozy Café");
    await userEvent.click(cafeThumb);

    await expect(await canvas.findByText("Cozy Café")).toBeInTheDocument();
    await expect(await canvas.findByText("Start your day right with freshly brewed coffee and pastries.")).toBeInTheDocument();
  },
};

export const CustomTitleStyle: Story = {
  args: {
    titleColor: "text-red-500",
    titleSize: "text-5xl",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const title = await canvas.findByText("Our Facilities");

    // Check that the title is visible
    await expect(title).toBeInTheDocument();

    // You can't directly test Tailwind classes unless you check className
    expect(title.className).toContain("text-red-500");
    expect(title.className).toContain("text-5xl");
  },
};

