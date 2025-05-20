"use client";

import { useState } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

import view from "@/assets/Outdoorview.jpg";
import sign from "@/assets/bhiveNightSign.jpg";
import location from "@/assets/Location.png";

const images = [view, sign, location];

export default function LocationDescription() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-16">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Text Section */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Bhive Hotel</h2>
          <p className="text-gray-700 text-justify text-lg leading-relaxed">
            Whenever the word Beehive is mentioned, one word would usually associate it with the all-time favorite honey being produced—
            100% sweet and enjoyable. Such a definition is not far from Bhive Hotel, a unique and industrial concept pitched by one of its
            owners, Engr. Benito B. Sucgang Jr. Both Engr. Benito and Richel G. Sucgang of Bhive Hotel look to it that Bhive is centered on
            the heartwarming Ilonggo hospitality.
          </p>
        </div>

        {/* Carousel Section */}
        <div className="w-full md:w-1/2 relative" {...swipeHandlers}>
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[520px] overflow-hidden">
            <Image
              src={images[currentIndex]}
              alt={`Hotel View ${currentIndex + 1}`}
              fill
              placeholder="blur"
              className="object-cover rounded-xl transition duration-500"
            />
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white text-xl p-2 rounded-full hover:bg-black/80 z-10"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white text-xl p-2 rounded-full hover:bg-black/80 z-10"
          >
            ›
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-yellow-500" : "bg-white"
                } border border-gray-400`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
