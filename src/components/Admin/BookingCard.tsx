"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/types/types";
import {
  CalendarDays,
  User,
  Phone,
  Users,
  Hash,
  BedDouble,
  DollarSign,
  Clock,
  XCircle,
  CheckCircle,
  CircleHelp,
  Loader,
  Loader2,
  FileImage,
  AlertTriangle,
  Edit,
  Trash2,
  CreditCard,
  Percent,
  Mail,
} from "lucide-react";
import EditBookingDialog from "@/components/Booking/EditBookingDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDeleteBooking from "@/hooks/bookingHooks/useDeleteBooking";
import useUpdateBookingStatus from "@/hooks/bookingHooks/useUpdateBookingStatus";
import { Spinner } from "react-activity";
import NextImage from "next/image";
import useUpdateBookingPaymentStatus from "@/hooks/bookingHooks/useUpdateBookingPaymentStatus";
import { formatDate } from "utils/utils";
import { z } from "zod";
import { normalFetch } from "utils/fetch";

const bookingNotificationPayloadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roomId: z.string().min(1),
  verified: z.boolean(),
  checkIn: z.string(),
});

type BookingNotificationPayload = z.infer<
  typeof bookingNotificationPayloadSchema
>;

export type ZodFieldErrors = Record<string, string[] | undefined>;

export type ErrorDetails =
  | ZodFieldErrors
  | Record<string, unknown>
  | string
  | null;

interface UseSendBookingNotificationOptions {
  onSuccess?: (data: { message: string }) => void;
  onError?: (error: string, details?: ErrorDetails) => void;
}

interface UseSendBookingNotificationReturn {
  sendNotification: (payload: BookingNotificationPayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const useSendBookingNotification = (
  options?: UseSendBookingNotificationOptions
): UseSendBookingNotificationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sendNotification = useCallback(
    async (payload: BookingNotificationPayload) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const validationResult =
        bookingNotificationPayloadSchema.safeParse(payload);
      if (!validationResult.success) {
        const errorMessage = "Invalid payload data for email notification.";
        const errorDetails: ZodFieldErrors =
          validationResult.error.flatten().fieldErrors;
        console.error(errorMessage, errorDetails);
        setError(errorMessage);
        options?.onError?.(errorMessage, errorDetails);
        setIsLoading(false);
        return;
      }

      try {
        const response = await normalFetch(
          "/api/utils/sendEmail",
          "post",
          payload
        );

        const contentType = response.headers.get("content-type");
        if (response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const responseData = await response.json();
            setSuccessMessage(
              responseData.message || "Notification sent successfully!"
            );
            options?.onSuccess?.(responseData);
          } else {
            const text = await response.text();
            console.warn(
              "Email API success but non-JSON response:",
              text.substring(0, 100)
            );
            setSuccessMessage("Notification processed (non-JSON response).");
            options?.onSuccess?.({
              message: "Notification processed (non-JSON response).",
            });
          }
        } else {
          let apiErrorMessage = `Request failed with status ${response.status}`;
          let errorDetailsFromApi: ErrorDetails = null;
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json();
              apiErrorMessage = errorData.message || apiErrorMessage;

              if (
                typeof errorData.errors === "object" &&
                errorData.errors !== null
              ) {
                errorDetailsFromApi = errorData.errors as Record<
                  string,
                  unknown
                >;
              } else if (typeof errorData.errors === "string") {
                errorDetailsFromApi = errorData.errors;
              }
            } catch {
              const text = await response.text();
              apiErrorMessage += `. Non-JSON error response: ${text.substring(
                0,
                200
              )}`;
            }
          } else {
            const text = await response.text();
            apiErrorMessage += `. HTML error response: ${text.substring(
              0,
              200
            )}`;
          }
          console.error(
            "API Error sending email:",
            apiErrorMessage,
            errorDetailsFromApi
          );
          setError(apiErrorMessage);
          options?.onError?.(apiErrorMessage, errorDetailsFromApi);
        }
      } catch (e: unknown) {
        let errorMessage =
          "An unexpected error occurred while sending the notification.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        console.error("Fetch Error sending email:", errorMessage, e);
        setError(errorMessage);
        options?.onError?.(errorMessage, null);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return { sendNotification, isLoading, error, successMessage };
};

type DisplayablePaymentStatus = "Partial" | "Paid";

const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

const getStatusInfo = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "complete":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Complete",
      } as const;
    case "ongoing":
      return {
        icon: Loader,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        label: "Ongoing",
      } as const;
    case "reserved":
      return {
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        label: "Reserved",
      } as const;
    case "cancelled":
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "Cancelled",
      } as const;
    case "pending":
      return {
        icon: CircleHelp,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        label: "Pending",
      } as const;
    default:
      return {
        icon: CircleHelp,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        label: status || "Unknown",
      } as const;
  }
};

const getPaymentStatusInfo = (status: DisplayablePaymentStatus | undefined) => {
  if (
    status === null ||
    status === undefined ||
    status?.toLowerCase() === "pending"
  ) {
    return {
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      label: "Pending",
    } as const;
  }
  switch (status?.toLowerCase()) {
    case "paid":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Paid",
      } as const;
    case "partial":
      return {
        icon: Percent,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        label: "Partial",
      } as const;
    default:
      return {
        icon: CircleHelp,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        label: "Unknown",
      } as const;
  }
};

const BookingCard = ({
  booking,
  refetchBookings,
}: {
  booking: Booking;
  refetchBookings: () => Promise<void>;
}) => {
  const [currentBookingStatus, setCurrentBookingStatus] = useState(
    booking.status
  );

  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<
    DisplayablePaymentStatus | undefined
  >(booking.paymentStatus);

  const bookingStatusInfo = getStatusInfo(currentBookingStatus);
  const BookingStatusIcon = bookingStatusInfo.icon;

  const paymentStatusDisplayInfo = getPaymentStatusInfo(currentPaymentStatus);
  const PaymentStatusIcon = paymentStatusDisplayInfo.icon;

  const { deleteBooking, loading: deleteLoading } = useDeleteBooking();
  const { updateStatus, loading: statusLoading } = useUpdateBookingStatus();
  const { updatePaymentStatus, loading: paymentStatusLoading } =
    useUpdateBookingPaymentStatus();

  const { sendNotification, isLoading: isSendingEmail } =
    useSendBookingNotification({
      onSuccess: (data) => {
        console.log("Email notification sent successfully:", data.message);
      },
      onError: (error, details) => {
        console.error("Failed to send email notification:", error, details);
      },
    });

  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isBookingStatusPopoverOpen, setIsBookingStatusPopoverOpen] =
    useState(false);
  const [isPaymentStatusPopoverOpen, setIsPaymentStatusPopoverOpen] =
    useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isDeclineLoading, setIsDeclineLoading] = useState(false);

  const prepareEmailPayload = (
    currentBooking: Booking,
    verifiedStatus: boolean
  ): BookingNotificationPayload | null => {
    if (
      !currentBooking.email ||
      !currentBooking.name ||
      !currentBooking.checkIn
    ) {
      console.warn(
        "Missing essential details (email, name, checkIn) for email notification for booking ID:",
        currentBooking.id
      );
      return null;
    }

    const roomId = currentBooking.room?.id ?? currentBooking.roomId;
    if (!roomId) {
      console.warn(
        "Missing room ID for email notification for booking ID:",
        currentBooking.id
      );
      return null;
    }

    return {
      email: currentBooking.email,
      name: currentBooking.name,
      roomId: String(roomId),
      verified: verifiedStatus,
      checkIn: formatDate(currentBooking.checkIn),
    };
  };

  const handleDelete = async () => {
    if (!booking.id) return;
    await deleteBooking(booking.id);
    setIsDeleteConfirmOpen(false);
    setIsMainDialogOpen(false);
    await refetchBookings();
  };

  const handleChangeBookingStatus = async (
    newStatus: "Reserved" | "Ongoing" | "Complete" | "Cancelled"
  ) => {
    if (!booking.id) return;

    const statusBeforeChange = currentBookingStatus;

    setCurrentBookingStatus(newStatus);
    setIsBookingStatusPopoverOpen(false);

    try {
      await updateStatus(booking.id, newStatus);

      if (statusBeforeChange?.toLowerCase() === "pending") {
        let payload: BookingNotificationPayload | null = null;
        if (newStatus.toLowerCase() === "reserved") {
          payload = prepareEmailPayload(booking, true);
        } else if (newStatus.toLowerCase() === "cancelled") {
          payload = prepareEmailPayload(booking, false);
        }

        if (payload) {
          await sendNotification(payload);
        }
      }
      await refetchBookings();
    } catch (error) {
      console.error(`Error updating booking status to ${newStatus}:`, error);
      setCurrentBookingStatus(statusBeforeChange);
    }
  };

  const handleChangePaymentStatus = async (
    newPaymentStatus: DisplayablePaymentStatus
  ) => {
    if (!booking.id) return;
    const originalPaymentStatus = currentPaymentStatus;
    setCurrentPaymentStatus(newPaymentStatus);
    setIsPaymentStatusPopoverOpen(false);

    try {
      await updatePaymentStatus(booking.id, newPaymentStatus);
      await refetchBookings();
    } catch (error) {
      console.error(
        `Error updating payment status to ${newPaymentStatus}:`,
        error
      );
      setCurrentPaymentStatus(originalPaymentStatus);
    }
  };

  const handleConfirmPaymentAndReserve = async () => {
    if (!booking.id) return;

    const originalBookingStatus = currentBookingStatus;
    const originalPaymentStatus = currentPaymentStatus;

    const newBookingStatus = "Reserved" as const;
    const newActualPaymentStatus = "Partial" as const;

    setCurrentBookingStatus(newBookingStatus);
    setCurrentPaymentStatus(newActualPaymentStatus);

    try {
      await updateStatus(booking.id, newBookingStatus);
      await updatePaymentStatus(booking.id, newActualPaymentStatus);

      const payload = prepareEmailPayload(booking, true);
      if (payload) {
        await sendNotification(payload);
      } else {
        console.warn(
          "Booking confirmed and reserved, but email notification could not be sent due to missing/invalid details in payload for booking ID:",
          booking.id
        );
      }

      setIsProofDialogOpen(false);
      await refetchBookings();
    } catch (error) {
      console.error("Error confirming payment and reserving:", error);
      setCurrentBookingStatus(originalBookingStatus);
      setCurrentPaymentStatus(originalPaymentStatus);
    }
  };

  const handleDeclinePaymentAndBooking = async () => {
    if (!booking.id) return;

    setIsDeclineLoading(true);

    const payload = prepareEmailPayload(booking, false);
    if (payload) {
      try {
        await sendNotification(payload);
      } catch (emailError) {
        console.error(
          "Failed to send decline notification email, but proceeding with booking deletion:",
          emailError
        );
      }
    } else {
      console.warn(
        "Could not prepare email payload for booking decline (ID:",
        booking.id,
        "). Proceeding with deletion."
      );
    }

    try {
      await deleteBooking(booking.id);
    } catch (deletionError) {
      console.error("Error deleting booking after decline:", deletionError);
      setIsDeclineLoading(false);
      return;
    }

    setIsProofDialogOpen(false);
    setIsMainDialogOpen(false);
    await refetchBookings();
    setIsDeclineLoading(false);
  };

  const paymentProofImageUrl = booking.image?.name
    ? `https://dwfbvqkcxeajmtqciozz.supabase.co/storage/v1/object/public/payment/${booking.id}/${booking.image.name}`
    : null;

  const availableBookingStatusOptions = [
    "Reserved",
    "Ongoing",
    "Complete",
    "Cancelled",
  ] as const;

  const availablePaymentStatusOptionsToSet = ["Partial", "Paid"] as const;

  const anyLoading =
    statusLoading ||
    paymentStatusLoading ||
    isSendingEmail ||
    isDeclineLoading ||
    deleteLoading;

  return (
    <Dialog
      open={isMainDialogOpen}
      onOpenChange={(open) => {
        if (anyLoading && !open) return;
        setIsMainDialogOpen(open);
      }}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Room {booking.room?.roomNumber ?? "N/A"}</span>
              <Badge
                variant="outline"
                className={`border-none ${bookingStatusInfo.bgColor} ${bookingStatusInfo.color} font-medium capitalize`}>
                <BookingStatusIcon className="h-4 w-4 mr-1.5" />
                {bookingStatusInfo.label}
              </Badge>
            </CardTitle>
            <CardDescription>
              <span className="font-medium">{booking.name}</span> |{" "}
              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] md:max-w-[600px] max-h-[95vh] overflow-y-auto p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">
            Booking Details
          </DialogTitle>
          <DialogDescription>ID: {booking.id ?? "N/A"}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-2">
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Guest Information
              </h3>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Name:</span>
                <span className="truncate">{booking.name ?? "N/A"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Email:</span>
                <span className="truncate">{booking.email ?? "N/A"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Mobile:</span>
                <span className="truncate">
                  {booking.mobileNumber ?? "N/A"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Guests:</span>
                <span className="truncate">
                  {booking.numberOfAdults ?? 0} Adult(s),{" "}
                  {booking.numberOfChildren ?? 0} Child(ren)
                </span>
              </div>
            </div>
            {}
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Dates & Status
              </h3>
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Check-in:</span>
                <span className="truncate">{formatDate(booking.checkIn)}</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Check-out:</span>
                <span className="truncate">{formatDate(booking.checkOut)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Booked On:</span>
                <span className="truncate">
                  {formatDate(booking.dateBooked)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <BookingStatusIcon
                  className={`h-4 w-4 mr-2 ${bookingStatusInfo.color} flex-shrink-0`}
                />
                <span className="font-medium mr-1.5">Status:</span>
                <Popover
                  open={isBookingStatusPopoverOpen}
                  onOpenChange={setIsBookingStatusPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Badge
                      variant="outline"
                      className={`border-none hover:opacity-80 transition-opacity cursor-pointer ${bookingStatusInfo.bgColor} ${bookingStatusInfo.color} font-medium capitalize`}
                      onClick={() => {
                        if (anyLoading) return;
                        if (
                          currentBookingStatus?.toLowerCase() === "pending" &&
                          !paymentProofImageUrl &&
                          currentPaymentStatus?.toLowerCase() === "pending"
                        ) {
                          return;
                        }
                        setIsBookingStatusPopoverOpen(
                          !isBookingStatusPopoverOpen
                        );
                      }}>
                      {statusLoading ? (
                        <Spinner
                          size={12}
                          color="currentColor"
                          className="mr-1"
                        />
                      ) : null}
                      {bookingStatusInfo.label}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="flex flex-col w-auto space-y-1 p-1.5">
                    {availableBookingStatusOptions.map((statusOption) => {
                      if (
                        currentBookingStatus?.toLowerCase() ===
                        statusOption.toLowerCase()
                      )
                        return null;

                      if (currentBookingStatus?.toLowerCase() === "pending") {
                        if (
                          !paymentProofImageUrl &&
                          currentPaymentStatus?.toLowerCase() === "pending" &&
                          statusOption !== "Cancelled"
                        ) {
                          return null;
                        }
                        if (
                          paymentProofImageUrl &&
                          !["Reserved", "Cancelled"].includes(statusOption)
                        ) {
                          return null;
                        }
                      }

                      const optionInfo = getStatusInfo(statusOption);
                      return (
                        <Button
                          key={statusOption}
                          variant="ghost"
                          size="sm"
                          disabled={anyLoading}
                          className={`w-full justify-start cursor-pointer text-xs h-auto py-1.5 px-2 ${optionInfo.bgColor} ${optionInfo.color} hover:${optionInfo.bgColor}/80`}
                          onClick={() => {
                            handleChangeBookingStatus(statusOption);
                          }}>
                          <optionInfo.icon className="h-3.5 w-3.5 mr-2" />
                          {optionInfo.label}
                        </Button>
                      );
                    })}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <Separator />
          {}
          {booking.room && (
            <div className="space-y-1.5 py-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Room Information
              </h3>
              <div className="flex items-center text-sm">
                <Hash className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Number:</span>
                <span className="truncate">{booking.room.roomNumber}</span>
              </div>
              <div className="flex items-center text-sm">
                <BedDouble className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Type:</span>
                <span className="truncate">{booking.room.roomType}</span>
              </div>
              {(booking.room.id || booking.roomId) && (
                <div className="flex items-center text-sm">
                  <Hash className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0 opacity-50" />
                  <span className="font-medium mr-1.5 text-muted-foreground">
                    Room ID:
                  </span>
                  <span className="truncate text-muted-foreground">
                    {booking.room.id ?? booking.roomId}
                  </span>
                </div>
              )}
            </div>
          )}
          <Separator />
          {}
          <div className="space-y-3 py-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Payment
            </h3>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Total Price:</span>
                <span className="truncate">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>
              {paymentProofImageUrl && (
                <Dialog
                  open={isProofDialogOpen}
                  onOpenChange={(open) => {
                    if (anyLoading && !open) return;
                    setIsProofDialogOpen(open);
                    if (open) {
                      setImageLoading(true);
                      setImageError(false);
                    }
                  }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 px-2"
                      disabled={anyLoading}>
                      <FileImage className="h-3.5 w-3.5 mr-1.5" />
                      View Proof
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl p-0">
                    <DialogHeader className="p-4 border-b">
                      <DialogTitle>Proof of Payment</DialogTitle>
                      <DialogDescription>
                        Booking ID: {booking.id}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-1 aspect-[3/4] relative w-full max-h-[70vh] flex items-center justify-center bg-muted/30">
                      {imageLoading && !imageError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                          <Loader2 className="h-8 w-8 animate-spin mb-2" />
                          <p>Loading image...</p>
                        </div>
                      )}
                      {imageError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
                          <AlertTriangle className="h-8 w-8 mb-2" />
                          <p>Could not load payment proof.</p>
                        </div>
                      )}
                      {paymentProofImageUrl && (
                        <NextImage
                          key={paymentProofImageUrl}
                          alt={`Proof of Payment for booking ${booking.id}`}
                          src={paymentProofImageUrl}
                          fill
                          className={`object-contain transition-opacity duration-300 ${
                            imageLoading || imageError
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                          onLoadingComplete={() => {
                            setImageLoading(false);
                            setImageError(false);
                          }}
                          onError={() => {
                            setImageLoading(false);
                            setImageError(true);
                          }}
                        />
                      )}
                      {!paymentProofImageUrl && !imageLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                          <FileImage className="h-8 w-8 mb-2" />
                          <p>No payment proof available.</p>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="p-4 border-t flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:gap-x-2">
                      {currentBookingStatus?.toLowerCase() === "pending" &&
                        !imageError &&
                        paymentProofImageUrl && (
                          <>
                            <Button
                              onClick={handleConfirmPaymentAndReserve}
                              disabled={anyLoading}
                              className="w-full sm:w-auto">
                              {statusLoading ||
                              paymentStatusLoading ||
                              isSendingEmail ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              )}
                              Confirm & Reserve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeclinePaymentAndBooking}
                              disabled={anyLoading}
                              className="w-full sm:w-auto">
                              {isDeclineLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="mr-2 h-4 w-4" />
                              )}
                              Decline Payment
                            </Button>
                          </>
                        )}
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          disabled={anyLoading}>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="flex items-center text-sm">
              <PaymentStatusIcon
                className={`h-4 w-4 mr-2 ${paymentStatusDisplayInfo.color} flex-shrink-0`}
              />
              <span className="font-medium mr-1.5">Payment Status:</span>
              <Popover
                open={isPaymentStatusPopoverOpen}
                onOpenChange={setIsPaymentStatusPopoverOpen}>
                <PopoverTrigger asChild>
                  <Badge
                    variant="outline"
                    className={`border-none hover:opacity-80 transition-opacity cursor-pointer ${paymentStatusDisplayInfo.bgColor} ${paymentStatusDisplayInfo.color} font-medium capitalize`}
                    onClick={() => {
                      if (!anyLoading)
                        setIsPaymentStatusPopoverOpen(
                          !isPaymentStatusPopoverOpen
                        );
                    }}>
                    {paymentStatusLoading ? (
                      <Spinner
                        size={12}
                        color="currentColor"
                        className="mr-1"
                      />
                    ) : null}
                    {paymentStatusDisplayInfo.label}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="flex flex-col w-auto space-y-1 p-1.5">
                  {availablePaymentStatusOptionsToSet.map((statusOption) => {
                    if (
                      currentPaymentStatus?.toLowerCase() ===
                      statusOption.toLowerCase()
                    )
                      return null;

                    const optionInfo = getPaymentStatusInfo(statusOption);
                    return (
                      <Button
                        key={statusOption}
                        variant="ghost"
                        size="sm"
                        disabled={anyLoading}
                        className={`w-full justify-start cursor-pointer text-xs h-auto py-1.5 px-2 ${optionInfo.bgColor} ${optionInfo.color} hover:${optionInfo.bgColor}/80`}
                        onClick={() => {
                          handleChangePaymentStatus(statusOption);
                        }}>
                        <optionInfo.icon className="h-3.5 w-3.5 mr-2" />
                        {optionInfo.label}
                      </Button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {}
          {booking.bookingType && (
            <>
              <Separator />
              <div className="flex items-center text-sm py-2">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Booking Type:</span>
                <span className="truncate">{booking.bookingType}</span>
              </div>
            </>
          )}
        </div>
        {}
        <DialogFooter className="flex flex-col space-y-2 pt-4 md:flex-row md:space-y-0 md:space-x-2 md:justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto"
                disabled={anyLoading}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="flex flex-col w-auto p-2 space-y-1">
              <EditBookingDialog
                booking={booking}
                type="normal"
                refetchBookings={refetchBookings}
                setIsDialogOpen={setIsMainDialogOpen}
              />
              <EditBookingDialog
                booking={booking}
                type="room"
                refetchBookings={refetchBookings}
                setIsDialogOpen={setIsMainDialogOpen}
              />
            </PopoverContent>
          </Popover>

          <Dialog
            open={isDeleteConfirmOpen}
            onOpenChange={(open) => {
              if (anyLoading && !open) return;
              setIsDeleteConfirmOpen(open);
            }}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full md:w-auto"
                disabled={anyLoading}>
                {deleteLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this booking for{" "}
                  <strong>{booking.name}</strong> (Room{" "}
                  {booking.room?.roomNumber ?? booking.roomId ?? "N/A"})? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={anyLoading}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={anyLoading}>
                  {deleteLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto"
              disabled={anyLoading}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingCard;
