import React, { startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "../ui/input";
import { Spinner } from "react-activity";

interface RoomFormProps {
  type: "Edit" | "Add";
}

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  roomType: z.string().min(1, {
    message: "Please enter the type of the room.",
  }),
  roomNumber: z.string().min(1, { message: "Please enter the room number." }),
  maxGuests: z
    .number()
    .positive({ message: "Please enter a number higher than zero." })
    .optional()
    .or(z.literal("")),
  roomRate: z
    .number()
    .positive({ message: "Please enter a number higher than zero." })
    .optional()
    .or(z.literal("")),
  file: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const RoomForm = ({ type }: RoomFormProps) => {
  const { createRoom, loading: roomCreateLoading } = useCreateRoom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomType: "",
      roomNumber: "",
      maxGuests: undefined,
      roomRate: undefined,
      file: "",
    },
  });

  const onSubmit: (
    values: z.infer<typeof formSchema>
  ) => Promise<void> = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("roomType", values.roomType);
        formData.append("roomNumber", values.roomNumber);
        formData.append(
          "maxGuests",
          typeof values.maxGuests === "number"
            ? values.maxGuests.toString()
            : "0"
        );
        formData.append(
          "roomRate",
          typeof values.roomRate === "number" ? values.roomRate.toString() : "0"
        );
        if (values.file) {
          formData.append("file", values.file);
        }

        await createRoom(formData);
      } catch {
        toast.error("Unknown error occured while creating room.");
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
      <DialogContent className="w-1/2 space-y-0">
        <DialogTitle className="h-auto">Room Data</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-8">
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
                          placeholder="Max Guests"
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseInt(value, 10)
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
                          placeholder="Room Rate"
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseInt(value, 10)
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
                  name="file"
                  render={({ field }) => (
                    <FormItem className="md:w-[31%] w-full">
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          className="border-black"
                          type="file"
                          onChange={(e) => {
                            field.onChange(e.target.files?.[0] || null);
                          }}
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
              className="w-1/2 self-end">
              {roomCreateLoading ? (
                <Spinner
                  size={10}
                  color="#000000"
                  animating={roomCreateLoading}
                />
              ) : (
                "Add"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomForm;
