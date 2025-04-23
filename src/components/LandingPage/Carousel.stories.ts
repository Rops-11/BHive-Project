import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Carousel, { CarouselProps } from '@/components/LandingPage/Carousel';


export default {
    title: 'Components/LandingPage/Carousel',
    component: Carousel,
} as ComponentMeta<typeof Carousel>;

const Template: ComponentStory<typeof Carousel> = (args) => <Carousel {...args} />;


export const Default = Template.bind({});
Default.args = {
    items: [
        { id: 1, title: 'Slide 1', imageUrl: 'https://via.placeholder.com/800x400?text=Slide+1' },
        { id: 2, title: 'Slide 2', imageUrl: 'https://via.placeholder.com/800x400?text=Slide+2' },
        { id: 3, title: 'Slide 3', imageUrl: 'https://via.placeholder.com/800x400?text=Slide+3' },
    ],
    autoPlay: true,
    interval: 3000,
};