"use client";

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
import SideBar from "../../LandingPage/SideBar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth/logout";
import { usePathname } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; // ✅ Added logout icon

const navigationLinks = [
  { title: "Dashboard", href: "/admin" },
  { title: "Inbox", href: "/admin/inbox" },
  { title: "Rooms", href: "/admin/rooms" },
  { title: "Book", href: "/admin/book" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  const actualIsMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isMobile = isClient ? actualIsMobile : false;

  const navStyle = `mx-auto flex max-w-7xl w-full items-center justify-between`;
  const navLinkStyle =
    "text-yellow-900 transition-colors text-xl font-semibold hover:text-red-600 hover:underline hover:bg-transparent";

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 bg-gradient-to-t from-[#d4a017]/30 to-[#d4a017] shadow-md flex items-center p-10 backdrop-filter backdrop-blur-md transition">
      <nav className={navStyle}>
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/admin"
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

        {/* Desktop Navigation */}
        {(!isMobile || !isClient) && (
          <div className="hidden md:flex flex-1 w-full justify-center items-center">
            <NavigationMenu className="flex w-full justify-between">
              <NavigationMenuList className="flex w-full justify-center items-center space-x-10">
                {navigationLinks.map((item) => (
                  <NavigationMenuItem
                    key={item.title}
                    className="flex w-full justify-center items-center">
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={`${navLinkStyle} ${
                          pathname === item.href ? "underline" : ""
                        }`}>
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* Logout Button */}
        <form action={logout}>
          <Button
            variant="ghost"
            className="text-yellow-900 text-xl font-semibold hover:text-red-500 hover:underline flex items-center gap-2">
            <FiLogOut className="text-2xl" /> {/* ✅ Icon Added */}
            Logout
          </Button>
        </form>

        {/* Mobile Hamburger Menu */}
        {isClient && isMobile && (
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
        )}

        {/* Mobile Sidebar */}
        {isClient && isMobile && mobileMenuOpen && (
          <SideBar
            sideBar={sideBar}
            setSideBar={setSideBar}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            navItems={navigationLinks}
          />
        )}
      </nav>
    </header>
  );
}
