"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
import logo from "@/assets/bhivelogo.jpg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuRoot } from "./ui/dropdown";
import FacilitiesDropdown from "./FacilitiesDropdown"; // 👈 custom component

const ListItem = ({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const about: { title: string; description: string; href: string }[] = [
    {
      title: "About Bhive",
      description: "With the amount reviews on Facebook, There's no better place to stay in Iloilo than Bhive Hotel that offers you an outstanding service and a comforting stay like home.",
      href: "/about/hotelDetails",
    },
    {
      title: "Terms and Conditions",
      description: "Know about what you need to know before booking.",
      href: "/about/termsAndConditions",
    },
  ];

  const hotelData = {
    facilities: [
      { id: "1", name: "Swimming Pool" },
      { id: "2", name: "Gym" },
      { id: "3", name: "Spa" },
    ],
    facts: ["Located in the city center", "5-star rating", "Free Wi-Fi"],
  };

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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 w-full text-black font-semibold justify-center items-center">
          <NavigationMenu className="flex w-full justify-between">
            <NavigationMenuList className="flex w-full justify-center items-center space-x-5">
              <NavigationMenuItem className="flex w-full justify-center items-center">
                <NavigationMenuLink
                  className="flex w-full justify-center items-center"
                  asChild>
                  <Link
                    className="flex w-full justify-center items-center"
                    href="/">
                    <p>Home</p>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex w-full justify-center items-center">
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {about.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex w-full justify-center items-center">
                <NavigationMenuLink asChild>
                  <Link href="/facilities">
                    <p>Facilities</p>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex w-full justify-center items-center">
                <NavigationMenuLink asChild>
                  <Link href="/rooms">
                    <p>Rooms</p>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="flex w-full justify-center items-center">
                <NavigationMenuLink asChild>
                  <Link href="/book">
                    <p>Book</p>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Sign-up / Log-in */}
        <div className="hidden lg:flex space-x-3">
          <Link
            href="/signup"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Sign-up
          </Link>
          <Link
            href="/login"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            Log-in
          </Link>
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

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-md z-20">
          <div className="flex flex-col space-y-4 p-6 text-black font-semibold">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>

            <div>
              <span className="font-semibold">About</span>
              <ul className="ml-4 mt-1 space-y-1">
                {about.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-semibold">Facilities</span>
              <ul className="ml-4 mt-1 space-y-1">
                {hotelData.facilities.map((facility) => (
                  <li key={facility.id}>
                    <span>{facility.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/rooms" onClick={() => setMobileMenuOpen(false)}>
              Rooms
            </Link>
            <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
              Book
            </Link>
            <Link href="/virtual-tour" onClick={() => setMobileMenuOpen(false)}>
              Virtual Tour
            </Link>

            <div className="flex flex-col space-y-2 mt-4">
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-yellow-500 px-4 py-2 rounded-lg text-center"
              >
                Sign-up
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-yellow-500 px-4 py-2 rounded-lg text-center"
              >
                Log-in
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
