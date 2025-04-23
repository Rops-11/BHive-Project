import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BookRoom from '@/components/LandingPage/BookRoom';

const bookRoomMeta: ComponentMeta<typeof BookRoom> = {
  title: 'Components/LandingPage/BookRoom',
  component: BookRoom,
};

export default bookRoomMeta;

const Template: ComponentStory<typeof BookRoom> = () => <BookRoom />;

export const Default = Template.bind({});
