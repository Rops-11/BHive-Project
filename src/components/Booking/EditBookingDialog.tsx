import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Booking } from "@/types/types";
import EditBookingRoomAndDateForm from "./EditBookingRoomAndDateForm";
import NormalBookingForm from "./NormalBookingForm";

const EditBookingDialog = ({
  booking,
  type,
  triggerClassName,
  refetchBookings,
  setIsDialogOpen,
}: {
  booking: Booking;
  type: "normal" | "room";
  triggerClassName?: string;
  refetchBookings: () => Promise<void>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog>
      <DialogTrigger
        className="z-[9999]"
        asChild>
        <Button className={triggerClassName}>
          {type === "normal" ? "Edit Booker Details" : "Edit Room & Date"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2">
        <DialogTitle>Edit Booking Details</DialogTitle>
        {type === "normal" && (
          <NormalBookingForm
            booking={booking}
            refetchBookings={refetchBookings}
            setIsDialogOpen={setIsDialogOpen}
          />
        )}
        {type === "room" && (
          <EditBookingRoomAndDateForm
            booking={booking}
            refetchBookings={refetchBookings}
            setIsDialogOpen={setIsDialogOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
