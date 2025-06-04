// FILE: BookingForm.stories.tsx
// THIS VERSION ASSUMES BookingForm.tsx ALWAYS DEFAULTS DATES TO TODAY/TOMORROW
// IF CONTEXT DATES ARE UNDEFINED.
// Debugging for calendar cell query is included.

import React, { ComponentProps } from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  userEvent,
  within,
  waitFor,
  // fireEvent, // Not currently used, but available
  // screen, // Import screen for debugging if needed
} from "@storybook/testing-library";
import { expect, fn } from "@storybook/test";
import { format } from "date-fns";

import BookingForm from "./BookingForm"; // Assuming BookingForm.tsx is in the same directory
import { Room, Booking } from "@/types/types";
import { BookingContextType } from "@/types/context";
import { BookingContext } from "../providers/BookProvider"; // Adjusted path

// --- Mock Data and Functions ---
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

// Dates for component's internal defaults if no context/args override
const todayForComponentDefault = new Date(new Date().setHours(0, 0, 0, 0));
const tomorrowForComponentDefault = new Date(
  new Date(todayForComponentDefault).setDate(
    todayForComponentDefault.getDate() + 1
  )
);

// Specific dates for tests where the user actively selects different dates in the calendar
// Example: User selects 5 days from today until 7 days from today.
// IMPORTANT: Ensure these dates will be in a month visible when the calendar opens,
// or add navigation steps (click next/prev month button).
const testUserSelectsCheckInDate = new Date(
  new Date(todayForComponentDefault).setDate(
    todayForComponentDefault.getDate() + 5
  )
);
const testUserSelectsCheckOutDate = new Date(
  new Date(todayForComponentDefault).setDate(
    todayForComponentDefault.getDate() + 7
  )
);

// --- Define a comprehensive type for Story Args ---
type BookingFormComponentProps = ComponentProps<typeof BookingForm>;

interface BookingFormStoryArgs extends BookingFormComponentProps {
  mockedRoomsLoading?: boolean;
  mockedAvailableRooms?: Room[];
  initialBookingData?: Partial<Booking>;
  initialSelectedRoom?: Room;
}

// --- Storybook Meta Configuration ---
const meta: Meta<BookingFormStoryArgs> = {
  title: "Forms/BookingForm",
  component: BookingForm,
  parameters: {
    moduleMock: {
      "react-toastify": {
        toast: { error: mockToastError, info: mockToastInfo },
        ToastContainer: () => <div data-testid="mock-toast-container" />,
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
      mockGetAvailableRoomsWithDate.mockImplementation(
        async () => {
          return Promise.resolve(
            context.args.mockedAvailableRooms || sampleRooms
          );
        }
      );
      const [bookingData, setBookingData] = React.useState<Booking | undefined>(
        context.args.initialBookingData as Booking | undefined
      );
      const [selectedRoomData, setSelectedRoomData] = React.useState<
        Room | undefined
      >(context.args.initialSelectedRoom);
      const contextValue: BookingContextType = {
        bookingContext: bookingData,
        setBookingContext: (updater) => {
          const val =
            typeof updater === "function" ? updater(bookingData) : updater;
          mockSetBookingContext(val as Booking | undefined);
          setBookingData(val as Booking | undefined);
        },
        selectedRoom: selectedRoomData,
        setSelectedRoom: (updater) => {
          const val =
            typeof updater === "function" ? updater(selectedRoomData) : updater;
          mockSetSelectedRoom(val as Room | undefined);
          setSelectedRoomData(val as Room | undefined);
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

// --- Story Definitions ---
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
      expect(canvas.getByRole("button", { name: /Proceed/i })).toBeDisabled();
    });
  },
};

export const GuestFormFullInteraction_FromComponentDefaultDates: Story = {
  name: "Guest - Interaction (From Component Default Dates)",
  args: {
    type: "Guest",
    mockedAvailableRooms: sampleRooms,
    initialBookingData: {},
    initialSelectedRoom: undefined,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("Fill personal details", async () => {
      await userEvent.type(
        canvas.getByLabelText(/Name/i),
        "Test User DefaultDate"
      );
      await userEvent.type(
        canvas.getByLabelText(/Mobile Number/i),
        "09001112222"
      );
      await userEvent.type(
        canvas.getByLabelText(/Email Address/i),
        "testdefaultdate@example.com"
      );
    });

    await step(
      "Select different date range (starting with default dates showing)",
      async () => {
        const dateTrigger = canvas.getByRole("button", {
          name: /Time of Stay/i,
        });
        expect(dateTrigger).toHaveTextContent(
          escapedExpectedComponentDefaultDateString
        );
        await userEvent.click(dateTrigger);

        // For debugging calendar content:
        // import { screen } from "@storybook/testing-library"; // at the top
        // await waitFor(() => expect(canvas.getByRole('dialog', { name: /Calendar/i })).toBeVisible()); // Wait for calendar to be fully open
        // screen.logTestingPlaygroundURL();
        // console.log("Attempting to select dates:", testUserSelectsCheckInDate, testUserSelectsCheckOutDate);

        // This is the date string format that react-day-picker *typically* uses for aria-labels.
        // You MUST verify this with logTestingPlaygroundURL for your specific setup/locale.
        // Common formats: 'LLLL d, yyyy' (e.g., "June 10, 2025")
        // OR 'cccc, LLLL d, yyyy' (e.g., "Tuesday, June 10, 2025")
        const ariaLabelFormat = "LLLL d, yyyy"; // START WITH THIS, THEN ADJUST

        const fromDateAriaLabelString = format(
          testUserSelectsCheckInDate,
          ariaLabelFormat
        );
        const toDateAriaLabelString = format(
          testUserSelectsCheckOutDate,
          ariaLabelFormat
        );

        console.log(
          `Querying for check-in gridcell with name: "${fromDateAriaLabelString}"`
        );
        const fromDateButton = await canvas.findByRole("gridcell", {
          name: new RegExp(
            fromDateAriaLabelString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
          ),
        });
        await userEvent.click(fromDateButton);

        console.log(
          `Querying for check-out gridcell with name: "${toDateAriaLabelString}"`
        );
        const toDateButton = await canvas.findByRole("gridcell", {
          name: new RegExp(
            toDateAriaLabelString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            "i"
          ),
        });
        await userEvent.click(toDateButton);

        await waitFor(() => {
          const updatedDateButton = canvas.getByRole("button", {
            name: /Time of Stay/i,
          });
          const expectedSelectedDateString = `${format(
            testUserSelectsCheckInDate,
            "LLL dd, y"
          )} - ${format(testUserSelectsCheckOutDate, "LLL dd, y")}`;
          expect(updatedDateButton).toHaveTextContent(
            new RegExp(
              expectedSelectedDateString.replace(
                /[-\/\\^$*+?.()|[\]{}]/g,
                "\\$&"
              )
            )
          );
        });
        expect(mockGetAvailableRoomsWithDate).toHaveBeenCalledWith(
          testUserSelectsCheckInDate,
          testUserSelectsCheckOutDate
        );
      }
    );

    await step("Select a room", async () => {
      /* ... same as before ... */
      const roomSelectTrigger = canvas.getByRole("combobox", {
        name: /Available Rooms/i,
      });
      expect(roomSelectTrigger).not.toBeDisabled();
      await userEvent.click(roomSelectTrigger);
      const targetRoom = args.mockedAvailableRooms![0];
      await userEvent.click(
        await canvas.findByText(
          `${targetRoom.roomNumber} - ${targetRoom.roomType}`
        )
      );
      await waitFor(() =>
        expect(roomSelectTrigger).toHaveTextContent(
          `${targetRoom.roomNumber} - ${targetRoom.roomType}`
        )
      );
      expect(mockSetSelectedRoom).toHaveBeenCalledWith(
        expect.objectContaining({ id: targetRoom.id })
      );
    });
    await step("Fill guest numbers", async () => {
      /* ... same as before ... */
      await userEvent.type(canvas.getByLabelText(/Adults/i), "2");
      await userEvent.type(canvas.getByLabelText(/Children/i), "1");
    });
    await step("Accept terms and submit", async () => {
      /* ... same as before ... */
      await userEvent.click(
        canvas.getByLabelText(/I have read and accept the/i)
      );
      const proceedButton = canvas.getByRole("button", { name: /Proceed/i });
      mockGetAvailableRoomsWithDate.mockResolvedValueOnce(
        args.mockedAvailableRooms!
      );
      await userEvent.click(proceedButton);
      await waitFor(() =>
        expect(mockSetBookingContext).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Test User DefaultDate",
            checkIn: testUserSelectsCheckInDate,
            checkOut: testUserSelectsCheckOutDate,
          })
        )
      );
      await waitFor(() =>
        expect(mockRouterPush).toHaveBeenCalledWith("/book/invoice")
      );
    });
  },
};

export const AdminFormSubmitsCorrectly_UsesComponentDefaultDates: Story = {
  name: "Admin - Submit (Uses Component Default Dates)",
  args: {
    type: "Admin",
    mockedAvailableRooms: sampleRooms,
    initialBookingData: {},
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const formInitialCheckIn = todayForComponentDefault;
    const formInitialCheckOut = tomorrowForComponentDefault;
    await step("Admin form initial state and fill", async () => {
      const dateButton = canvas.getByRole("button", { name: /Time of Stay/i });
      expect(dateButton).toHaveTextContent(
        escapedExpectedComponentDefaultDateString
      );
      await userEvent.type(
        canvas.getByLabelText(/Name/i),
        "Admin Submitter CompDef"
      );
      await userEvent.type(
        canvas.getByLabelText(/Mobile Number/i),
        "09ADMINCOMPDEF"
      );
      await userEvent.type(
        canvas.getByLabelText(/Email Address/i),
        "admincompdef@corp.com"
      );
    });
    await waitFor(() =>
      expect(mockGetAvailableRoomsWithDate).toHaveBeenCalledWith(
        formInitialCheckIn,
        formInitialCheckOut
      )
    );
    await step("Select room and guests for Admin", async () => {
      /* ... same as before ... */
      const roomSelectTrigger = canvas.getByRole("combobox", {
        name: /Available Rooms/i,
      });
      await userEvent.click(roomSelectTrigger);
      const targetRoom = args.mockedAvailableRooms![1];
      await userEvent.click(
        await canvas.findByText(
          `${targetRoom.roomNumber} - ${targetRoom.roomType}`
        )
      );
      await waitFor(() =>
        expect(mockSetSelectedRoom).toHaveBeenCalledWith(
          expect.objectContaining({ id: targetRoom.id })
        )
      );
      await userEvent.type(canvas.getByLabelText(/Adults/i), "1");
    });
    await step("Submit admin form", async () => {
      /* ... same as before ... */
      mockGetAvailableRoomsWithDate.mockResolvedValueOnce(
        args.mockedAvailableRooms!
      );
      await userEvent.click(canvas.getByRole("button", { name: /Proceed/i }));
      await waitFor(() =>
        expect(mockSetBookingContext).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Admin Submitter CompDef",
            checkIn: formInitialCheckIn,
            checkOut: formInitialCheckOut,
          })
        )
      );
      await waitFor(() =>
        expect(mockRouterPush).toHaveBeenCalledWith("/admin/book/invoice")
      );
    });
  },
};

export const ValidationErrorsShow_StartsComponentDefaultDates: Story = {
  name: "Guest - Validation Errors (Starts Component Default Dates)",
  args: { type: "Guest", initialBookingData: {} },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Verify default dates and attempt submit", async () => {
      const dateButton = canvas.getByRole("button", { name: /Time of Stay/i });
      expect(dateButton).toHaveTextContent(
        escapedExpectedComponentDefaultDateString
      );
      await userEvent.click(
        canvas.getByLabelText(/I have read and accept the/i)
      );
      await userEvent.click(canvas.getByRole("button", { name: /Proceed/i }));
    });
    await step("Verify validation messages", async () => {
      expect(
        await canvas.findByText("Please enter your name.")
      ).toBeInTheDocument();
    });
  },
};

export const RoomBecomesUnavailableOnSubmit_FromComponentDefaultDates: Story = {
  name: "Guest - Room Unavailable (From Component Default Dates)",
  args: {
    type: "Guest",
    mockedAvailableRooms: sampleRooms,
    initialBookingData: {},
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const initiallySelectedRoom = args.mockedAvailableRooms![0];
    const currentTestCheckInDateToSelect = testUserSelectsCheckInDate;
    const currentTestCheckOutDateToSelect = testUserSelectsCheckOutDate;
    const ariaLabelFormat = "LLLL d, yyyy"; // ADJUST THIS after debugging

    await userEvent.type(
      canvas.getByLabelText(/Name/i),
      "Late Booker Default Start"
    );
    const dateTrigger = canvas.getByRole("button", { name: /Time of Stay/i });
    expect(dateTrigger).toHaveTextContent(
      escapedExpectedComponentDefaultDateString
    );
    await userEvent.click(dateTrigger);
    await userEvent.click(
      await canvas.findByRole("gridcell", {
        name: new RegExp(
          format(currentTestCheckInDateToSelect, ariaLabelFormat).replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          ),
          "i"
        ),
      })
    );
    await userEvent.click(
      await canvas.findByRole("gridcell", {
        name: new RegExp(
          format(currentTestCheckOutDateToSelect, ariaLabelFormat).replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          ),
          "i"
        ),
      })
    );
    await waitFor(() =>
      expect(mockGetAvailableRoomsWithDate).toHaveBeenCalledWith(
        currentTestCheckInDateToSelect,
        currentTestCheckOutDateToSelect
      )
    );
    const roomSelectTrigger = canvas.getByRole("combobox", {
      name: /Available Rooms/i,
    });
    await userEvent.click(roomSelectTrigger);
    await userEvent.click(
      await canvas.findByText(
        `${initiallySelectedRoom.roomNumber} - ${initiallySelectedRoom.roomType}`
      )
    );
    await waitFor(() => expect(mockSetSelectedRoom).toHaveBeenCalled());
    await userEvent.type(canvas.getByLabelText(/Adults/i), "1");
    await userEvent.click(canvas.getByLabelText(/I have read and accept the/i));
    const callCountBeforeSubmit =
      mockGetAvailableRoomsWithDate.mock.calls.length;
    await step("Attempt submit when room is no longer available", async () => {
      /* ... same logic ... */
      const roomsAfterSnatch = args.mockedAvailableRooms!.filter(
        (r) => r.id !== initiallySelectedRoom.id
      );
      mockGetAvailableRoomsWithDate.mockResolvedValueOnce(roomsAfterSnatch);
      mockGetAvailableRoomsWithDate.mockResolvedValueOnce(roomsAfterSnatch);
      await userEvent.click(canvas.getByRole("button", { name: /Proceed/i }));
      await waitFor(() =>
        expect(mockToastError).toHaveBeenCalledWith(
          expect.stringContaining("unavailable"),
          expect.anything()
        )
      );
      expect(mockGetAvailableRoomsWithDate.mock.calls.length).toBe(
        callCountBeforeSubmit + 2
      );
    });
  },
};

export const InitialDataFromContextLoads_ShowsSpecificDates: Story = {
  name: "Initial Data From Context (Shows Specific Dates)",
  args: {
    type: "Guest",
    initialBookingData: {
      name: "Context With Dates",
      checkIn: testUserSelectsCheckInDate, // Specific dates
      checkOut: testUserSelectsCheckOutDate,
    },
    initialSelectedRoom: sampleRooms[1],
    mockedAvailableRooms: sampleRooms,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const initialData = args.initialBookingData as Required<
      BookingFormStoryArgs["initialBookingData"]
    >;
    await step("Verify form fields populated from context", async () => {
      const dateButton = canvas.getByRole("button", { name: /Time of Stay/i });
      const expectedDateRange = `${format(
        initialData!.checkIn!,
        "LLL dd, y"
      )} - ${format(initialData!.checkOut!, "LLL dd, y")}`;
      expect(dateButton).toHaveTextContent(
        new RegExp(expectedDateRange.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
      );
      await waitFor(() =>
        expect(mockGetAvailableRoomsWithDate).toHaveBeenCalledWith(
          initialData!.checkIn,
          initialData!.checkOut
        )
      );
    });
  },
};
