"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";

import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { HiOutlineLogin } from "react-icons/hi";
import logo from "@/assets/bhivelogo.png";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full h-16 z-10 bg-[rgba(235,104,52,0.4)]">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center">
            <img
              src={logo.src}
              alt="Bhive Hotel Logo"
              className="h-13 w-auto drop-shadow-lg"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-10">
          {["Home", "About", "Facilities", "Rooms", "Book", "Virtual tour"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="text-l font-semibold text-white hover:text-red-400">
                {item}
              </Link>
            )
          )}
        </div>

        {/* Guest Dropdown */}
        <Popover className="relative hidden lg:flex">
          <PopoverButton className="flex items-center text-l font-semibold text-white hover:text-red-400">
            <span className="mr-1">GUEST</span>
            <ChevronDownIcon className="h-4 w-4 text-white" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 z-10 mt-2 w-28 bg-white shadow-md rounded-md">
            <Link
              href="#"
              className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
          </PopoverPanel>
        </Popover>

        {/* Mobile Navigation Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-white">
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}>
        <DialogPanel className="fixed inset-y-0 right-0 z-50 bg-white shadow-lg">
          <div className="flex flex-col justify-between w-full h-full p-4">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Menu Items */}
            <div className="mt-4 space-y-8">
              {[
                "Home",
                "About",
                "Facilities",
                "Rooms",
                "Book",
                "Virtual tour",
                "Profile",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className={`block text-xs font-semibold ${
                    item === "Home"
                      ? "text-red-500"
                      : "text-black hover:text-red-500"
                  }`}>
                  {item}
                </Link>
              ))}
            </div>

            {/* Logout Icon */}
            <div className="mt-auto">
              <button
                className="flex items-center text-xs font-semibold text-gray-600 hover:text-red-700"
                onClick={() => alert("Logging out...")}>
                <HiOutlineLogin className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
