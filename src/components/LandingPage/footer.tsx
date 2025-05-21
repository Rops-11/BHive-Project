"use client";

import { FaFacebook } from "react-icons/fa";
import React from "react";
import Image from "next/image";
import logo from "@/assets/bhivelogo.jpg";
import bplaceLogo from "@/assets/bplaceLogo.jpg";
import benitosLogo from "@/assets/benitossign.png";

export default function Footer() {
  return (
    <footer className="bg-yellow-200 text-gray-700 py-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Bhive</h2>
          <p className="mt-1 text-base">
            The first industrial concept hotel <br />
            in Iloilo with charming ambiance.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold">CONTACT INFO</h3>
          <p className="mt-1 text-sm">Phone: 0966 198 3606</p>
          <p className="text-sm">Email: bhive.hotel2018@gmail.com</p>
          <p className="text-sm">
            Location: PH92+H86, Mandurriao, Iloilo City, Iloilo
          </p>
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-base font-semibold">SOCIAL MEDIA</h3>
          <div className="flex items-center mt-1">
            <FaFacebook className="text-lg" />
            <span className="ml-2 text-sm">Bhive Hotel</span>
          </div>

          {/* Aligned logos */}
          <div className="mt-3 flex items-center space-x-4">
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
                className="object-contain h-20"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-4 pt-2 text-center text-xs">
        © 2025 Bhive Dev team | all rights reserved
      </div>
    </footer>
  );
}
