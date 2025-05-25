"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Room } from "@/types/types";
import useDeleteRoom from "@/hooks/roomHooks/useDeleteRoom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const DeleteRoomPopover = ({
  room,
  onDeleteSuccess,
}: {
  room: Room;
  onDeleteSuccess: () => void;
}) => {
  const { deleteRoom, loading } = useDeleteRoom();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (!room.id) {
      toast.error("Room ID is missing. Cannot delete.");
      return;
    }

    await deleteRoom(room.id);
    onDeleteSuccess();
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (loading && !open) {
      setIsOpen(true);
    } else {
      setIsOpen(open);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setIsOpen(true)}>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {" "}
        {}
        <DialogHeader>
          <DialogTitle>Delete Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the room: <br />
            <strong className="font-semibold text-foreground">
              {room.roomType} - {room.roomNumber || "N/A"}
            </strong>
            ?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          {" "}
          {}
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoomPopover;
