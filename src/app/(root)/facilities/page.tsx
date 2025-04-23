import React from 'react'
import FacilityStickyScroll from '@/components/FacilityStickyScroll'
import FacilityBanner from '@/components/FacilityBanner'
import Amenities from '@/components/AmenitiesCard'
import { FacilityIntroText } from '@/components/FacilityIntroText'
import FacilityGallery from '@/components/FacilityGallery'


const RoomsPage = () => {
  return (
    <div>
      <FacilityBanner />
      <FacilityIntroText />
      <Amenities />
      <FacilityStickyScroll />
      <FacilityGallery />
    </div>
  )
}

export default RoomsPage
