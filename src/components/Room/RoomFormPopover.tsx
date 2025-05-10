// UI FORM: RoomForm.tsx
import React, { startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"; // Adjust path if needed
import { Button } from "../ui/button"; // Adjust path if needed
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"; // Adjust path if needed
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import useCreateRoom from "@/hooks/roomHooks/useCreateRoom"; // Adjust path if needed
import { Input } from "../ui/input"; // Adjust path if needed
import { Spinner } from "react-activity"; // Ensure this component is installed and imported
import { Room } from "@/types/types";

interface RoomFormProps {
  type: "Edit" | "Add";
  room?: Room;
}

const MAX_FILE_SIZE = 5000000; // 5MB
const MAX_FILES_COUNT = 5; // Example: allow up to 5 images
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Updated Zod schema
const formSchema = z.object({
  roomType: z.string().min(1, {
    message: "Please enter the type of the room.",
  }),
  roomNumber: z.string().min(1, { message: "Please enter the room number." }),
  maxGuests: z.preprocess((val) => {
    // Handle empty string or non-string values before Number conversion
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num; // Pass original 'val' if not a number, for Zod to catch type error
  }, z.number({ invalid_type_error: "Max guests must be a number." }).positive({ message: "Max guests must be a positive number." }).optional()),
  roomRate: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num; // Pass original 'val' if not a number
  }, z.number({ invalid_type_error: "Room rate must be a number." }).positive({ message: "Room rate must be a positive number." }).optional()),
  files: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Input must be a FileList"
    )
    .refine(
      (files) => files && files.length > 0,
      "At least one image is required."
    )
    .refine(
      (files) => files && files.length <= MAX_FILES_COUNT,
      `You can upload a maximum of ${MAX_FILES_COUNT} images.`
    )
    .refine(
      (files) =>
        files && Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB per image.`
    )
    .refine(
      (files) =>
        files &&
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported for all images."
    ),
});

type RoomFormValues = z.infer<typeof formSchema>;

const RoomFormPopover = ({ type, room }: RoomFormProps) => {
  const { createRoom, loading: roomCreateLoading } = useCreateRoom();

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: room?.roomType || "",
      roomNumber: room?.roomNumber || "",
      maxGuests: room?.maxGuests ?? undefined,
      roomRate: room?.roomRate ?? undefined,
      files: undefined,
    },
  });

  const onSubmit = async (values: RoomFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("roomType", values.roomType);
        formData.append("roomNumber", values.roomNumber);
        formData.append("maxGuests", (values.maxGuests ?? 0).toString());
        formData.append("roomRate", (values.roomRate ?? 0).toString());

        if (values.files && values.files.length > 0) {
          for (let i = 0; i < values.files.length; i++) {
            formData.append("files", values.files[i]);
          }
        }

        await createRoom(formData);
        form.reset();
      } catch (e) {
        console.error("Form submission error:", e);
        toast.error("An error occurred while submitting the form.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        className="w-full"
        asChild>
        <Button className="w-full">{type} Room</Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 space-y-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="h-auto">Room Data</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-8 p-1">
            <div className="flex flex-col space-y-3 w-full">
              <div className="flex md:flex-row flex-col justify-between w-full md:space-y-0 space-y-3">
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem className="md:w-[48%] w-full">
                      <FormLabel>Room Type</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="text"
                          placeholder="Room Type"
                          {...field}
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
                    <FormItem className="md:w-[48%] w-full">
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="text"
                          placeholder="Room Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row flex-col justify-between w-full md:space-y-0 space-y-3">
                <FormField
                  control={form.control}
                  name="maxGuests"
                  render={({ field }) => (
                    <FormItem className="md:w-[31%] w-full">
                      <FormLabel>Max Guests</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="number"
                          min={0}
                          placeholder="Max Guests"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
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
                    <FormItem className="md:w-[31%] w-full">
                      <FormLabel>Room Rate</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="number"
                          min={0}
                          placeholder="Room Rate"
                          step="0.01"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem className="md:w-[31%] w-full">
                      <FormLabel>Images (up to {MAX_FILES_COUNT})</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="file"
                          multiple
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={(e) => {
                            onChange(e.target.files || null);
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-1/2 self-end"
              disabled={roomCreateLoading}>
              {roomCreateLoading ? (
                <Spinner
                  size={10}
                  color="#000000"
                  className="h-5 w-5 animate-spin"
                  animating={roomCreateLoading}
                />
              ) : type === "Add" ? (
                "Add Room"
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFormPopover;
