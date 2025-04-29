"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/outline";
import logo from "@/assets/bhivelogo.jpg";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import SideBar from "./SideBar";

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
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
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
  const [sideBar, setSideBar] = useState(false);

  const isMobile = useIsMobile();

  const about: { title: string; description: string; href: string }[] = [
    {
      title: "About Bhive",
      description: "Know more about the hotel.",
      href: "/about/hotelDetails",
    },
    {
      title: "Terms and Conditions",
      description: "Know about what you need to know before booking.",
      href: "/about/termsAndConditions",
    },
  ];

  const navStyle = isMobile
    ? `mx-auto flex max-w-7xl w-full items-center justify-between`
    : `mx-auto flex max-w-7xl w-full items-center`;

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-gradient-to-t from-[#d4a017]/30 to-[#d4a017] shadow-md flex items-center p-10 backdrop-filter backdrop-blur-md transition">
      <nav className={navStyle}>
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center">
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

        <div className="hidden md:flex flex-1 w-full text-black font-semibold justify-center items-center">
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

        <div className="hidden md:flex space-x-3">
          <Link
            href="/login"
            className="bg-orange-400/30 hover:bg-orange-400/75 backdrop-blur-sm backdrop-filter text-black px-4 py-2 rounded-lg font-semibold">
            Log-in
          </Link>
          <Link
            href="/signup"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
            Sign-up
          </Link>
        </div>

        <div className="flex md:hidden right-0">
          {!mobileMenuOpen && (
            <button
              type="button"
              onClick={() => {
                setSideBar(!sideBar);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-black">
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>
        {mobileMenuOpen && (
          <SideBar
            sideBar={sideBar}
            setSideBar={setSideBar}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            about={about}
          />
        )}
      </nav>
    </header>
  );
}
