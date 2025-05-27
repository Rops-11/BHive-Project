"use client";

import { FaFacebook } from "react-icons/fa";
import React from "react";
import Image from "next/image";
import logo from "@/assets/bhivelogo.jpg";
import bplaceLogo from "@/assets/BplaceLogo.jpg";
import benitosLogo from "@/assets/benitossign.png";

export default function Footer() {
  return (
    <footer className="bg-yellow-200 text-gray-700 py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center md:items-start">
        {/* Bhive Description */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl md:text-2xl font-bold">Bhive</h2>
          <p className="mt-2 text-sm md:text-base leading-relaxed">
            The first industrial concept hotel <br />
            in Iloilo with charming ambiance.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-base font-semibold">CONTACT INFO</h3>
          <p className="mt-2 text-sm">Phone: 0966 198 3606</p>
          <p className="text-sm">Email: bhive.hotel2018@gmail.com</p>
          <p className="text-sm">
            Location: PH92+H86, Mandurriao, Iloilo City, Iloilo
          </p>
        </div>

        {/* Social Media & Logos */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-base font-semibold">SOCIAL MEDIA</h3>
          <div className="flex items-center mt-2">
            <FaFacebook className="text-lg" />
            <span className="ml-2 text-sm">Bhive Hotel</span>
          </div>

          {/* Logos */}
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="h-12 w-12 relative">
              <Image
                src={logo}
                alt="Bhive Hotel Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-12 w-12 relative">
              <Image
                src={bplaceLogo}
                alt="Bplace Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-12 w-12 relative">
              <Image
                src={benitosLogo}
                alt="Benitos Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-6 pt-4 text-center text-xs">
        © 2025 Bhive Dev team | All rights reserved
      </div>
    </footer>
  );
}
