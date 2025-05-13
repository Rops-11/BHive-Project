"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

//  for rooms
const rooms = [
  {
    id: "R001",
    name: "Single Deluxe 21",
    capacity: 2,
    price: "1,890.00PHP",
    status: "Available",
    amenities: ["Single bed", "Free wifi", "Bplace", "Free breakfast"],
  },
  {
    id: "R002",
    name: "Twin bee 2C",
    capacity: 2,
    price: "1,890.00PHP",
    status: "Occupied", 
    amenities: ["two single bed", "Free wifi", "Bplace", "Free breakfast"],
  },
  {
    id: "R003",
    name: "Queen Bee 3C",
    capacity: 3,
    price: "2,450.00PHP",
    status: "Available",
    amenities: ["Queen bed", "Free wifi", "Bplace", "Free breakfast"],
  },
]

export default function RoomManagement() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Room Management</h2>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>Capacity: {room.capacity} guests</CardDescription>
                </div>
                <Badge
                  variant={
                    room.status === "Available" ? "default" : room.status === "Occupied" ? "secondary" : "destructive"
                  }
                >
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{room.price}</p>
                <div>
                  <p className="text-sm font-medium mb-1">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
