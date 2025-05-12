// components/HotelRoomCard.tsx

import React from "react";
import {
  Dialog,
  // DialogDescription, // Not used, can remove
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"; // Adjust path if needed
import { Button } from "../ui/button"; // Adjust path if needed
import { Room, ImageFile } from "@/types/types"; // Adjust path if needed
import NextImage from "next/image"; // Alias to avoid naming conflicts
import { RoomImagesCarousel } from "./RoomImagesCarousel"; // Adjust path if needed
import Link from "next/link";
import RoomFormPopover from "./RoomFormPopover";
import DeleteRoomPopover from "./DeleteRoomPopover";

const HotelRoomCard = ({
  room,
  role = "Guest",
}: {
  room: Room;
  role?: "Guest" | "Admin";
}) => {
  // Log data before rendering the part that uses it for the carousel
  if (room.images && room.images.length > 0) {
    console.log(
      "HotelRoomCard - Preparing to render Carousel for Room ID:",
      room.id
    );
    console.log(
      "HotelRoomCard - Images Array (raw) being passed:",
      room.images
    );
    console.log(
      "HotelRoomCard - Images Array (JSON) being passed:",
      JSON.stringify(room.images, null, 2)
    );
  } else if (room.images) {
    // room.images exists but is empty
    console.log(
      "HotelRoomCard - Room ID:",
      room.id,
      "- Has an empty images array. Will show placeholder in dialog."
    );
  } else {
    // room.images is undefined or null
    console.log(
      "HotelRoomCard - Room ID:",
      room.id,
      "- 'images' property is undefined/null. Will show placeholder in dialog."
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={
            "flex flex-row p-0 w-full md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto justify-between h-60 overflow-hidden shadow-lg hover:shadow-xl transition-shadow rounded-lg border group"
          }>
          {/* Card Preview Content (left side - text) */}
          <div className="flex flex-col w-3/5 sm:w-5/8 h-full p-4 sm:p-5 text-left relative z-10">
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-primary group-hover:text-primary-dark transition-colors">
              {room.roomType}: {room.roomNumber}
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Rate: ₱ {room.roomRate?.toFixed(2)} / night
            </p>
            <span className="mt-auto text-xs text-blue-600 group-hover:underline">
              View Details & Photos
            </span>
          </div>

          {/* Card Preview Image (right side) */}
          <div className="relative w-2/5 sm:w-3/8 h-full">
            {room.images && room.images.length > 0 && room.images[0]?.name ? ( // Added optional chaining for room.images[0]?.name
              <NextImage
                key={room.images[0].name || room.id}
                alt={`Preview of ${room.roomType} ${room.roomNumber}`}
                src={`https://dwfbvqkcxeajmtqciozz.supabase.co/storage/v1/object/public/rooms/${room.id}/${room.images[0].name}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 25vw"
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
              roomId={room.id!} // room.id should exist and be a string
              images={room.images as ImageFile[]} // Type assertion
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
        <DialogFooter className="p-4 border-t shrink-0">
          {role === "Guest" && (
            <Button>
              <Link href={"/book"}>Book Now</Link>
            </Button>
          )}
          {role === "Admin" && (
            <>
              <div className="flex w-[14%]">
                <DeleteRoomPopover room={room} />
              </div>
              <div className="flex w-[14%]">
                <RoomFormPopover
                  type="Edit"
                  room={room}
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
