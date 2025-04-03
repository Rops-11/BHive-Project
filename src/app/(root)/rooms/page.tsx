import React from 'react'
import CheckRoomAvailability from '@/components/CheckRoomAvailability'
import RoomBanner from '@/components/RoomBanner'
import HotelCards from '@/components/HotelRoomCard'

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