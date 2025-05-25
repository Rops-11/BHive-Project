import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCard, MoreVertical, Phone, User, Users } from "lucide-react"

interface BookingProps {
  id: string
  customerName: string
  guests: number
  paymentStatus: string
}

export function BookingCard({ booking }: { booking: BookingProps }) {
  const initials = booking.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const getPaymentStatusStyles = (status: string) => {
    return status === "Paid"
      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
      : "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${initials}`}
              alt={booking.customerName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate mb-2">{booking.customerName}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <Users className="h-3.5 w-3.5 mr-1" />
              {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
            </div>
          </div>

          <div className="ml-2 flex items-center gap-2">
            <div className={`text-xs font-medium px-4 py-2 rounded-full ${getPaymentStatusStyles(booking.paymentStatus)}`}>
              {booking.paymentStatus}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Contact Guest</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Process Payment</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
