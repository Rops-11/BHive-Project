import type { Meta, StoryObj } from '@storybook/react';
import FacilityBanner from "@/components/Facilities/FacilityBanner";


const meta = {
    title: 'Facilities/FacilityBanner',
    component: FacilityBanner,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof FacilityBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};