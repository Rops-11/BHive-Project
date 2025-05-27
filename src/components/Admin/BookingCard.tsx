"use client";

import React, { useState } from "react";
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

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

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
      };
    case "ongoing":
      return { icon: Loader, color: "text-blue-600", bgColor: "bg-blue-100" };
    case "reserved":
      return {
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      };
    case "cancelled":
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    case "pending":
      return {
        icon: CircleHelp,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      };
    default:
      return {
        icon: CircleHelp,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      };
  }
};

const BookingCard = ({
  booking,
  refetchBookings,
}: {
  booking: Booking;
  refetchBookings: () => Promise<void>;
}) => {
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const statusInfo = getStatusInfo(bookingStatus);
  const StatusIcon = statusInfo.icon;
  const { deleteBooking, loading: deleteLoading } = useDeleteBooking();
  const { updateStatus, loading: statusLoading } = useUpdateBookingStatus();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    if (!booking.id) return;
    await deleteBooking(booking.id);
    setIsDeleteConfirmOpen(false);
    setIsDialogOpen(false);
    await refetchBookings();
  };

  const handleChangeStatus = async (
    newStatus: "Reserved" | "Ongoing" | "Complete" | "Cancelled" | "Pending"
  ) => {
    if (!booking.id) return;
    await updateStatus(booking.id, newStatus);
    setBookingStatus(newStatus);
    setStatusOpen(false);
    await refetchBookings();
  };

  const handleConfirmPayment = async () => {
    await handleChangeStatus("Reserved");
    setIsProofDialogOpen(false);
  };

  const paymentProofImageUrl = booking.image?.name
    ? `https://dwfbvqkcxeajmtqciozz.supabase.co/storage/v1/object/public/payment/${booking.id}/${booking.image.name}`
    : null;

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Room {booking.room?.roomNumber ?? "N/A"}</span>
              <Badge
                variant="outline"
                className={`border-none ${statusInfo.bgColor} ${statusInfo.color} font-medium capitalize`}>
                <StatusIcon className="h-4 w-4 mr-1.5" />
                {bookingStatus ?? "Unknown"}
              </Badge>
            </CardTitle>
            <CardDescription>
              <span className="font-medium">{booking.name}</span> |
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
                <User className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
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
                  {booking.numberOfAdults ?? 0} Adult(s),
                  {booking.numberOfChildren ?? 0} Child(ren)
                </span>
              </div>
            </div>

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
                <StatusIcon
                  className={`h-4 w-4 mr-2 ${statusInfo.color} flex-shrink-0`}
                />
                <span className="font-medium mr-1.5">Status:</span>
                <Popover
                  open={statusOpen}
                  onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Badge
                      variant="outline"
                      className={`border-none hover:opacity-80 transition-opacity cursor-pointer ${statusInfo.bgColor} ${statusInfo.color} font-medium capitalize`}>
                      {statusLoading ? (
                        <Spinner
                          size={12}
                          color="currentColor"
                          className="mr-1"
                        />
                      ) : null}
                      {bookingStatus ?? "Unknown"}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="flex flex-col w-auto space-y-1 p-1.5">
                    {["Reserved", "Ongoing", "Complete", "Cancelled"].map(
                      (statusOption) => {
                        const optionInfo = getStatusInfo(statusOption);
                        if (
                          bookingStatus?.toLowerCase() ===
                          statusOption.toLowerCase()
                        )
                          return null;

                        if (bookingStatus === "Pending") return null;

                        return (
                          <Button
                            key={statusOption}
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start cursor-pointer text-xs h-auto py-1.5 px-2 ${optionInfo.bgColor} ${optionInfo.color} hover:${optionInfo.bgColor}/80`}
                            onClick={() => {
                              handleChangeStatus(
                                statusOption as
                                  | "Reserved"
                                  | "Ongoing"
                                  | "Complete"
                                  | "Cancelled"
                                  | "Pending"
                              );
                            }}>
                            <optionInfo.icon className="h-3.5 w-3.5 mr-2" />
                            {statusOption}
                          </Button>
                        );
                      }
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <Separator />
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
            </div>
          )}
          <Separator />

          <div className="space-y-1.5 py-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
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
              <div className="flex items-center">
                <span className="font-medium mr-1.5">Payment Status:</span>
                <span className="truncate">{booking.paymentStatus}</span>
              </div>

              {paymentProofImageUrl && (
                <Dialog
                  open={isProofDialogOpen}
                  onOpenChange={(open) => {
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
                      className="text-xs h-auto py-1 px-2 ml-4">
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
                    <DialogFooter className="p-4 border-t flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0">
                      {bookingStatus?.toLowerCase() === "pending" &&
                        !imageError &&
                        paymentProofImageUrl && (
                          <Button
                            onClick={handleConfirmPayment}
                            disabled={statusLoading}
                            className="w-full sm:w-auto">
                            {statusLoading && booking.status === "Pending" ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            Confirm Payment
                          </Button>
                        )}
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          disabled={statusLoading}>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {booking.bookingType && (
            <>
              <Separator />
              <div className="flex items-center text-sm py-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="font-medium mr-1.5">Booking Type:</span>
                <span className="truncate">{booking.bookingType}</span>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col space-y-2 pt-4 md:flex-row md:space-y-0 md:space-x-2 md:justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto">
                Edit Options
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="flex flex-col justify-center items-center w-auto space-y-2 p-2">
              <EditBookingDialog
                booking={booking}
                type="normal"
                triggerClassName="w-full z-[9999]"
                refetchBookings={refetchBookings}
                setIsDialogOpen={setIsDialogOpen}
              />
              <EditBookingDialog
                booking={booking}
                type="room"
                triggerClassName="w-full z-[9999]"
                refetchBookings={refetchBookings}
                setIsDialogOpen={setIsDialogOpen}
              />
            </PopoverContent>
          </Popover>

          <Dialog
            open={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full md:w-auto"
                disabled={deleteLoading}>
                {deleteLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this booking for
                  <strong>{booking.name}</strong> (Room
                  {booking.room?.roomNumber ?? booking.roomId ?? "N/A"})? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={deleteLoading}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteLoading}>
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
              className="w-full md:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingCard;
