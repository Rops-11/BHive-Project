// app/components/FacilityBanner.tsx
import Banner from "../ui/banner";
import LPthirdpic from "@/assets/FacilitiesBanner.png";

const FacilityBanner = () => {
  return (
    <Banner
      imageSrc={LPthirdpic}
      title="Facilities at Bhive Hotel"
      subtitle="All the things you need are here."
    />
  );
};

export default FacilityBanner;
