"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";
import logo from "@/assets/bhivelogo.jpg";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import SideBar from "./SideBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const isMobile = useIsMobile();

  const navItemsForSideBar: { title: string; href: string }[] = [
    { title: "Home", href: "/" },
    { title: "Facilities", href: "/facilities" },
    { title: "Rooms", href: "/rooms" },
    { title: "Book", href: "/book" },
  ];

  const navStyle = isMobile
    ? `mx-auto flex max-w-7xl w-full items-center justify-between`
    : `mx-auto flex max-w-7xl w-full items-center`;

  const navLinkStyle =
    "text-yellow-900 transition-colors text-xl hover:text-yellow-500 hover:underline hover:bg-transparent focus:bg-transparent active:bg-transparent";

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-gradient-to-t from-[#d4a017]/30 to-[#d4a017] shadow-md flex items-center p-10 backdrop-filter backdrop-blur-md transition">
      <nav className={navStyle}>
        {/* Desktop navigation */}
        <div className="hidden md:flex flex-1 w-full text-red-600 font-bold justify-center items-center">
          <NavigationMenu className="flex w-full justify-between">
            <NavigationMenuList className="flex w-full justify-center items-center space-x-10 text-xl">
              {/* Left side */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className={navLinkStyle}>
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/facilities" className={navLinkStyle}>
                    Facilities
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Center logo (desktop only) */}
              <div className="flex justify-center items-center px-4">
                <Link href="/">
                  <Image
                    src={logo}
                    alt="Bhive Hotel Logo"
                    width={60}
                    height={60}
                    className="drop-shadow-lg"
                    priority
                  />
                </Link>
              </div>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/rooms" className={navLinkStyle}>
                    Rooms
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/book" className={navLinkStyle}>
                    Book
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile logo and hamburger menu */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Mobile logo (mobile only) */}
          <Link href="/" className="block md:hidden">
            <Image
              src={logo}
              alt="Bhive Hotel Mobile Logo"
              width={50}
              height={50}
              className="drop-shadow-md"
              priority
            />
          </Link>

          {/* Hamburger menu button */}
          {!mobileMenuOpen && (
            <button
              type="button"
              onClick={() => {
                setSideBar(!sideBar);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-black"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Mobile sidebar */}
        {mobileMenuOpen && (
          <SideBar
            sideBar={sideBar}
            setSideBar={setSideBar}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            navItems={navItemsForSideBar}
          />
        )}
      </nav>
    </header>
  );
}
