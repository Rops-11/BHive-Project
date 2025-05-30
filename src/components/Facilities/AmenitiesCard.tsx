"use client";
import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";



const amenities = [
  {
    title: "Free High-Speed Wi-Fi",
    description:
      "Enjoy seamless internet access in all areas of the hotel, including your room, lobby, and café.",
  },
  {
    title: "24/7 Room Service",
    description:
      "Order food, drinks, or essentials at any hour — we're here whenever you need us.",
  },
  {
    title: "Complimentary Breakfast",
    description:
      "Start your day right with a delicious buffet breakfast, included with every stay.",
  },
  {
    title: "Daily Housekeeping",
    description:
      "Fresh towels, made beds, and a clean space — every single day.",
  },
  {
    title: "On-Site Parking",
    description:
      "Convenient and secure parking is available right at the hotel — no more searching for a spot.",
  },
  {
    title: "In-Room Smart TV",
    description:
      "Kick back with streaming apps, live TV, or Bluetooth music from your devices.",
  },
];

export default function Amenities() {
    return (
      <div className="max-w-5xl mx-auto px-16 lg:px-8 pt-12">
        <HoverEffect items={amenities} />
      </div>
    );
  }
