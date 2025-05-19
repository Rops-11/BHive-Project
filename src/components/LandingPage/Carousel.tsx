'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import BookRoom from '@/components/LandingPage/BookRoom'; 
import LPmaincover from '@/assets/LPmaincover.jpg';
import LPsecondpic from '@/assets/LPsecondpic.jpg';
import LPthirdpic from '@/assets/LPthirdpic.jpg';

const images = [LPmaincover, LPsecondpic, LPthirdpic];

export default function Carousel() {
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
    <div className="relative w-full h-screen overflow-hidden">
      {/* Images */}
      <div
        className="flex transition-transform ease-in-out duration-500 h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
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

      {/* Tagline */}
      <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-6 md:px-10 z-20">
        <div className="text-left text-white">
          <h1 className="text-6xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg leading-snug sm:leading-tight">
            The first industrial
            <br /> concept hotel in Iloilo
            <br />with charming ambiance.
          </h1>
        </div>
      </div>

      {/* BookRoom Overlay */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full px-4">
        <BookRoom />
      </div>

      {/* Bottom Linear Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-yellow-500 to-transparent z-10"></div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
              currentIndex === index ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
