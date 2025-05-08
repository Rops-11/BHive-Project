import type { Meta, StoryObj } from '@storybook/react';
import { FacilityIntroText } from "@/components/Facilities/FacilityIntroText";


const meta = {
    title: 'Facilities/FacilityIntroText',
    component: FacilityIntroText,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof FacilityIntroText>;


export default meta;
type Story = StoryObj<typeof meta>;
 
export const Default: Story = {};
