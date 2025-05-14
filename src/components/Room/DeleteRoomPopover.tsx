import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import React from "react";
import { Button } from "../ui/button";
import { Room } from "@/types/types";
import useDeleteRoom from "@/hooks/roomHooks/useDeleteRoom";
import { toast } from "react-toastify";
import { Spinner } from "react-activity";

const DeleteRoomPopover = ({ room }: { room: Room }) => {
  const { deleteRoom, loading } = useDeleteRoom();

  const handleDelete = async () => {
    try {
      deleteRoom(room.id!);
      location.reload();
    } catch {
      toast.error("Unknown error on delete");
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="w-full"
        asChild>
        <Button className="w-full bg-red-500">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:w-1/2 w-full">
        {loading ? (
          <Spinner
            loading={loading}
            size={10}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Delete Room</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to delete the room {room.roomType}:{" "}
              {room.roomNumber}?
            </DialogDescription>
            <DialogFooter>
              <Button
                className="bg-red-500"
                onClick={handleDelete}>
                Delete
              </Button>
              <Button>Cancel</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoomPopover;
