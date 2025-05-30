"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ROOM_TYPES } from "@/constants/roomType";
import { Input } from "../ui/input";
import useEditRoomRate from "@/hooks/roomHooks/useEditRoomRate";

const UpdateRoomRateDialog = () => {
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [newRate, setNewRate] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { editRoomRate, loading } = useEditRoomRate();

  const handleUpdateRate = async () => {
    if (!selectedRoomType) {
      alert("Please select a room type.");
      return;
    }

    const rateNumber = parseFloat(newRate);
    if (!newRate || isNaN(rateNumber) || rateNumber <= 0) {
      alert("Please enter a valid positive number for the rate.");
      return;
    }

    await editRoomRate({
      roomType: selectedRoomType,
      roomRate: rateNumber,
    });

    setSelectedRoomType("");
    setNewRate("");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (!loading) {
        setSelectedRoomType("");
        setNewRate("");
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {}
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full">
          Update Room Rate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Room Rate</DialogTitle>
          <DialogDescription>
            Select a room type and enter the new rate. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="roomType"
              className="text-right col-span-1 text-sm">
              {" "}
              {}
              Room Type
            </label>
            <Select
              value={selectedRoomType}
              onValueChange={setSelectedRoomType}
              disabled={loading}>
              <SelectTrigger
                id="roomType"
                className="col-span-3 w-full">
                <SelectValue placeholder="Select a room type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((roomType) => (
                  <SelectItem
                    value={roomType}
                    key={roomType}>
                    {roomType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="newRate"
              className="text-right col-span-1 text-sm">
              {" "}
              {}
              New Rate
            </label>
            <Input
              id="newRate"
              type="number"
              placeholder="e.g., 150.00"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="col-span-3 w-full"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdateRate}
            disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoomRateDialog;
