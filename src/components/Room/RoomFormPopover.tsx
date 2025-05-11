"use client";
import React, { startTransition, useMemo } from "react";
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
import useEditRoom from "@/hooks/roomHooks/useEditRoom"; // Adjust path if needed
import { Input } from "../ui/input"; // Adjust path if needed
import { Spinner } from "react-activity"; // Ensure this component is installed and imported
import { Room } from "@/types/types";
// import { useRouter } from "next/navigation"; // Not used, location.reload() is used

interface RoomFormProps {
  type: "Edit" | "Add";
  room?: Room;
}

const MAX_FILE_SIZE = 5000000; // 5MB
const MAX_FILES_COUNT = 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Schema factory function
const createRoomFormSchema = (formType: "Add" | "Edit") => {
  // Base schema for files: validates if files are present, but doesn't require them.
  // Allows undefined, null, or an empty FileList to pass basic checks.
  const filesBaseSchema = z
    .custom<FileList | undefined | null>(
      (val): val is FileList | undefined | null =>
        val === undefined || val === null || val instanceof FileList,
      "Input must be a FileList or empty."
    )
    .refine(
      (files) =>
        !files || files.length === 0 || files.length <= MAX_FILES_COUNT,
      `You can upload a maximum of ${MAX_FILES_COUNT} images.`
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB per image.`
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported for all images."
    );

  return z.object({
    roomType: z.string().min(1, {
      message: "Please enter the type of the room.",
    }),
    roomNumber: z.string().min(1, { message: "Please enter the room number." }),
    maxGuests: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({ invalid_type_error: "Max guests must be a number." }).positive({ message: "Max guests must be a positive number." }).optional()),
    roomRate: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number({ invalid_type_error: "Room rate must be a number." }).positive({ message: "Room rate must be a positive number." }).optional()),
    files:
      formType === "Add"
        ? filesBaseSchema.refine(
            // For "Add", at least one file is required
            (files): files is FileList =>
              files instanceof FileList && files.length > 0,
            "At least one image is required."
          )
        : filesBaseSchema, // For "Edit", files are optional (no new files can be uploaded)
  });
};

// Infer type from the schema factory's return type for a specific mode,
// or use a wider type if needed. For useForm, the specific schema instance's inference will work.
// type RoomFormValues = z.infer<ReturnType<typeof createRoomFormSchema>>;

const RoomFormPopover = ({ type, room }: RoomFormProps) => {
  const { createRoom, loading: roomCreateLoading } = useCreateRoom();
  const { editRoom, loading: roomEditLoading } = useEditRoom();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  // const router = useRouter(); // You are using location.reload() instead

  // Create the schema dynamically based on the 'type' prop
  const currentFormSchema = useMemo(() => createRoomFormSchema(type), [type]);
  type CurrentRoomFormValues = z.infer<typeof currentFormSchema>;

  const form = useForm<CurrentRoomFormValues>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: {
      roomType: room?.roomType || "",
      roomNumber: room?.roomNumber || "",
      maxGuests: room?.maxGuests ?? undefined,
      roomRate: room?.roomRate ?? undefined,
      files: undefined, // Always initialize file input as empty
    },
  });

  // Reset form when dialog opens or when the 'room' prop changes for an open "Edit" dialog
  React.useEffect(() => {
    if (isDialogOpen) {
      form.reset({
        roomType: room?.roomType || "",
        roomNumber: room?.roomNumber || "",
        maxGuests: room?.maxGuests ?? undefined,
        roomRate: room?.roomRate ?? undefined,
        files: undefined, // File input should always be reset
      });
    }
  }, [isDialogOpen, room, form.reset]); // form.reset is stable

  const onSubmit = async (values: CurrentRoomFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("roomType", values.roomType);
        formData.append("roomNumber", values.roomNumber);
        formData.append("maxGuests", (values.maxGuests ?? "").toString());
        formData.append("roomRate", (values.roomRate ?? "").toString());

        // Only append files if they are provided (i.e., user selected new files)
        if (values.files && values.files.length > 0) {
          for (let i = 0; i < values.files.length; i++) {
            formData.append("files", values.files[i]);
          }
        }

        if (type === "Add") {
          await createRoom(formData);
        } else if (type === "Edit" && room?.id) {
          formData.append("id", room.id);
          await editRoom(formData);
        } else if (type === "Edit" && !room?.id) {
          toast.error("Cannot update: Room ID is missing.");
          return; // Prevent further execution
        }

        form.reset();
        setIsDialogOpen(false); // Close dialog on success

        // Using location.reload() as per your current implementation.
        // For a Next.js app router, router.refresh() is often preferred for soft refreshes.
        location.reload();
      } catch {
        toast.error("An error occurred while submitting the form.");
      }
    });
  };

  const isLoading = type === "Add" ? roomCreateLoading : roomEditLoading;

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          onClick={() => setIsDialogOpen(true)}>
          {type} Room
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 space-y-0 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="h-auto">
          {type === "Add"
            ? "Add New Room"
            : `Edit Room: ${room?.roomNumber || ""}`}
        </DialogTitle>
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
                          placeholder="e.g., 100.00"
                          step="0.01"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
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
                  render={(
                    { field: { onChange, onBlur, name /* ref */ } } // ref is handled by RHF spread
                  ) => (
                    <FormItem className="md:w-[31%] w-full">
                      <FormLabel>Images (up to {MAX_FILES_COUNT})</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="file"
                          multiple
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={(e) => {
                            onChange(e.target.files || null); // Pass FileList or null
                          }}
                          onBlur={onBlur}
                          name={name}
                          // The 'ref' from render prop is correctly spread via {...field}
                          // For file inputs, react-hook-form's Controller handles the ref internally.
                          // If you were using field.ref directly, you might assign it to the input's ref prop.
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
              disabled={isLoading}>
              {isLoading ? (
                <Spinner
                  size={10}
                  color="#FFFFFF"
                  className="h-5 w-5"
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
