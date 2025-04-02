"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";
import logo from "@/assets/bhivelogo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hotelData, setHotelData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hotel")
      .then((res) => res.json())
      .then((data) => setHotelData(data));
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full h-16 z-10 bg-yellow-400/40 shadow-md flex items-center">


      <nav className="mx-auto flex max-w-7xl w-full justify-between items-center px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="Bhive Hotel Logo"
              width={48}
              height={48}
              className="drop-shadow-lg"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden lg:flex flex-1 justify-center space-x-6 items-center text-black font-semibold">
          <Link href="/" className="hover:underline">Home</Link>
          
          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <span className="flex items-center hover:underline cursor-pointer">
                About <ChevronDownIcon className="h-4 w-4 ml-1" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {hotelData?.facts.map((fact: string, index: number) => (
                <DropdownMenuItem key={index}>
                  <div className="text-black hover:bg-gray-200 p-2 block">{fact}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuRoot>

          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <span className="flex items-center hover:underline cursor-pointer">
                Facilities <ChevronDownIcon className="h-4 w-4 ml-1" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {hotelData?.facilities.map((facility: any) => (
                <DropdownMenuItem key={facility.id}>
                  <div className="text-black hover:bg-gray-200 p-2 block">{facility.name}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuRoot>

          <Link href="/rooms" className="hover:underline">Rooms</Link>
          <Link href="/book" className="hover:underline">Book</Link>
          <Link href="/virtual-tour" className="hover:underline">Virtual Tour</Link>
        </div>

        {/* Sign-up & Log-in buttons */}
        <div className="hidden lg:flex space-x-3">
          <Link href="/signup" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">Sign-up</Link>
          <Link href="/login" className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">Log-in</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-black transition-transform duration-300"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
