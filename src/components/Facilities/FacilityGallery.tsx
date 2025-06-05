"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";

// Images
import Cafe from "@/assets/LPsecondpic.jpg";
import Bar from "@/assets/barpic.jpg";
import Lounge from "@/assets/LPmaincover.jpg";

// Placeholder gallery images
const placeholderGalleryImage1 = Cafe;
const placeholderGalleryImage2 = Bar;
const placeholderGalleryImage3 = Lounge;
const placeholderGalleryImage4 = Bar;
const placeholderGalleryImage5 = Cafe;
const placeholderGalleryImage6 = Lounge;

type Facility = {
  id: string;
  name: string;
  description?: string;
  thumbnail: StaticImageData;
  gallery: StaticImageData[];
};

const facilities: Facility[] = [
  {
    id: "rooftop-bar",
    name: "Rooftop Bar",
    description: "Enjoy breathtaking city views with our signature cocktails.",
    thumbnail: Bar,
    gallery: [Bar, placeholderGalleryImage2, placeholderGalleryImage4, Bar, placeholderGalleryImage2, placeholderGalleryImage4],
  },
  {
    id: "relaxing-lounge",
    name: "Relaxing Lounge",
    description: "Unwind in our plush lounge, perfect for quiet conversations.",
    thumbnail: Lounge,
    gallery: [Lounge, placeholderGalleryImage3, placeholderGalleryImage6, Lounge, placeholderGalleryImage3, placeholderGalleryImage6],
  },
  {
    id: "cozy-cafe",
    name: "Cozy Café",
    description: "Start your day right with freshly brewed coffee and pastries.",
    thumbnail: Cafe,
    gallery: [Cafe, placeholderGalleryImage1, placeholderGalleryImage5, Cafe, placeholderGalleryImage1, placeholderGalleryImage5],
  },
];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Props for dynamic styling
type FacilityGalleryProps = {
  titleColor?: string;
  titleSize?: string;
};

export default function FacilityGallery({
  titleColor = "text-[#ffba30]",
  titleSize = "text-3xl sm:text-4xl",
}: FacilityGalleryProps) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <>
      <div className="bg-[#171717] py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className={`${titleSize} font-bold ${titleColor} text-center mb-12 sm:mb-16`}>
            Our Facilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {facilities.map((facility) => (
              <motion.div
                key={facility.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer shadow-2xl"
                onClick={() => setSelectedFacility(facility)}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={facility.thumbnail}
                  alt={facility.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  priority={facilities.indexOf(facility) < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-md">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Gallery
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFacility && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setSelectedFacility(null)}
          >
            <motion.div
              className="relative bg-[#2a2a2a] text-white max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
              layout
            >
              <div className="sticky top-0 bg-[#2a2a2a]/80 backdrop-blur-sm p-5 sm:p-6 border-b border-gray-700 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#ffba30]">
                      {selectedFacility.name}
                    </h2>
                    {selectedFacility.description && (
                      <p className="text-sm text-gray-300 mt-1">{selectedFacility.description}</p>
                    )}
                  </div>
                  <button
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedFacility(null)}
                    aria-label="Close gallery"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-5 sm:p-6 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFacility.gallery.map((img, index) => (
                    <motion.div
                      key={`${selectedFacility.id}-img-${index}`}
                      className="aspect-square relative overflow-hidden rounded-lg shadow-md"
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <Image
                        src={img}
                        alt={`${selectedFacility.name} - Image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={img.blurDataURL}
                      />
                    </motion.div>
                  ))}
                </div>
                {selectedFacility.gallery.length === 0 && (
                  <p className="text-center text-gray-400 py-10">
                    No images in this gallery yet.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
