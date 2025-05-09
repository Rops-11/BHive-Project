import React from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Room } from "@/types/types";
import Image from "next/image";

const HotelRoomCard = ({ room }: { room: Room }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={
            "flex flex-row p-0 w-4/5 justify-between h-60 overflow-hidden bg-black text-white relative"
          }>
          <div className="flex flex-col w-5/8 h-full p-5 text-left relative z-20">
            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">
              {room.roomType}: {room.roomNumber}
            </h1>
            <p className="mt-2">
              Room Rate: ₱ {room.roomRate?.toFixed(2)} / night
            </p>
          </div>
          <div className="relative w-3/8 h-full">
            {room.images?.length ? (
              <Image
                key={room.images[0].name || room.id}
                alt={`Room ${room.roomNumber}`}
                src={`https://dwfbvqkcxeajmtqciozz.supabase.co/storage/v1/object/public/rooms/${room.id}/${room.images[0].name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <Image
                alt={`Room ${room.roomNumber} (placeholder)`}
                src="/assets/400x400.png"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-5/6 h-5/6">
        <DialogHeader>
          <DialogTitle>
            {room.roomType}: {room.roomNumber}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="mt-4">
            <p>
              <strong>Room Number:</strong> {room.roomNumber}
            </p>
            <p>
              <strong>Room Type:</strong> {room.roomType}
            </p>
            <p>
              <strong>Rate:</strong> ₱{room.roomRate?.toFixed(2)} per night
            </p>
            <p>
              <strong>Max Guests:</strong> {room.maxGuests}
            </p>
            <p>
              <strong>Availability:</strong>{" "}
              {room.isAvailable ? "Available" : "Not Available"}
            </p>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default HotelRoomCard;
