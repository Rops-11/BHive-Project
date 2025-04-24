import Carousel from "../../components/LandingPage/Carousel";
import BookRoom from "@/components/LandingPage/BookRoom";
import LocationDescription from "@/components/LandingPage/LocationDescription";
import ExploreFacilities from "@/components/LandingPage/ExploreFacilities";
import Footer from "@/components/LandingPage/footer";
export default function Home() {
  return (
    <main className="flex flex-col">
      <Carousel />

      <div className="container mx-auto px-4 py-4 sm:px-6 md:py-12">
        <BookRoom />
      </div>

      {/* <div className="container mx-auto px-4 bg-gray-200 sm:px-4 py-4 md:py-4"> */}
      <LocationDescription />
      {/* </div> */}

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex justify-center items-center">
          <ExploreFacilities />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex justify-center items-center">
          <Footer />
        </div>

      </div>

    </main>
  );
}
