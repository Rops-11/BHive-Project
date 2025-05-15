import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useBooking } from "../providers/BookProvider";
import { RoomImagesCarousel } from "../Room/RoomImagesCarousel";
import { BedDouble, Users, DollarSign } from "lucide-react";

const PreviewRoom = () => {
  const { selectedRoom } = useBooking();

  return (
    <Card className="flex flex-col lg:w-7/16 w-full h-full p-4 md:p-6 bg-amber-400/20 backdrop-filter backdrop-blur-lg rounded-xl overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-amber-100">
      {selectedRoom ? (
        <>
          <CardHeader className="pb-3 pt-1 px-1">
            {}
            <h3 className="text-xl md:text-2xl font-semibold text-slate-700">
              {selectedRoom.roomType || "Room Details"}:{" "}
              {selectedRoom.roomNumber || "N/A"}
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-1 space-y-4">
            {}
            <div className="relative w-full aspect-[16/10] md:aspect-video max-h-[250px] md:max-h-[350px] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
              <RoomImagesCarousel
                roomId={selectedRoom.id!}
                images={selectedRoom.images || []}
              />
            </div>

            {}
            <div className="space-y-2 pt-2 text-sm md:text-base">
              {typeof selectedRoom.roomRate === "number" && (
                <div className="flex items-center text-slate-600">
                  <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5 text-amber-700 flex-shrink-0" />
                  <span className="font-medium">Rate:</span>
                  <span className="ml-1.5">
                    ${selectedRoom.roomRate.toFixed(2)} / night
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
              {}
              {}
            </div>
          </CardContent>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <BedDouble className="w-12 h-12 md:w-16 text-amber-500/80 mb-4" />
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
