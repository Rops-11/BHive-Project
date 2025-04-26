"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Cafe from "@/assets/LPsecondpic.jpg";
import Bar from "@/assets/barpic.jpg";
import Lounge from "@/assets/LPmaincover.jpg";
import Image from "next/image"; // ✅ import Next.js Image

const content = [
  {
    title: "Café with Free Wi-Fi",
    description:
      "Enjoy your favorite brew while getting work done or catching up with friends. Our cozy café provides high-speed Wi-Fi and a relaxing vibe. Open daily from 7:00 AM to 10:00 PM, it’s the perfect place to start your morning or wind down in the evening. A full menu of beverages and light snacks is available, with friendly staff ready to serve you throughout the day.",
    content: (
      <div className="relative w-full h-full">
        <Image
          src={Cafe}
          alt="Cafe"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    ),
  },
  {
    title: "Indoor Lounge Area",
    description:
      "A peaceful space with comfortable chairs, ambient lighting, and large windows for natural light. The lounge is open 24/7 and offers a quiet escape to read, work, or simply relax. Complimentary refreshments are available during the day, and our concierge is just steps away to assist you with any needs.",
    content: (
      <div className="relative w-full h-full">
        <Image
          src={Lounge}
          alt="Indoor Lounge"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    ),
  },
  {
    title: "Rooftop Bar",
    description:
      "Unwind in style with a drink in hand at our scenic rooftop bar. Overlooking the city skyline, it’s the perfect evening hangout. Open from 5:00 PM to midnight, the bar offers signature cocktails, live music on weekends, and a vibrant atmosphere. Ideal for social gatherings, date nights, or just enjoying the sunset with your favorite drink.",
    content: (
      <div className="relative w-full h-full">
        <Image
          src={Bar}
          alt="Rooftop Bar"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    ),
  },
];

export default function FacilityStickyScroll() {
  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
