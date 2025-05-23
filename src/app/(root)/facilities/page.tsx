import React from "react";
import FacilityStickyScroll from "@/components/LandingPage/FacilityStickyScroll";
import FacilityBanner from "@/components/Facilities/FacilityBanner";
import Amenities from "@/components/Facilities/AmenitiesCard";
import { FacilityIntroText } from "@/components/Facilities/FacilityIntroText";
import FacilityGallery from "@/components/Facilities/FacilityGallery";
import Footer from "@/components/LandingPage/footer";

const FacilitiesPage = () => {
  return (
    <div>
      <FacilityBanner />
      <FacilityIntroText />
      <Amenities />
      <FacilityStickyScroll />
      <FacilityGallery />
      <Footer />
    </div>
  );
};

export default FacilitiesPage;
