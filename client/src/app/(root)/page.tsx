import Carousel from "../../components/Carousel";

import BookRoom from "@/components/BookRoom";
import LocationDescription from "@/components/LocationDescription";
import ExploreFacilities from "@/components/ExploreFacilities";
import Footer from "@/components/footer";
export default function Home() {
  return (
    <main>
      <Carousel />
      <div className="container mx-auto px-4 py-8">
      <BookRoom />
      </div>
      <LocationDescription />
      <div className="container mx-auto px-4 py-8">
      <ExploreFacilities />
      </div>
      < Footer/>
  
    </main>
  );
}
