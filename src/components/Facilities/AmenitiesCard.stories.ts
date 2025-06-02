import type { Meta, StoryObj } from '@storybook/react';
import ExploreFacilities from '@/components/Facilities/AmenitiesCard';


const meta = {
    title: 'Facilities/AmenitiesCard',
    component: ExploreFacilities,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof ExploreFacilities>;


export default meta;
type Story = StoryObj<typeof meta>;     

export const Default: Story = {};


