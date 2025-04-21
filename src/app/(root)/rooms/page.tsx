import React from 'react'
import CheckRoomAvailability from '@/components/Booking/CheckRoomAvailability'
import RoomBanner from '@/components/RoomTour/RoomBanner'
import HotelCards from '@/components/RoomTour/HotelRoomCard'

const RoomsPage = () => {
  return (
    <div>
      <RoomBanner />
      <CheckRoomAvailability />
      <HotelCards />
    </div>
  )
}

export default RoomsPage