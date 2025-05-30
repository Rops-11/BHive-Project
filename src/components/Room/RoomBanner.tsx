// app/components/RoomBanner.tsx
import Banner from "../ui/banner";
import LPthirdpic from "@/assets/RoomsBanner.png";

const RoomBanner = () => {
  return (
    <Banner
      imageSrc={LPthirdpic}
      title="Rooms at Bhive Hotel"
      subtitle="Your Perfect Stay, Just a Click Away."
    />
  );
};

export default RoomBanner;
