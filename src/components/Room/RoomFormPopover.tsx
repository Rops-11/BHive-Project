"use client";
import React, { useMemo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import useCreateRoom from "@/hooks/roomHooks/useCreateRoom";
import useEditRoom from "@/hooks/roomHooks/useEditRoom";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Room } from "@/types/types";
import { AMENITIES } from "@/constants/amenities";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface RoomFormProps {
  type: "Edit" | "Add";
  room?: Room;
  onFormSubmitSuccess?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES_COUNT = 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createRoomFormSchema = (formType: "Add" | "Edit") => {
  const filesBaseSchema = z
    .custom<FileList | undefined | null | string[]>(
      (val): val is FileList | undefined | null | string[] =>
        val === undefined ||
        val === null ||
        val instanceof FileList ||
        (Array.isArray(val) && val.every((item) => typeof item === "string")),
      "Input must be a FileList, an array of image URLs, or empty."
    )
    .refine((files) => {
      if (!(files instanceof FileList)) return true;
      return files.length <= MAX_FILES_COUNT;
    }, `You can upload a maximum of ${MAX_FILES_COUNT} new images.`)
    .refine((files) => {
      if (!(files instanceof FileList)) return true;
      return Array.from(files).every((file) => file.size <= MAX_FILE_SIZE);
    }, `Max file size is 5MB per new image.`)
    .refine((files) => {
      if (!(files instanceof FileList)) return true;
      return Array.from(files).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type)
      );
    }, "Only .jpg, .jpeg, .png and .webp formats are supported for new images.");

  return z.object({
    roomType: z.string().min(1, {
      message: "Please enter the type of the room.",
    }),
    roomNumber: z.string().min(1, { message: "Please enter the room number." }),
    maxGuests: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({ required_error: "Max guests is required.", invalid_type_error: "Max guests must be a number." }).positive({ message: "Max guests must be a positive number." })),
    roomRate: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({ required_error: "Room rate is required.", invalid_type_error: "Room rate must be a number." }).positive({ message: "Room rate must be a positive number." })),
    files:
      formType === "Add"
        ? filesBaseSchema.refine(
            (files): files is FileList =>
              files instanceof FileList && files.length > 0,
            "At least one image is required."
          )
        : filesBaseSchema.optional(),
    amenities: z.array(z.string()).min(1, "At least 1 amenity is required."),
  });
};

const RoomFormPopover = ({
  type,
  room,
  onFormSubmitSuccess,
}: RoomFormProps) => {
  const { createRoom, loading: roomCreateLoading } = useCreateRoom();
  const { editRoom, loading: roomEditLoading } = useEditRoom();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isLoading = type === "Add" ? roomCreateLoading : roomEditLoading;

  const currentFormSchema = useMemo(() => createRoomFormSchema(type), [type]);
  type CurrentRoomFormValues = z.infer<typeof currentFormSchema>;

  const form = useForm<CurrentRoomFormValues>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: {
      roomType: room?.roomType || "",
      roomNumber: room?.roomNumber || "",
      maxGuests: room?.maxGuests ?? undefined,
      roomRate: room?.roomRate ?? undefined,
      files: undefined,
      amenities: room?.amenities || [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isDialogOpen) {
      form.reset({
        roomType: room?.roomType || "",
        roomNumber: room?.roomNumber || "",
        maxGuests: room?.maxGuests ?? undefined,
        roomRate: room?.roomRate ?? undefined,
        files: undefined,
        amenities: room?.amenities || [],
      });
    }
  }, [isDialogOpen, room, form, type]);

  const onSubmit = async (values: CurrentRoomFormValues) => {
    try {
      const formData = new FormData();
      formData.append("roomType", values.roomType);
      formData.append("roomNumber", values.roomNumber);

      if (values.maxGuests !== undefined)
        formData.append("maxGuests", values.maxGuests.toString());
      if (values.roomRate !== undefined)
        formData.append("roomRate", values.roomRate.toString());

      if (values.files instanceof FileList && values.files.length > 0) {
        for (let i = 0; i < values.files.length; i++) {
          formData.append("files", values.files[i]);
        }
      }

      if (values.amenities && values.amenities.length > 0) {
        values.amenities.forEach((amenity) =>
          formData.append("amenities[]", amenity)
        );
      }

      if (type === "Add") {
        await createRoom(formData);
      } else if (type === "Edit" && room?.id) {
        formData.append("id", room.id);
        await editRoom(formData);
      } else if (type === "Edit" && !room?.id) {
        toast.error("Cannot update: Room ID is missing.");
        return;
      }

      form.reset();
      setIsDialogOpen(false);
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error("An unexpected error occurred while submitting the form.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isLoading && !open) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(open);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">{type} Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "Add"
              ? "Add New Room"
              : `Edit Room: ${room?.roomType || ""} ${room?.roomNumber || ""}`}
          </DialogTitle>
          <DialogDescription>
            {type === "Add"
              ? "Fill in the details below to add a new room."
              : "Update the details for this room."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Deluxe King"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 101"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <FormField
                control={form.control}
                name="maxGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="e.g., 2"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g., 150.00"
                        step="0.01"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="files"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <FormLabel>
                    {type === "Add" ? "Images" : "Upload New Images"} (up to{" "}
                    {MAX_FILES_COUNT}, max 5MB each)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) => {
                        onChange(e.target.files || null);
                      }}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                      disabled={isLoading}
                      className="pt-1.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base font-medium">
                      Amenities
                    </FormLabel>
                    <FormMessage />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
                    {AMENITIES.map((amenityItem, index) => (
                      <FormField
                        key={amenityItem}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(amenityItem);

                          const checkboxId = `amenity-${amenityItem
                            .toLowerCase()
                            .replace(/\s+/g, "-")}-${index}`;

                          return (
                            <FormItem
                              className={cn(
                                "rounded-md border",
                                "hover:bg-accent hover:text-accent-foreground",
                                isChecked &&
                                  "bg-primary text-primary-foreground"
                              )}>
                              <FormLabel
                                htmlFor={checkboxId}
                                className={cn(
                                  "flex flex-row items-center space-x-2 p-2.5 cursor-pointer w-full h-full",
                                  "font-normal text-sm"
                                )}>
                                <FormControl>
                                  <Checkbox
                                    id={checkboxId}
                                    checked={isChecked}
                                    onCheckedChange={(checkedState) => {
                                      const currentValues = field.value || [];
                                      if (checkedState === true) {
                                        field.onChange([
                                          ...currentValues,
                                          amenityItem,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== amenityItem
                                          )
                                        );
                                      }
                                    }}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <span className="leading-tight select-none">
                                  {" "}
                                  {amenityItem}
                                </span>
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading || (!form.formState.isDirty && type === "Edit")
                }>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading
                  ? type === "Add"
                    ? "Adding..."
                    : "Saving..."
                  : type === "Add"
                  ? "Add Room"
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFormPopover;
