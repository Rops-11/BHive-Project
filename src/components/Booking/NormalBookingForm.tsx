"use client";

import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Booking } from "@/types/types";
import { toast } from "react-toastify";
import useUpdateBooking from "@/hooks/bookingHooks/useUpdateBooking";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter the guest's name.",
  }),
  mobileNumber: z
    .string()
    .length(11, {
      message: "Mobile number must be 11 digits.",
    })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .optional()
    .or(z.literal("")),
  numberOfAdults: z.coerce
    .number({
      required_error: "Number of adults is required.",
      invalid_type_error: "Must be a number.",
    })
    .min(1, { message: "At least 1 adult is required." }),
  numberOfChildren: z.coerce
    .number({
      required_error: "Number of children is required.",
      invalid_type_error: "Must be a number.",
    })
    .min(0, { message: "Number of children cannot be negative." }),
});

type FormValues = z.infer<typeof formSchema>;

interface NormalBookingFormProps {
  booking: Booking;
  refetchBookings: () => Promise<void> | void;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NormalBookingForm = ({
  booking,
  refetchBookings,
  setIsDialogOpen,
}: NormalBookingFormProps) => {
  const { updateNormalBooking, loading: updateLoading } = useUpdateBooking();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: booking?.name || "",
      mobileNumber: booking?.mobileNumber || "",
      email: booking?.email || "",

      numberOfAdults: booking?.numberOfAdults ?? 1,
      numberOfChildren: booking?.numberOfChildren ?? 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        name: booking.name || "",
        mobileNumber: booking.mobileNumber || "",
        email: booking.email || "",
        numberOfAdults: booking.numberOfAdults ?? 1,
        numberOfChildren: booking.numberOfChildren ?? 0,
      });
    }
  }, [booking, form]);

  const onSubmit = async (values: FormValues) => {
    if (!booking || !booking.id) {
      toast.error("Booking ID is missing. Cannot update.");
      return;
    }

    try {
      const updatePayload: Partial<Booking> = {
        name: values.name,
        mobileNumber: values.mobileNumber,
        email: values.email,
        numberOfAdults: values.numberOfAdults,
        numberOfChildren: values.numberOfChildren,
      };

      await updateNormalBooking(booking.id, updatePayload);

      setIsDialogOpen(false);
      await refetchBookings();
    } catch (error) {
      console.error("Failed to update booking details:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Guest Name"
                  {...field}
                  disabled={updateLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Mobile Number (e.g., 09XXXXXXXXX)"
                  {...field}
                  disabled={updateLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                  disabled={updateLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="numberOfAdults"
            render={({ field }) => (
              <FormItem className="w-full sm:w-1/2">
                <FormLabel>Number of Adults</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="#"
                    {...field}
                    disabled={updateLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfChildren"
            render={({ field }) => (
              <FormItem className="w-full sm:w-1/2">
                <FormLabel>Number of Children</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="#"
                    {...field}
                    disabled={updateLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updateLoading || !form.formState.isDirty}>
            {updateLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {updateLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NormalBookingForm;
