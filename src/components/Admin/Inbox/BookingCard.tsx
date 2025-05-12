import React, { useState } from "react"; // Import useState
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
  DialogFooter, // Optional: for close button etc.
  DialogClose, // For easy closing
} from "@/components/ui/dialog"; // Import Dialog components
import { Button } from "@/components/ui/button"; // For close button
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
} from "lucide-react";

// ... keep your helper functions (formatDate, formatCurrency, getStatusInfo) ...
// Helper function to format dates (adjust format as needed)
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

// Helper function to format currency (Updated for PHP)
const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null) return "N/A";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

// Map status to icon and color (Tailwind classes)
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

const BookingCard = ({ booking }: { booking: Booking }) => {
  const statusInfo = getStatusInfo(booking.status);
  const StatusIcon = statusInfo.icon;
  // State to control the Dialog's open/closed status
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>
                Room {booking.room?.roomNumber ?? booking.roomId ?? "N/A"}
              </span>
              <Badge
                variant="outline"
                className={`border-none ${statusInfo.bgColor} ${statusInfo.color}`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {booking.status ?? "Unknown"}
              </Badge>
            </CardTitle>
            <CardDescription>
              <span className="font-medium">{booking.name}</span> |
              {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] max-h-[95vh] overflow-y-auto">
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
              <Badge
                variant="outline"
                className={`border-none ${statusInfo.bgColor} ${statusInfo.color}`}>
                {booking.status ?? "Unknown"}
              </Badge>
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
          {booking.shift && booking.shift !== "Online" && (
            <>
              <Separator />
              <div className="flex items-center text-sm mt-2">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium mr-1">Booking Type:</span>
                {booking.shift}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
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
