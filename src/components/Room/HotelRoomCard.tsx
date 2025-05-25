import React, { JSX } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Room, ImageFile } from "@/types/types";
import { RoomImagesCarousel } from "./RoomImagesCarousel";
import Link from "next/link";
import RoomFormPopover from "./RoomFormPopover";
import DeleteRoomPopover from "./DeleteRoomPopover";
import NextImage from "next/image";
import { Amenity, AMENITIES } from "@/constants/amenities"; // Ensure Amenity is imported

// Fallback Icon (remains the same)
const FallbackAmenityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7" // Generic checkmark
    />
  </svg>
);

// Updated Icon mapping
const amenityIcons: { [key in Amenity]?: JSX.Element } = {
  "Free Wifi": ( // Was "WiFi"
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M5 13a10 10 0 0114 0M8.5 16.5a6 6 0 017 0M12 20h.01" />
    </svg>
  ),
  "Airconditioned": ( // Was "Air Conditioning"
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 12c0-3.032-1.078-5.78-2.818-7.97M4.5 12c0 3.032 1.078 5.78 2.818 7.97M12 4.5v15m0 0V4.5m0 15a7.5 7.5 0 000-15 7.5 7.5 0 000 15zM8.25 7.5H15.75M8.25 16.5H15.75M5 12H2m18 0h-3"
      />
    </svg>
  ),
  "Television": ( // Was "TV"
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="5" width="18" height="12" rx="2" ry="2" />
      <path d="M8 21h8" />
    </svg>
  ),
  "Receiving Area": ( // Was "Recieving Area"
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  "Separated CR": ( // New
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v2H5V2zm0 3h10v1H5V5zm0 2h10v9H5V7zm2 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg> // Placeholder: Toilet icon
  ),
  "Open CR": ( // New
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7H21M3 7V3M3 7L6 10M21 7V3M21 7L18 10M6 10H18M6 10L9 13M18 10L15 13M9 13H15M9 13V21H15V13" />
    </svg> // Placeholder: Shower icon
  ),
  "Single Bed": ( // New
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M5 7V4a1 1 0 011-1h12a1 1 0 011 1v3M5 7h14M5 11h14M7 15h3" />
    </svg> // Placeholder: Bed icon
  ),
  "Twin Single Bed": ( // New
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h5V7H3zM14 7v12h5a2 2 0 002-2V7h-7zM5 7V4a1 1 0 011-1h3a1 1 0 011 1v3M16 7V4a1 1 0 011-1h3a1 1 0 011 1v3" />
    </svg> // Placeholder: Two beds icon
  ),
  "Queen Size Bed": ( // New
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M5 7V4a1 1 0 011-1h12a1 1 0 011 1v3M5 7h14M5 11h14M7 15h10" />
    </svg> // Placeholder: Larger bed icon
  ),
  // Balcony and Safe were removed from the new AMENITIES list
};


const HotelRoomCard = ({
  room,
  role = "Guest",
  refetchRooms,
}: {
  room: Room;
  role?: "Guest" | "Admin";
  refetchRooms: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            "flex flex-col h-82 lg:flex-row p-0 w-full justify-between lg:h-60 overflow-hidden bg-[#D29D30] text-white relative"
          }>
          <div className="flex flex-col lg:w-5/12 lg:h-full h-6/15  p-5 text-left relative z-20">
            <h1 className="font-semibold md:text-2xl text-xl">
              {room.roomType}: {room.roomNumber}
            </h1>
            <p className="lg:mt-2 text-md">
              Rate: ₱ {room.roomRate?.toFixed(2)} / night
            </p>
            <p className="text-sm">Max Guests: {room.maxGuests || "N/A"}</p>

            <div className="mt-2 gap-x-4 lg:mt-auto flex flex-wrap lg:gap-3 text-sm items-center">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.slice(0, 4).map((amenityName) => {
                  // Ensure amenityName is a valid Amenity type
                  const amenity = amenityName as Amenity; 
                  // Check if amenity is in our defined AMENITIES list to be safe
                  if (!AMENITIES.includes(amenity)) return null; 

                  const icon = amenityIcons[amenity] || <FallbackAmenityIcon />;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-1"
                      title={amenity}
                    >
                      {icon}
                      <span className="hidden sm:inline">{amenity}</span>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-gray-300 italic">
                  No specific amenities listed.
                </span>
              )}
              {room.amenities && room.amenities.length > 4 && (
                <div className="flex items-center gap-1 text-xs text-gray-200">
                  + {room.amenities.length - 4} more
                </div>
              )}
            </div>
          </div>
          <div className="relative w-full lg:w-7/12 lg:h-full h-9/15 ">
            {room.images?.length ? (
              <NextImage
                key={room.images[0].name || room.id}
                alt={`Preview of ${room.roomType} ${room.roomNumber}`}
                src={`https://dwfbvqkcxeajmtqciozz.supabase.co/storage/v1/object/public/rooms/${room.id}/${room.images[0].name}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 58vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Preview</span>
              </div>
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/4 xl:max-w-4xl h-[90vh] sm:h-5/6 p-0 overflow-hidden rounded-lg shadow-2xl">
        <DialogHeader className="p-4 sm:p-6 border-b shrink-0">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
            {room.roomType}: {room.roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-full overflow-hidden p-2 sm:p-4 bg-muted/20">
          {room.images && room.images.length > 0 ? (
            <RoomImagesCarousel
              roomId={room.id!}
              images={room.images as ImageFile[]}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50 mb-4">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  ry="2"></rect>
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>No detailed images available for this room.</p>
            </div>
          )}
        </div>
        <div className="px-8 max-h-30 border-t">
          <h3 className="font-semibold text-md my-2">Amenities:</h3>
          {room.amenities && room.amenities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {room.amenities.map((amenityName) => {
                const amenity = amenityName as Amenity;
                // Check if amenity is in our defined AMENITIES list to be safe
                if (!AMENITIES.includes(amenity)) return null; 

                const icon = amenityIcons[amenity] || <FallbackAmenityIcon />;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm"
                  >
                    {icon}
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No specific amenities listed for this room.
            </p>
          )}
        </div>
        <DialogFooter className="p-4 border-t shrink-0">
          {role === "Guest" && (
            <Button asChild>
              <Link href={"/book"}>Book Now</Link>
            </Button>
          )}
          {role === "Admin" && (
            <>
              <div className="flex w-auto">
                <DeleteRoomPopover
                  room={room}
                  onDeleteSuccess={refetchRooms}
                />
              </div>
              <div className="flex w-auto">
                <RoomFormPopover
                  type="Edit"
                  room={room}
                  onFormSubmitSuccess={refetchRooms}
                />
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HotelRoomCard;