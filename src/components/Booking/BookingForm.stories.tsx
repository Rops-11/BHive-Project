import React, { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { within, waitFor } from "@storybook/testing-library";
import { expect, fn } from "@storybook/test";
import { format } from "date-fns";

import BookingForm from "./BookingForm";
import { Room, Booking } from "@/types/types";
import { BookingContextType } from "@/types/context";
import { BookingContext } from "../providers/BookProvider";

const mockToastError = fn();
const mockToastInfo = fn();
const mockRouterPush = fn();
const mockRouterBack = fn();
const mockSetBookingContext = fn<
  [React.SetStateAction<Booking | undefined>],
  void
>();
const mockSetSelectedRoom = fn<
  [React.SetStateAction<Room | undefined>],
  void
>();
const mockGetAvailableRoomsWithDate =
  fn<
    (
      from: Date,
      to: Date,
      options?: { returnPromiseResult?: boolean }
    ) => Promise<Room[]>
  >();

const sampleRooms: Room[] = [
  {
    id: "qbr101",
    roomNumber: "101",
    roomType: "Queen Bee Room",
    maxGuests: 2,
    roomRate: 3500,
    amenities: ["AC", "TV"],
  },
  {
    id: "qbr102",
    roomNumber: "102",
    roomType: "Queen Bee Room",
    maxGuests: 2,
    roomRate: 3500,
    amenities: ["AC", "TV"],
  },
  {
    id: "sui201",
    roomNumber: "201",
    roomType: "Suite",
    maxGuests: 3,
    roomRate: 5500,
    amenities: ["AC", "TV", "Mini-bar"],
  },
  {
    id: "std001",
    roomNumber: "S01",
    roomType: "Single Standard",
    maxGuests: 1,
    roomRate: 2000,
    amenities: ["AC"],
  },
];

const todayForComponentDefault = new Date(new Date().setHours(0, 0, 0, 0));
const tomorrowForComponentDefault = new Date(
  new Date(todayForComponentDefault).setDate(
    todayForComponentDefault.getDate() + 1
  )
);

interface BookingFormStoryArgs extends ComponentProps<typeof BookingForm> {
  mockedRoomsLoading?: boolean;
  mockedAvailableRooms?: Room[];
  initialBookingData?: Partial<Booking>;
  initialSelectedRoom?: Room;
}

const meta: Meta<BookingFormStoryArgs> = {
  title: "Booking/BookingForm",
  component: BookingForm,
  parameters: {
    moduleMock: {
      "react-toastify": {
        toast: { error: mockToastError, info: mockToastInfo },
        ToastContainer: () => <div />,
      },
      "next/navigation": {
        useRouter: () => ({
          push: mockRouterPush,
          back: mockRouterBack,
          pathname: "/",
        }),
      },
      "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate": {
        default: () => ({
          getAvailableRoomsWithDate: mockGetAvailableRoomsWithDate,
          loading: meta.args?.mockedRoomsLoading ?? false,
          availableRoomsWithDate:
            meta.args?.mockedAvailableRooms ?? sampleRooms,
        }),
      },
      "@/hooks/roomHooks/useSeparateRoomsByType": {
        default: (rooms: Room[] | undefined) => {
          if (!rooms)
            return {
              queenBeeRooms: [],
              suites: [],
              familySuites: [],
              singleStandardRooms: [],
              singleDeluxeRooms: [],
              twinBeeRooms: [],
            };
          return {
            queenBeeRooms: rooms.filter((r) => r.roomType === "Queen Bee Room"),
            suites: rooms.filter((r) => r.roomType === "Suite"),
            familySuites: rooms.filter((r) => r.roomType === "Family Suite"),
            singleStandardRooms: rooms.filter(
              (r) => r.roomType === "Single Standard"
            ),
            singleDeluxeRooms: rooms.filter(
              (r) => r.roomType === "Single Deluxe"
            ),
            twinBeeRooms: rooms.filter((r) => r.roomType === "Twin Bee Room"),
          };
        },
      },
    },
  },
  args: {
    type: "Guest",
    mockedRoomsLoading: false,
    mockedAvailableRooms: sampleRooms,
    initialBookingData: {},
    initialSelectedRoom: undefined,
  },
  decorators: [
    (Story, context) => {
      mockToastError.mockClear();
      mockToastInfo.mockClear();
      mockRouterPush.mockClear();
      mockRouterBack.mockClear();
      mockSetBookingContext.mockClear();
      mockSetSelectedRoom.mockClear();
      mockGetAvailableRoomsWithDate.mockClear();
      mockGetAvailableRoomsWithDate.mockImplementation(async () =>
        Promise.resolve(context.args.mockedAvailableRooms || sampleRooms)
      );
      const [bookingData, setBookingData] = React.useState<Booking | undefined>(
        context.args.initialBookingData as Booking | undefined
      );
      const [selectedRoomData, setSelectedRoomData] = React.useState<
        Room | undefined
      >(context.args.initialSelectedRoom);
      const contextValue: BookingContextType = {
        bookingContext: bookingData,
        setBookingContext: (u) => {
          const v = typeof u === "function" ? u(bookingData) : u;
          mockSetBookingContext(v);
          setBookingData(v as Booking | undefined);
        },
        selectedRoom: selectedRoomData,
        setSelectedRoom: (u) => {
          const v = typeof u === "function" ? u(selectedRoomData) : u;
          mockSetSelectedRoom(v);
          setSelectedRoomData(v as Room | undefined);
        },
      };
      return (
        <BookingContext.Provider value={contextValue}>
          <Story />
        </BookingContext.Provider>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<BookingFormStoryArgs>;

const expectedComponentDefaultDateString = `${format(
  todayForComponentDefault,
  "LLL dd, y"
)} - ${format(tomorrowForComponentDefault, "LLL dd, y")}`;
const escapedExpectedComponentDefaultDateString = new RegExp(
  expectedComponentDefaultDateString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
);

export const DefaultGuestView_ShowsComponentDefaultDates: Story = {
  name: "Default (Guest - Shows Component Default Dates)",
  args: { type: "Guest" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Render check with component default dates", async () => {
      expect(canvas.getByLabelText(/Name/i)).toBeInTheDocument();
      const dateButton = canvas.getByRole("button", { name: /Time of Stay/i });
      expect(dateButton).toHaveTextContent(
        escapedExpectedComponentDefaultDateString
      );
      const roomSelectTrigger = canvas.getByRole("combobox", {
        name: /Available Rooms/i,
      });
      await waitFor(() => expect(roomSelectTrigger).not.toBeDisabled());
      expect(canvas.getByRole("button", { name: /Proceed/i })).toBeDisabled();
    });
  },
};
