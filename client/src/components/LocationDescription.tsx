'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import location from '@/assets/Location.png';
import sign from '@/assets/Outdoorsigns.jpg';
import view from '@/assets/Outdoorview.jpg';

const images = [location, sign, view];

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
    <section className="flex flex-col md:flex-row items-center bg-gray-400 px-8 py-10 md:py-20">
      <div className="md:w-1/2 text-left">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          DESCRIPTION TITLE
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus
          dolor enim, vitae pulvinar metus mattis ac. Morbi quis erat sit amet
          est commodo rhoncus. Sed eget est quis magna condimentum rutrum. Nam
          et ultrices est. Etiam eu ex arcu. Quisque vitae massa sapien. Nullam
          vel lorem nec tellus vehicula pellentesque vitae nec eros. Proin et
          nisi non elit tincidunt ultrices. Duis pellentesque ipsum ut tristique
          rutrum. Nam vestibulum sapien quis purus varius consectetur.
          Suspendisse at felis vitae augue scelerisque iaculis.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8 overflow-hidden relative h-screen">
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full h-screen flex-shrink-0 relative">
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
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 w-1 rounded-full ${
                currentIndex === index ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
