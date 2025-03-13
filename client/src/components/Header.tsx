"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from '@heroicons/react/24/outline';

import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import logo from "@/assets/bhivelogo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-transparent absolute top-0 left-0 w-full z-10 backdrop-blur-md">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <img
              src={logo.src}
              alt="Bhive Hotel Logo"
              className="h-15 w-auto drop-shadow-lg"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-10">
          {["Home", "About", "Facilities", "Rooms", "Book", "Virtual tour"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-semibold text-white hover:text-red-700"
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* Guest Dropdown */}
        <Popover className="relative hidden lg:flex">
          <PopoverButton className="flex items-center text-sm font-semibold text-white hover:text-gray-200">
            <span className="mr-1">GUEST</span>
            <ChevronDownIcon className="h-5 w-5 text-white" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 z-10 mt-2 w-32 bg-white shadow-md rounded-md">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
          </PopoverPanel>
        </Popover>

        {/* Mobile Navigation Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg">
          <div className="flex flex-col justify-between h-full p-4">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Menu Items */}
            <div className="mt-4 space-y-8">
              {["Home", "About", "Facilities", "Rooms", "Book", "Virtual tour", "Profile"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className={`block text-sm font-semibold ${
                      item === "Home" ? "text-red-700" : "text-black hover:text-red-700"
                    }`}
                  >
                    {item}
                  </a>
                )
              )}
            </div>

            {/* Logout Icon */}
            <div className="mt-auto">
              <button
                className="flex items-center text-sm font-semibold text-gray-600 hover:text-red-700"
                onClick={() => alert("Logging out...")}
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
