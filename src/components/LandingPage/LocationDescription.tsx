"use client";

import Image from "next/image";
import { MapPin, Star } from "lucide-react";

import view from "@/assets/Outdoorview.jpg";
import sign from "@/assets/bhiveNightSign.jpg";
import location from "@/assets/Location.png";

const images = [
  { src: view, alt: "Outdoor view of Bhive Hotel" },
  { src: sign, alt: "Bhive Hotel night sign" },
  { src: location, alt: "Location map of Bhive Hotel" },
];

export default function LocationDescription() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 text-left">
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-700 font-medium">
                Iloilo City, Philippines
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
              Bhive Hotel
            </h2>

            <div className="flex items-center mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Exceptional hospitality
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">
                Whenever the word Beehive is mentioned, one word would usually
                associate it with the all-time favorite honey being produced—
                100% sweet and enjoyable. Such a definition is not far from
                Bhive Hotel, a unique and industrial concept pitched by one of
                its owners, Engr. Benito B. Sucgang Jr.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Both Engr. Benito and Richel G. Sucgang of Bhive Hotel look to
                it that Bhive is centered on the heartwarming Ilonggo
                hospitality.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Upon entering the lobby of the hotel, the eye-catching wall
                interior, hexagonal-shaped glasses, and front desk designed with
                lowered writing surface for the guests’ convenience, and fusion
                of wood works will take your breath for a while. Located at Taft
                North Mandurriao, Iloilo City, it is situated strategically
                walking distance to shops, restaurants, malls, and cafes for the
                convenience of its patriots. It is approximately 20-30 minutes
                away from the Iloilo International Airport. For more than one
                year, the Bhive Hotel has caught the attention of many tourists
                and locals visiting the City of Love. With its 24 rooms with hot
                and cold shower, air conditioned room and wifi access as part of
                its amenities, Bhive ensures that its guests will have an
                exclusivity hotel stay experience.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <span className="text-yellow-700">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Central Location
                  </h3>
                  <p className="text-sm text-gray-600">
                    Easy access to attractions
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <span className="text-yellow-700">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Feels like Home</h3>
                  <p className="text-sm text-gray-600">
                    True Ilonggo hospitality
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hexagon Images Section */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
            <div className="flex flex-col gap-1 items-end justify-center">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`group relative w-[300px] h-[270px] overflow-hidden transition-colors duration-300 ${
                  i === 1 ? "mr-50" : ""
                  }`}
                  style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  WebkitClipPath:
                    "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  marginTop: i === 1 ? "-3.5rem" : "0",
                  marginBottom: i === 1 ? "-3.5rem" : "0",
                  }}
                >
                  <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
