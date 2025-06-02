// import React from "react";
// import { Meta, StoryObj } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { userEvent, within, waitFor } from "@storybook/testing-library";
// import { expect } from "@storybook/jest";

// import BookingForm from "./BookingForm";
// import { BookingContext } from "../providers/BookProvider";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Room } from "@/types/types";
// import { BookingContextType } from "@/types/context";

// const mockRouter = {
//   push: action("router.push"),
//   back: action("router.back"),
//   replace: action("router.replace"),
//   prefetch: action("router.prefetch"),
// };

// const mockAvailableRooms: Room[] = [
//   {
//     id: "room1",
//     roomNumber: "101",
//     roomType: "Queen Bee",
//     roomRate: 1500,
//     maxGuests: 2,
//     amenities: [],
//     images: [],
//   },
//   {
//     id: "room2",
//     roomNumber: "102",
//     roomType: "Queen Bee",
//     roomRate: 1500,
//     maxGuests: 2,
//     amenities: [],
//     images: [],
//   },
//   {
//     id: "room3",
//     roomNumber: "201",
//     roomType: "Suite",
//     roomRate: 2500,
//     maxGuests: 3,
//     amenities: [],
//     images: [],
//   },
//   {
//     id: "room4",
//     roomNumber: "202",
//     roomType: "Family Suite",
//     roomRate: 3500,
//     maxGuests: 4,
//     amenities: [],
//     images: [],
//   },
//   {
//     id: "room5",
//     roomNumber: "301",
//     roomType: "Single Standard",
//     roomRate: 1000,
//     maxGuests: 1,
//     amenities: [],
//     images: [],
//   },
//   {
//     id: "room6",
//     roomNumber: "302",
//     roomType: "Single Deluxe",
//     roomRate: 1200,
//     maxGuests: 1,
//     amenities: [],
//     images: [],
//   },
//   {
//     id: "room7",
//     roomNumber: "401",
//     roomType: "Twin Bee",
//     roomRate: 1800,
//     maxGuests: 2,
//     amenities: [],
//     images: [],
//   },
// ];

// jest.mock("@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate", () => ({
//   __esModule: true,
//   default: () => ({
//     getAvailableRoomsWithDate: jest.fn(
//       async (
//         from?: Date,
//         to?: Date,
//         options?: { returnPromiseResult?: boolean }
//       ) => {
//         action("getAvailableRoomsWithDate called")(from, to, options);
//         await new Promise((resolve) => setTimeout(resolve, 300));

//         if (options?.returnPromiseResult) {
//           return availableForDate;
//         }

//         return availableForDate;
//       }
//     ),
//     loading: false,

//     availableRoomsWithDate: initiallyAvailableRoomsForHook,
//   }),
// }));

// const meta: Meta<typeof BookingForm> = {
//   title: "Forms/BookingForm",
//   component: BookingForm,
//   parameters: {
//     layout: "centered",
//     nextjs: {
//       appDirectory: true,
//       navigation: mockRouter,
//     },
//   },
//   tags: ["autodocs"],
//   argTypes: {
//     type: {
//       control: "radio",
//       options: ["Guest", "Admin"],
//     },
//   },
//   decorators: [
//     (Story, { args }) => {
//       const mockSetBookingContext = action("setBookingContext");
//       const mockSetSelectedRoom = action("setSelectedRoom");

//       const initialBookingDataFromArgs =
//         (args as any).initialBookingContextData || null;
//       const initialSelectedRoomFromArgs =
//         (args as any).initialSelectedRoom || null;

//       const [bookingContext, setBookingContext] = React.useState(
//         initialBookingDataFromArgs
//       );
//       const [selectedRoom, setSelectedRoom] = React.useState<Room | undefined>(
//         initialSelectedRoomFromArgs
//       );

//       const contextValue: BookingContextType = {
//         bookingContext: bookingContext,
//         setBookingContext: (data) => {
//           mockSetBookingContext(data);
//           setBookingContext(data);
//         },
//         selectedRoom: selectedRoom,
//         setSelectedRoom: (room) => {
//           mockSetSelectedRoom(room);
//           setSelectedRoom(room);
//         },
//       };

//       return (
//         <BookingContext.Provider value={contextValue}>
//           <div
//             style={{
//               width: "100%",
//               maxWidth: "600px",
//               padding: "20px",
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//             }}>
//             <Story />
//             <ToastContainer />
//           </div>
//         </BookingContext.Provider>
//       );
//     },
//   ],
// };

// export default meta;

// type Story = StoryObj<
//   typeof BookingForm & {
//     initialBookingContextData?: any;
//     initialSelectedRoom?: Room;
//   }
// >;

// export const DefaultGuest: Story = {
//   args: {
//     type: "Guest",
//   },
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement);

//     await step("Fill out guest details", async () => {
//       await userEvent.type(
//         canvas.getByPlaceholderText("Full Name"),
//         "John Doe"
//       );
//       await userEvent.type(
//         canvas.getByPlaceholderText("Mobile Number (e.g., 09XXXXXXXXX)"),
//         "09123456789"
//       );
//       await userEvent.type(
//         canvas.getByPlaceholderText("your.email@example.com"),
//         "john.doe@example.com"
//       );
//     });

//     await step("Select date range", async () => {
//       await userEvent.click(
//         canvas.getByRole("button", { name: /pick a date range/i })
//       );
//     });

//     await waitFor(() =>
//       expect(action("getAvailableRoomsWithDate called")).toHaveBeenCalled()
//     );

//     await step("Select a room", async () => {
//       const roomSelectTrigger = canvas.getByRole("combobox", {
//         name: /choose your room/i,
//       });
//       await userEvent.click(roomSelectTrigger);

//       const roomOption = await canvas.findByText("101 - Queen Bee");
//       await userEvent.click(roomOption);
//       expect(roomSelectTrigger).toHaveTextContent("101 - Queen Bee");
//     });

//     await step("Enter number of adults and children", async () => {
//       await userEvent.clear(
//         canvas.getByRole("spinbutton", { name: /adults/i })
//       );
//       await userEvent.type(
//         canvas.getByRole("spinbutton", { name: /adults/i }),
//         "2"
//       );
//       await userEvent.clear(
//         canvas.getByRole("spinbutton", { name: /children/i })
//       );
//       await userEvent.type(
//         canvas.getByRole("spinbutton", { name: /children/i }),
//         "1"
//       );
//     });

//     await step("Accept terms and submit", async () => {
//       await userEvent.click(
//         canvas.getByRole("checkbox", { name: /i have read and accept the/i })
//       );
//       await userEvent.click(canvas.getByRole("button", { name: /proceed/i }));
//     });

//     await waitFor(() => {
//       expect(action("setBookingContext")).toHaveBeenCalledWith(
//         expect.objectContaining({
//           name: "John Doe",
//           roomId: "room1",
//         })
//       );
//       expect(action("router.push")).toHaveBeenCalledWith("/book/invoice");
//     });
//   },
// };

// export const AdminUser: Story = {
//   args: {
//     type: "Admin",
//   },
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement);
//     await step("Fill out guest details", async () => {
//       await userEvent.type(
//         canvas.getByPlaceholderText("Full Name"),
//         "Admin User"
//       );
//       await userEvent.type(
//         canvas.getByPlaceholderText("Mobile Number (e.g., 09XXXXXXXXX)"),
//         "09000000000"
//       );
//       await userEvent.type(
//         canvas.getByPlaceholderText("your.email@example.com"),
//         "admin@example.com"
//       );
//     });

//     await waitFor(() =>
//       expect(action("getAvailableRoomsWithDate called")).toHaveBeenCalled()
//     );

//     await step("Select a room", async () => {
//       const roomSelectTrigger = canvas.getByRole("combobox", {
//         name: /choose your room/i,
//       });
//       await userEvent.click(roomSelectTrigger);

//       const roomOption = await canvas.findByText("201 - Suite");
//       await userEvent.click(roomOption);
//     });

//     await step("Enter number of adults", async () => {
//       await userEvent.clear(
//         canvas.getByRole("spinbutton", { name: /adults/i })
//       );
//       await userEvent.type(
//         canvas.getByRole("spinbutton", { name: /adults/i }),
//         "1"
//       );
//     });

//     await step("Submit (terms pre-accepted for Admin)", async () => {
//       expect(
//         canvas.queryByRole("checkbox", { name: /i have read and accept the/i })
//       ).not.toBeInTheDocument();
//       await userEvent.click(canvas.getByRole("button", { name: /proceed/i }));
//     });

//     await waitFor(() => {
//       expect(action("setBookingContext")).toHaveBeenCalledWith(
//         expect.objectContaining({
//           bookingType: "OTC",
//           name: "Admin User",
//           roomId: "room3",
//         })
//       );
//       expect(action("router.push")).toHaveBeenCalledWith("/admin/book/invoice");
//     });
//   },
// };

// const availableRoomForInitialData = mockAvailableRooms.find(
//   (r) => r.id === "room3" && r.isAvailable !== false
// );

// export const WithInitialData: Story = {
//   args: {
//     type: "Guest",
//     initialBookingContextData: {
//       name: "Jane Doe",
//       mobileNumber: "09987654321",
//       email: "jane.doe@example.com",
//       checkIn: new Date(new Date().setDate(new Date().getDate() + 5)),
//       checkOut: new Date(new Date().setDate(new Date().getDate() + 7)),
//       numberOfAdults: 1,
//       numberOfChildren: 0,
//     },

//     initialSelectedRoom: availableRoomForInitialData,
//   },
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement);

//     await waitFor(() =>
//       expect(action("getAvailableRoomsWithDate called")).toHaveBeenCalled()
//     );

//     await step("Verify pre-filled data", async () => {
//       await waitFor(() =>
//         expect(canvas.getByDisplayValue("Jane Doe")).toBeInTheDocument()
//       );
//       expect(canvas.getByDisplayValue("09987654321")).toBeInTheDocument();
//       expect(
//         canvas.getByDisplayValue("jane.doe@example.com")
//       ).toBeInTheDocument();

//       if (availableRoomForInitialData) {
//         expect(
//           canvas.getByRole("combobox", {
//             name: new RegExp(
//               `${availableRoomForInitialData.roomNumber} - ${availableRoomForInitialData.roomType}`
//             ),
//           })
//         ).toBeInTheDocument();
//       }
//       expect(canvas.getByDisplayValue("1")).toBeInTheDocument();
//       expect(canvas.getByDisplayValue("0")).toBeInTheDocument();
//     });

//     await step("Accept terms and submit", async () => {
//       await userEvent.click(
//         canvas.getByRole("checkbox", { name: /i have read and accept the/i })
//       );
//       await userEvent.click(canvas.getByRole("button", { name: /proceed/i }));
//     });

//     await waitFor(() => {
//       expect(action("setBookingContext")).toHaveBeenCalledWith(
//         expect.objectContaining({
//           name: "Jane Doe",
//           roomId: availableRoomForInitialData?.id,
//         })
//       );
//       expect(action("router.push")).toHaveBeenCalledWith("/book/invoice");
//     });
//   },
// };

// const originalMock =
//   require("@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate").default;

// export const NoRoomsAvailable: Story = {
//   args: {
//     type: "Guest",
//   },

//   loaders: [
//     async () => {
//       jest.doMock(
//         "@/hooks/utilsHooks/useOnlyAvailableRoomsOnSpecificDate",
//         () => ({
//           __esModule: true,
//           default: () => ({
//             getAvailableRoomsWithDate: jest.fn(
//               async (
//                 from?: Date,
//                 to?: Date,
//                 options?: { returnPromiseResult?: boolean }
//               ) => {
//                 action("getAvailableRoomsWithDate called (no rooms)")(
//                   from,
//                   to,
//                   options
//                 );
//                 await new Promise((resolve) => setTimeout(resolve, 100));
//                 if (options?.returnPromiseResult) return [];
//                 return [];
//               }
//             ),
//             loading: false,
//             availableRoomsWithDate: [],
//           }),
//         })
//       );
//       return {};
//     },
//   ],
//   play: async ({ canvasElement, step }) => {
//     const canvas = within(canvasElement);

//     await step("Attempt to select room when none are available", async () => {
//       await userEvent.type(
//         canvas.getByPlaceholderText("Full Name"),
//         "No Room User"
//       );

//       await userEvent.click(
//         canvas.getByRole("button", { name: /pick a date range/i })
//       );

//       await waitFor(() =>
//         expect(
//           action("getAvailableRoomsWithDate called (no rooms)")
//         ).toHaveBeenCalled()
//       );

//       const roomSelectTrigger = canvas.getByRole("combobox", {
//         name: /choose your room/i,
//       });
//       await userEvent.click(roomSelectTrigger);

//       expect(
//         await canvas.findByText("No rooms available for the selected dates.")
//       ).toBeInTheDocument();
//     });
//   },
// };
