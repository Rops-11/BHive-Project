import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import PreviewRoom from "./PreviewRoom";
import { BookingContext } from "../providers/BookProvider";
import { Amenity } from "@/constants/amenities";

interface StoryRoomData {
  id: string;
  roomType?: string;
  roomNumber?: string | number;
  images?: { url: string }[] | string[];
  roomRate?: number;
  maxGuests?: number;
  amenities?: Amenity[];
}

const sampleRoomWithData: StoryRoomData = {
  id: "room-deluxe-101",
  roomType: "Deluxe King",
  roomNumber: "101",
  images: [
    {
      url: "https://via.placeholder.com/400x250/FFC107/000000?Text=Room+Image+1",
    },
    {
      url: "https://via.placeholder.com/400x250/00BCD4/FFFFFF?Text=Room+Image+2",
    },
  ],
  roomRate: 3500.0,
  maxGuests: 2,
  amenities: [
    "Free Wifi",
    "Airconditioned",
    "Television",
    "Queen Size Bed",
    "Separated CR",
    "NonExistentAmenity" as Amenity,
  ],
};

interface StoryBookingContextType {
  selectedRoom: StoryRoomData | null;
}

const meta: Meta<typeof PreviewRoom> = {
  title: "Booking/PreviewRoom",
  component: PreviewRoom,
  decorators: [
    (Story, context) => {
      const { selectedRoomDataForStory } = context.args as {
        selectedRoomDataForStory?: StoryRoomData | null;
      };

      const storyContextValue: StoryBookingContextType = {
        selectedRoom: selectedRoomDataForStory || null,
      };

      return (
        <BookingContext.Provider value={storyContextValue}>
          <div
            style={{
              margin: "20px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}>
            <Story />
          </div>
        </BookingContext.Provider>
      );
    },
  ],

  argTypes: {
    selectedRoomDataForStory: {
      control: false,
    },
  },
  parameters: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const WithRoomData: Story = {
  args: {
    selectedRoomDataForStory: sampleRoomWithData,
  },
};

export const NoRoomData: Story = {
  args: {
    selectedRoomDataForStory: null,
  },
};

export const WithMinimalData: Story = {
  args: {
    selectedRoomDataForStory: {
      id: "room-min-202",
      roomType: "Standard Room",
    },
  },
};

export const WithSpecificAmenities: Story = {
  args: {
    selectedRoomDataForStory: {
      ...sampleRoomWithData,
      id: "room-amenities-303",
      amenities: ["Free Wifi", "Television", "Unknown Amenity" as Amenity],
    },
  },
};
