"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import logo from "@/assets/bhivelogo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#D4A373]">
      {" "}
      {/* Gold background */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <img
              src={logo.src}
              alt="Bhive Hotel Logo"
              className="h-15 w-auto"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-10">
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-red-700"
          >
            Home
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-red-700"
          >
            About
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-red-700"
          >
            Facilities
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-red-700"
          >
            Rooms
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-red-700"
          >
            Book
          </a>
          <a
            href="#"
            className="text-sm font-semibold text-black hover:text-red-700"
          >
            Virtual tour
          </a>
        </div>

        {/* Guest Dropdown */}
        <Popover className="relative hidden lg:flex">
          <PopoverButton className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800">
            <span className="mr-1">GUEST</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </PopoverButton>
          <PopoverPanel className="absolute right-0 z-10 mt-2 w-32 bg-white shadow-md rounded-md">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </a>
          </PopoverPanel>
        </Popover>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-700"
          >
            ☰
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg">
          <div className="p-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-700"
            >
              ✕
            </button>
            <div className="mt-4 space-y-4">
              <a href="#" className="block text-sm font-semibold text-red-700">
                Home
              </a>
              <a
                href="#"
                className="block text-sm font-semibold text-black hover:text-red-700"
              >
                About
              </a>
              <a
                href="#"
                className="block text-sm font-semibold text-black hover:text-red-700"
              >
                Facilities
              </a>
              <a
                href="#"
                className="block text-sm font-semibold text-black hover:text-red-700"
              >
                Rooms
              </a>
              <a
                href="#"
                className="block text-sm font-semibold text-black hover:text-red-700"
              >
                Book
              </a>
              <a
                href="#"
                className="block text-sm font-semibold text-black hover:text-red-700"
              >
                Virtual tour
              </a>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
