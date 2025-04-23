import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import BookRoom from '@/components/LandingPage/BookRoom';

export default {
    title: 'Components/LandingPage/BookRoom',
    component: BookRoom,
} as ComponentMeta<typeof BookRoom>;

const Template: Story<typeof BookRoom> = (args) => <BookRoom {...args} />;

export const Default = Template.bind({});
Default.args = {
    // Add default props for the BookRoom component here
};

export const WithCustomProps = Template.bind({});
WithCustomProps.args = {
    // Add custom props for a different variation of the BookRoom component here
};