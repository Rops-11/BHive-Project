"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import BookRoom from "@/components/LandingPage/BookRoom";

import LPmaincover from "@/assets/LPmaincover.jpg";
import LPsecondpic from "@/assets/LPsecondpic.jpg";
import LPthirdpic from "@/assets/LPthirdpic.jpg";
import HotelImg1 from "@/assets/Benitos.jpg";
import HotelImg2 from "@/assets/BhiveOpen.jpg";
import HotelImg3 from "@/assets/twinroom.jpg";

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
      {/* Carousel Background */}
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
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      {/* Tagline Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-start px-4 sm:px-6 md:px-10 z-20"
      >
        <div className="text-left-40 text-white">
          <h1 className="text-5xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg leading-snug sm:leading-tight">
            The first industrial
            <br /> concept hotel in Iloilo
            <br /> with charming ambiance.
          </h1>
        </div>
      </motion.div>
      {/* BookRoom Form with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 w-full px-4"
      >
        <BookRoom />
      </motion.div>
      {/* Octagonal Images */}
      <div className="absolute right-30 top-23 z-30 hidden lg:flex flex-col gap-1 items-end justify-center">
        {[HotelImg1, HotelImg2, HotelImg3].map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.2, duration: 0.7 }}
            className={`relative w-53 h-53 ${i === 1 ? "mr-40" : ""}`}
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
              WebkitClipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
              marginTop: i === 1 ? "-3.5rem" : "0",
              marginBottom: i === 1 ? "-3.5rem" : "0",
            }}
          >
            <Image
              src={img}
              alt={`Octagon ${i + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-25 sm:h-40 bg-gradient-to-t from-yellow-500 to-transparent z-10"></div>
    </div>
  );
}
