"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SingleTwin from "@/assets/SingleTwin.jpg";
import Food from "@/assets/foodlanding.jpg";
import Bar from "@/assets/barpic.jpg";

const facilities = [
  {
    src: SingleTwin,
    alt: "Room",
    link: "/rooms",
    label: "Rooms",
    description: "An Industrial Concept Hotel with a charming ambiance.",
  },
  {
    src: Food,
    alt: "Food",
    link: "/facilities",
    label: "Benitos Cafe & Restaurant",
    description: "Boracay's Coffee and crepes in Iloilo by Bhive Hotel",
  },
  {
    src: Bar,
    alt: "Bar",
    link: "/facilities",
    label: "Bplace sunset bar",
    description: "A rooftop bar with a scenic view close to Festive walk.",
  },
];

export default function Gallery() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-50">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-yellow-700">
          Our Facilities
        </h2>
        <div className="mt-4 max-w-2xl mx-auto">
          <p className="text-lg text-gray-600">
            Indulge in exceptional experiences throughout our carefully curated
            spaces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={facility.src || "/placeholder.svg"}
                  alt={facility.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
              </div>

              <div className="relative p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                  {facility.label}
                </h3>
                <p className="text-gray-600 mb-4">{facility.description}</p>
                <Link
                  href={facility.link}
                  className="mt-auto inline-flex items-center text-yellow-700 font-medium group-hover:text-yellow-800 transition-colors"
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
