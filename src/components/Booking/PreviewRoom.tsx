import React, { JSX } from "react"; // Added JSX for amenityIcons type
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useBooking } from "../providers/BookProvider";
import { RoomImagesCarousel } from "../Room/RoomImagesCarousel";
import { BedDouble, Users, DollarSign } from "lucide-react";
import { Amenity, AMENITIES } from "@/constants/amenities"; // Import Amenity types and constants

// --- Copied from HotelRoomCard for amenity display ---
// Fallback Icon
const FallbackAmenityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4" // Base size, will be overridden by cloneElement
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

// Icon mapping
const amenityIcons: { [key in Amenity]?: JSX.Element } = {
  "Free Wifi": (
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
  "Airconditioned": (
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
  "Television": (
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
  "Receiving Area": (
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
  "Separated CR": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011-1h8a1 1 0 011 1v2H5V2zm0 3h10v1H5V5zm0 2h10v9H5V7zm2 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
  "Open CR": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7H21M3 7V3M3 7L6 10M21 7V3M21 7L18 10M6 10H18M6 10L9 13M18 10L15 13M9 13H15M9 13V21H15V13" />
    </svg>
  ),
  "Single Bed": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M5 7V4a1 1 0 011-1h12a1 1 0 011 1v3M5 7h14M5 11h14M7 15h3" />
    </svg>
  ),
  "Twin Single Bed": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h5V7H3zM14 7v12h5a2 2 0 002-2V7h-7zM5 7V4a1 1 0 011-1h3a1 1 0 011 1v3M16 7V4a1 1 0 011-1h3a1 1 0 011 1v3" />
    </svg>
  ),
  "Queen Size Bed": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M5 7V4a1 1 0 011-1h12a1 1 0 011 1v3M5 7h14M5 11h14M7 15h10" />
    </svg>
  ),
};
// --- End of copied section ---


const PreviewRoom = () => {
  const { selectedRoom } = useBooking();

  return (
    <Card className="flex flex-col lg:w-7/16 w-full h-full p-4 md:p-6 bg-amber-400/20 backdrop-filter backdrop-blur-lg rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-amber-100">
      {selectedRoom ? (
        <>
          <CardHeader className="pb-3 pt-1 px-1">
            <h3 className="text-xl md:text-2xl font-semibold text-slate-700">
              {selectedRoom.roomType || "Room Details"}:{" "}
              {selectedRoom.roomNumber || "N/A"}
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-1 space-y-4">
            <div className="relative w-full aspect-[16/10] md:aspect-video max-h-[250px] md:max-h-[350px] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
              <RoomImagesCarousel
                roomId={selectedRoom.id!}
                images={selectedRoom.images || []}
              />
            </div>

            <div className="space-y-3 pt-2 text-sm md:text-base">
              {typeof selectedRoom.roomRate === "number" && (
                <div className="flex items-center text-slate-600">
                  <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-700 flex-shrink-0" />
                  <span className="font-medium">Rate:</span>
                  <span className="ml-1.5">
                    ₱{selectedRoom.roomRate.toFixed(2)} / night
                  </span>
                </div>
              )}
              {typeof selectedRoom.maxGuests === "number" && (
                <div className="flex items-center text-slate-600">
                  <Users className="mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-700 flex-shrink-0" />
                  <span className="font-medium">Max Guests:</span>
                  <span className="ml-1.5">{selectedRoom.maxGuests}</span>
                </div>
              )}

              {/* Amenities Section */}
              {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                <div className="pt-1"> {/* Reduced top padding slightly from pt-2 to pt-1 if space-y-3 is on parent */}
                  <h4 className="font-medium text-slate-600 mb-1.5">
                    Amenities:
                  </h4>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-600">
                    {selectedRoom.amenities.map((amenityName) => {
                      const amenity = amenityName as Amenity;
                      // Ensure amenity is in our defined AMENITIES list to be safe
                      if (!AMENITIES.includes(amenity)) return null;

                      const iconElement = amenityIcons[amenity] || <FallbackAmenityIcon />;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center"
                          title={amenity}
                        >
                          {React.cloneElement(iconElement, {
                            // Apply consistent styling to icons
                            className: "mr-1.5 h-4 w-4 md:h-5 md:w-5 text-amber-700 flex-shrink-0",
                          })}
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <BedDouble className="w-12 h-12 md:w-16 md:h-16 text-amber-500/80 mb-4" /> {/* Increased icon size */}
          <p className="text-lg md:text-xl font-semibold text-slate-600 mb-1">
            Room Preview
          </p>
          <p className="text-xs md:text-sm text-slate-500">
            Select a room from the form on the left to see its details and
            images here.
          </p>
        </div>
      )}
    </Card>
  );
};

export default PreviewRoom;