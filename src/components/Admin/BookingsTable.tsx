"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, MoreVertical } from "lucide-react";

//type for booking
type Booking = {
    id: string;
    guestName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    status: "Online" | "OTC";
    totalAmount: string;
};

// Sample data for bookings
const bookings: Booking[] = [
    {
        id: "B001",
        guestName: "REEEEG",
        roomName: "FAMILY BEE-3B",
        checkIn: "2025-05-14",
        checkOut: "2025-05-16",
        status: "Online",
        totalAmount: "2,500.00",
    },
    {
        id: "B002",
        guestName: "ROPSSS",
        roomName: " SINGLE BEE-1A",
        checkIn: "2025-05-15",
        checkOut: "2025-05-17",
        status: "OTC",
        totalAmount: "2,450.00",
    },
    {
        id: "B003",
        guestName: "NICHHH",
        roomName: "TWIN BEE-2C",
        checkIn: "2025-05-16",
        checkOut: "2025-05-20",
        status: "Online",
        totalAmount: "1200.00",
    },
];

// Map status to badge variants
const statusBadgeVariants: Record<Booking["status"], "default" | "secondary"> =
    {
        Online: "default",
        OTC: "secondary",
    };

export default function BookingsTable() {
    return (
        <div className="w-full px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">All Bookings</h2>
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" aria-label="Filter bookings">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>All Bookings</DropdownMenuItem>
                            <DropdownMenuItem>Online Bookings</DropdownMenuItem>
                            <DropdownMenuItem>OTC Bookings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Select defaultValue="newest">
                        <SelectTrigger className="w-full md:w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    {bookings.length > 0 ? (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.id}</TableCell>
                                        <TableCell>{booking.guestName}</TableCell>
                                        <TableCell>{booking.roomName}</TableCell>
                                        <TableCell>{booking.checkIn}</TableCell>
                                        <TableCell>{booking.checkOut}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusBadgeVariants[booking.status]}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{booking.totalAmount}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Open menu"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            alert(`Viewing details for ${booking.id}`)
                                                        }
                                                    >
                                                        View details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            alert(`Editing booking ${booking.id}`)
                                                        }
                                                    >
                                                        Edit booking
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            alert(`Cancelling booking ${booking.id}`)
                                                        }
                                                    >
                                                        Cancel booking
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No bookings available.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
