<<<<<<< HEAD:client/src/app/page.tsx
import Carousel from "@/components/Carousel";
=======
import Carousel from "../../components/Carousel";
>>>>>>> b97d18e251781cd07aa76e61f76b63832a785475:client/src/app/(root)/page.tsx
import BookRoom from "@/components/BookRoom";
import LocationDescription from "@/components/LocationDescription";
import ExploreFacilities from "@/components/ExploreFacilities";
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
  
    </main>
  );
}
