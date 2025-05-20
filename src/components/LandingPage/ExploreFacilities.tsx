"use client";

import Image from "next/image";
import Link from "next/link";
import SingleTwin from "@/assets/SingleTwin.jpg";
import Food from "@/assets/foodlanding.jpg";
import Bar from "@/assets/barpic.jpg";

const images = [
  {
    src: SingleTwin,
    alt: "Room",
    link: "/rooms",
    label: "Room",
  },
  {
    src: Food,
    alt: "Food",
    link: "/dining",
    label: "Restaurant",
  },
  {
    src: Bar,
    alt: "Bar",
    link: "/bar",
    label: "Bar",
  },
];

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 px-4 sm:px-6 mt-8 sm:mt-12 text-sm sm:text-lg">
      {images.map((image, index) => (
        <Link href={image.link} key={index}>
          <div className="relative max-w-xs w-full rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={400}
              className="object-cover w-full h-auto aspect-[3/4] rounded-xl"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-10 h-1/3 bg-gradient-to-t from-black/70 to-transparent">
              <span className="text-white text-base sm:text-xl md:text-2xl font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-4 sm:mb-6">
                {image.label}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
