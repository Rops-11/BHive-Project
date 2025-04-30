import type { Meta, StoryObj } from "@storybook/react";
import FacilityGallery from "@/components/Facilities/FacilityGallery";


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


