"use client";
import { useState } from "react";
import Image from "next/image";

import view from "@/assets/Outdoorview.jpg";
import sign from "@/assets/bhiveNightSign.jpg";
import location from "@/assets/Location.png";

const images = [view, sign, location];

export default function LocationDescription() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <section className="w-full bg-gray-200 py-12 px-4 sm:px-6 lg:px-16">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-4xl font-bold mb-6">Bhive Hotel</h2>
          <p className="text-gray-700 text-justify text-lg leading-relaxed">
            Whenever the word Beehive is mentioned, one word would usually
            associate it with the all-time favorite honey being produced. 100%
            sweet and enjoyable. Such definition is not far from Bhive Hotel, a
            unique and industrial concept pitched by one of its owners, Engr.
            Benito B. Sucgang Jr. Both Engr. Benito and Richel G. Sucgang of
            Bhive Hotel look to it that Bhive is centered on the heartwarming
            Ilonggo hospitality.
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[520px]">
            <Image
              src={images[currentIndex]}
              alt={`Hotel View ${currentIndex + 1}`}
              fill
              className="rounded-xl object-cover transition duration-500"
              placeholder="blur"
            />
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white text-2xl px-3 py-1 rounded-full hover:bg-black/70"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white text-2xl px-3 py-1 rounded-full hover:bg-black/70"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
