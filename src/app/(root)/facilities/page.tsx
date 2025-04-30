import React from 'react'
import FacilityStickyScroll from '@/components/LandingPage/FacilityStickyScroll'
import FacilityBanner from '@/components/Facilities/FacilityBanner'
import Amenities from '@/components/Facilities/AmenitiesCard'
import { FacilityIntroText } from '@/components/Facilities/FacilityIntroText'
import FacilityGallery from '@/components/Facilities/FacilityGallery'


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
