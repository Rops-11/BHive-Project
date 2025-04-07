"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import view from "@/assets/Outdoorview.jpg";
import sign from "@/assets/bhiveNightSign.jpg";

const images = [sign, view];

export default function HotelLocation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center bg-gray-400 px-4 py-6 md:py-12">
      <div className="md:w-1/2 text-left">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">
          BHIVE HOTEL
        </h1>

        <p className="text-gray-600 text-base leading-relaxed">
          Whenever the word Beehive is mentioned, one word would usually associate it with the all-time favorite honey is being produced. 100% sweet and enjoyable. Such definition is not far from Bhive hotel, a unique and industrial concept pitched by one of its owners, Engr. Benito B. Sucgang Jr. Both Engr. Benito and Richel G. Sucgang, of Bhive hotel, look to it that Bhive is centered on the heartwarming Ilonggo hospitality.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="md:w-1/2 mt-6 md:mt-0 md:pl-4 overflow-hidden relative h-[400px]">
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="w-full h-[400px] flex-shrink-0 relative"
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>

        {/* Dots for Navigation */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${
                currentIndex === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
