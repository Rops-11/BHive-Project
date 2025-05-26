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
  CheckCircle,
  CircleHelp,
  Loader,
  Loader2,
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

  const handleDelete = async () => {
    await deleteBooking(booking.id!);
    setIsDialogOpen(false);
    await refetchBookings();
  };

  const handleChangeStatus = async (
    status: "Reserved" | "Ongoing" | "Complete"
  ) => {
    await updateStatus(booking.id!, status);
    setBookingStatus(status);
    setStatusOpen(false);
    await refetchBookings();
  };

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
                className={`border-none ${statusInfo.bgColor} ${statusInfo.color}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
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

      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Booking Details</DialogTitle>
          <DialogDescription>ID: {booking.id ?? "N/A"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
              Guest Information
            </h3>
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Name:</span>
              {booking.name ?? "N/A"}
            </div>
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Email:</span>
              {booking.email ?? "N/A"}
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Mobile:</span>
              {booking.mobileNumber ?? "N/A"}
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Guests:</span>
              {booking.numberOfAdults ?? 0} Adult(s),
              {booking.numberOfChildren ?? 0} Child(ren)
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
              Dates & Status
            </h3>
            <div className="flex items-center text-sm">
              <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Check-in:</span>
              {formatDate(booking.checkIn)}
            </div>
            <div className="flex items-center text-sm">
              <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Check-out:</span>
              {formatDate(booking.checkOut)}
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Booked On:</span>
              {formatDate(booking.dateBooked)}
            </div>
            <div className="flex items-center text-sm">
              <StatusIcon className={`h-4 w-4 mr-2 ${statusInfo.color}`} />
              <span className="font-medium mr-1">Status:</span>
              <Popover
                open={statusOpen}
                onOpenChange={setStatusOpen}>
                <PopoverTrigger>
                  <Badge
                    variant="outline"
                    className={`border-none hover:cursor-pointer hover:scale-105 ${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusLoading ? (
                      <Spinner
                        size={8}
                        color="FFFFFF"
                        animate={statusLoading}
                      />
                    ) : (
                      bookingStatus ?? "Unknown"
                    )}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent
                  withDialog
                  className="flex flex-col w-auto space-y-1 p-2">
                  {bookingStatus !== "Complete" && (
                    <button
                      onClick={() => {
                        handleChangeStatus("Complete");
                        setStatusOpen(false);
                      }}>
                      <Badge
                        variant="outline"
                        className={`border-none hover:scale-105 hover:cursor-pointer bg-green-100 "text-green-600"`}>
                        Complete
                      </Badge>
                    </button>
                  )}
                  {bookingStatus !== "Reserved" && (
                    <button
                      onClick={() => {
                        handleChangeStatus("Reserved");
                        setStatusOpen(false);
                      }}>
                      <Badge
                        variant="outline"
                        className={`border-none hover:scale-105 hover:cursor-pointer text-orange-600 bg-orange-100`}>
                        Reserved
                      </Badge>
                    </button>
                  )}
                  {bookingStatus !== "Ongoing" && (
                    <button
                      onClick={() => {
                        handleChangeStatus("Ongoing");
                        setStatusOpen(false);
                      }}>
                      <Badge
                        variant="outline"
                        className={`border-none hover:scale-105 hover:cursor-pointer text-blue-600 bg-blue-100`}>
                        Ongoing
                      </Badge>
                    </button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Separator />
          {booking.room && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Room Information
              </h3>
              <div className="flex items-center text-sm">
                <Hash className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Number:</span>
                {booking.room.roomNumber}
              </div>
              <div className="flex items-center text-sm">
                <BedDouble className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Type:</span>
                {booking.room.roomType}
              </div>
            </div>
          )}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">
              Payment
            </h3>
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-1">Total Price:</span>
              {formatCurrency(booking.totalPrice)}
            </div>
          </div>
          {booking.bookingType && (
            <>
              <Separator />
              <div className="flex items-center text-sm mt-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Booking Type:</span>
                {booking.bookingType}
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex flex-col md:flex-reverse">
          <Popover>
            <PopoverTrigger asChild>
              <Button>Edit Options</Button>
            </PopoverTrigger>
            <PopoverContent
              className="flex flex-col justify-center items-center w-auto space-y-2"
              withDialog
              onInteractOutside={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest('[role="button"]')) {
                  const parentDialogTrigger = target.closest(
                    '[aria-haspopup="dialog"]'
                  );
                  if (parentDialogTrigger) {
                    event.preventDefault();
                  }
                }
              }}>
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
                className="w-full sm:w-auto"
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
              variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingCard;
