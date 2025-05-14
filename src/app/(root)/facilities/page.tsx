import React from "react";
import FacilityStickyScroll from "@/components/LandingPage/FacilityStickyScroll";
import FacilityBanner from "@/components/Facilities/FacilityBanner";
import Amenities from "@/components/Facilities/AmenitiesCard";
import { FacilityIntroText } from "@/components/Facilities/FacilityIntroText";
import FacilityGallery from "@/components/Facilities/FacilityGallery";
import Footer from "@/components/LandingPage/footer";

const RoomsPage = () => {
  return (
    <div>
      <FacilityBanner />
      <FacilityIntroText />
      <Amenities />
      <FacilityStickyScroll />
      <FacilityGallery />
      <div className="bg-gray-200 py-4 md:py-4 items-center mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default RoomsPage;
