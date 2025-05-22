"use client";

import React, { useEffect, startTransition } from "react";
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
import { Spinner } from "react-activity";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter your name.",
  }),
  mobileNumber: z.string().length(11, {
    message: "Please enter your mobile number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  numberOfAdults: z.coerce
    .number({ invalid_type_error: "Number is required." })
    .min(1, { message: "At least 1 adult is required." }),
  numberOfChildren: z.coerce
    .number({ invalid_type_error: "Number is required." })
    .min(0, { message: "Number of children cannot be negative." }),
});

type FormValues = z.infer<typeof formSchema>;

const NormalBookingForm = ({
  booking,
  refetchBookings,
  setIsDialogOpen,
}: {
  booking: Booking;
  refetchBookings: () => Promise<void>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { updateNormalBooking, loading: updateLoading } = useUpdateBooking();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      numberOfAdults: undefined,
      numberOfChildren: undefined,
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        name: booking.name || "",
        mobileNumber: booking.mobileNumber || "",
        email: booking.email || "",
        numberOfAdults: booking.numberOfAdults ?? undefined,
        numberOfChildren: booking.numberOfChildren ?? undefined,
      });
    }
  }, [booking]);

  const onSubmit = async (values: FormValues) => {
    if (
      !booking ||
      !booking.id ||
      !booking.roomId ||
      !booking.checkIn ||
      !booking.checkOut
    ) {
      toast.error("Booking information is incomplete. Cannot update.");
      console.error("Incomplete booking data:", booking);
      return;
    }

    startTransition(async () => {
      try {
        const updatePayload: Booking = {
          name: values.name,
          mobileNumber: values.mobileNumber,
          email: values.email,
          numberOfAdults: values.numberOfAdults,
          numberOfChildren: values.numberOfChildren,
        };

        await updateNormalBooking(booking.id!, updatePayload);
        setIsDialogOpen(false);
        refetchBookings();
      } catch (error) {
        console.error("Failed to update booking details:", error);
        toast.error("Failed to update booking details. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Name</FormLabel>
              <FormControl>
                <Input
                  className="border-black"
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
                  className="border-black"
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
                  className="border-black"
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

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="numberOfAdults"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Number of Adults</FormLabel>
                <FormControl>
                  <Input
                    className="border-black"
                    type="number"
                    min="1"
                    placeholder="#"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
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
              <FormItem className="w-full md:w-1/2">
                <FormLabel>Number of Children</FormLabel>
                <FormControl>
                  <Input
                    className="border-black"
                    type="number"
                    min="0"
                    placeholder="#"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                    disabled={updateLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={
              updateLoading ||
              !form.formState.isDirty ||
              !form.formState.isValid
            }>
            {updateLoading ? (
              <Spinner
                size={10}
                color="#FFFFFF"
                animate={updateLoading}
              />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NormalBookingForm;
