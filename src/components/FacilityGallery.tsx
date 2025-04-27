"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import Cafe from "@/assets/LPsecondpic.jpg";
import Bar from "@/assets/barpic.jpg";
import Lounge from "@/assets/LPmaincover.jpg";

type Facility = {
  name: string;
  thumbnail: StaticImageData;
  gallery: StaticImageData[];
};

const facilities: Facility[] = [
  {
    name: "Rooftop Bar",
    thumbnail: Bar,
    gallery: Array(6).fill(Bar),
  },
  {
    name: "Relaxing Lounge",
    thumbnail: Lounge,
    gallery: Array(6).fill(Lounge),
  },
  {
    name: "Cozy Café",
    thumbnail: Cafe,
    gallery: Array(6).fill(Cafe),
  },
];

export default function FacilityGallery() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );

  return (
    <>
      <div className="bg-[#171717] py-20">
        <h3 className="text-3xl font-bold text-[#ffba30] text-center mb-10">
          Gallery
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {facilities.map((facility) => (
            <div
              key={facility.name}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg"
              onClick={() => setSelectedFacility(facility)}
            >
              <Image
                src={facility.thumbnail}
                alt={facility.name}
                className="w-[400px] h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full text-white p-4 text-xl font-semibold">
                {facility.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFacility && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl p-6 overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-black hover:text-red-500"
                onClick={() => setSelectedFacility(null)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-[#D29D30]">
                {selectedFacility.name}
              </h2>
              <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                <h3 className="text-xl font-semibold text-[#D29D30] mb-2 text-center">
                  Gallery
                </h3>
                {selectedFacility.gallery.map((img, index) => (
                  <div key={index} className="mb-4">
                    <Image
                      src={img}
                      alt={`${selectedFacility.name} ${index + 1}`}
                      className="rounded-xl object-cover w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
